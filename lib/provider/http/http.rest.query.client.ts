import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import ConfigProvider from "../../config/config.provider";
import {
  CoreRestResource,
  DataSourceType,
  Resource,
} from "../../schemas/resource.schemas/resource.schema";
import { Query } from "../../main";

class QueryExecutor<Q extends Query> {
  // process and execute the querys for REST_API type and returns the response
  async executeRestQuery(
    query: Q,
    variables: Record<string, string>
  ): Promise<any> {
    let resource: Resource | undefined = query?.resource;

    // check if query is of type REST_API
    if (query.type != DataSourceType.REST_API) {
      console.error("Query type is not REST_API");
      return null;
    }

    const resourceID = query?.resource?._id;
    const isCoreResource = (query?.resource as any)?.core ?? false;

    // if resource is a core resource, get it from the config provider
    if (isCoreResource) {
      resource = ConfigProvider.getInstance().getCoreResource(
        resourceID as string
      );
    }

    if (resource == null) {
      console.error("Resource not found");
      return null;
    }

    // create an axios instance with the data from query and resource
    const config = this.createAxiosConfig(query, resource, variables);
    const axiosInstance = axios.create(config);

    // if resource is a core resource, apply interceptors if exist
    if (isCoreResource) {
      this.applyInterceptors(axiosInstance, resource as CoreRestResource);
    }

    try {
      const response = await axiosInstance.request(config);
      return response.data;
    } catch (error) {
      throw new Error(`Request failed: ${error}`); // TODO
    }
  }

  private createAxiosConfig(
    query: Q,
    resource: Resource,
    variables: Record<string, string>
  ): AxiosRequestConfig {
    const headers = this.processHeaders(query);

    const url = this.resolveUrl(query.url, variables); // TODO resovle params too

    const config: AxiosRequestConfig = {
      baseURL: resource.baseUrl, // TODO resolve base url
      headers: headers,
      url,
      method: query.method,
      data: query.body,
    };

    return config;
  }

  private processHeaders(query: Q): Record<string, string> {
    const headers: Record<string, string> = {};

    const defaultHeaders = query?.resource?.defaultHeaders;
    const queryHeaders = query?.headers;

    if (defaultHeaders) {
      defaultHeaders.forEach((header) => {
        headers[header.key] = header.value;
      });
    }

    if (queryHeaders) {
      queryHeaders.forEach((header) => {
        headers[header.key] = header.value;
      });
    }

    return headers;
  }

  private applyInterceptors(
    axiosInstance: AxiosInstance,
    resource: CoreRestResource
  ): void {
    const { requestInterceptors, responseInterceptors } = resource;

    if (requestInterceptors != null && requestInterceptors.length > 0) {
      resource.requestInterceptors?.forEach((interceptor) => {
        const { fulfilled, rejected } = interceptor;

        const fulfilledWrapper = (
          config: AxiosRequestConfig
        ): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
          // Stelle sicher, dass headers immer definiert sind
          if (!config.headers) {
            config.headers = {};
          }

          // Rufe die ursprüngliche fulfilled-Funktion auf und stelle sicher, dass der Rückgabetyp korrekt ist
          const result = fulfilled(config);
          return result as AxiosRequestConfig | Promise<AxiosRequestConfig>;
        };

        // Verwende fulfilledWrapper direkt, ohne falsche Typumwandlung
        axiosInstance.interceptors.request.use(
          fulfilledWrapper as any,
          rejected
        );
      });
    }

    if (responseInterceptors != null && responseInterceptors.length > 0) {
      // Behandle responseInterceptors ähnlich
      resource.responseInterceptors?.forEach(({ fulfilled, rejected }) => {
        const fulfilledResponseWrapper = (
          response: AxiosResponse
        ): AxiosResponse | Promise<AxiosResponse> => {
          // Rufe die ursprüngliche fulfilled-Funktion auf und stelle sicher, dass der Rückgabetyp korrekt ist
          const result = fulfilled(response);
          return result as AxiosResponse | Promise<AxiosResponse>;
        };

        axiosInstance.interceptors.response.use(
          fulfilledResponseWrapper,
          rejected
        );
      });
    }
  }

  private resolveUrl(
    urlTemplate: string,
    variables: Record<string, string>,
    queryParams?: Record<string, string | string[]>
  ): string {
    // Ersetze Platzhalter in der URL mit den Werten aus `variables`
    let resolvedUrl = this.replacePlaceholders(urlTemplate, variables);

    // Füge Query-Parameter hinzu, wobei Platzhalter ebenfalls ersetzt werden
    if (queryParams) {
      const resolvedQueryParams: Record<string, string | string[]> = {};
      for (const key in queryParams) {
        const value = queryParams[key];
        if (Array.isArray(value)) {
          resolvedQueryParams[key] = value.map((val) =>
            this.replacePlaceholders(val, variables)
          );
        } else {
          resolvedQueryParams[key] = this.replacePlaceholders(value, variables);
        }
      }

      const queryString = new URLSearchParams(
        resolvedQueryParams as Record<string, string>
      ).toString();
      resolvedUrl += `?${queryString}`;
    }

    return resolvedUrl;
  }

  // replace placeholders from string with values from variables
  private replacePlaceholders(
    template: string,
    variables: Record<string, string>
  ): string {
    return template.replace(/:([a-zA-Z0-9_]+)|{{(.*?)}}/g, (_, key1, key2) => {
      const key = key1 || key2; // :key or {{key}}
      const value = variables[key];
      if (value === undefined) {
        console.warn(`Placeholder ${key} not found.`);
        return _;
      }
      return encodeURIComponent(value);
    });
  }
}

export const queryExecutor = new QueryExecutor();
