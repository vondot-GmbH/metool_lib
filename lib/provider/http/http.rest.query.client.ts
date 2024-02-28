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
  async executeRestQuery(query: Q): Promise<any> {
    let resource: Resource | undefined = undefined;

    // check if query is of type REST_API
    if (query.type != DataSourceType.REST_API) {
      return null;
    }

    const resourceID = query?.resource?._id;
    const isCoreResource = (query?.resource as any)?.coreResource ?? false;

    // if resource is a core resource, get it from the config provider
    if (isCoreResource) {
      resource = ConfigProvider.getInstance().getCoreResource(
        resourceID as string
      );
    }

    if (resource == null) {
      return null;
    }

    // create an axios instance with the data from query and resource
    const config = this.createAxiosConfig(query, resource);
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

  private createAxiosConfig(query: Q, resource: Resource): AxiosRequestConfig {
    const headers = this.processHeaders(query);

    const config: AxiosRequestConfig = {
      baseURL: resource.baseUrl,
      headers: headers,
      url: query.url,
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
}

export const queryExecutor = new QueryExecutor();
