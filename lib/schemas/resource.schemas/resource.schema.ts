import { AxiosRequestConfig, AxiosResponse } from "axios";
import * as yup from "yup";

export interface BaseResource {
  _id?: string;
  resourceID: string;
  title: string;
  description?: string;
  type: DataSourceType;
}

export interface BaseCoreResource extends BaseResource {
  core: true; // defines resources that are set in code and cannot be edited
}

//! REST API

interface RequestInterceptor {
  fulfilled: (
    config: AxiosRequestConfig
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  rejected?: (error: any) => any;
}

interface ResponseInterceptor {
  fulfilled: (
    response: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse>;
  rejected?: (error: any) => any;
}

export interface RestResource extends BaseResource {
  baseUrl: string;
  defaultHeaders?: { key: string; value: string }[];
  type: DataSourceType.REST_API;
}

export interface CoreRestResource extends BaseCoreResource {
  baseUrl: string;
  type: DataSourceType.REST_API;
  defaultHeaders?: { key: string; value: string }[];
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
}

//! types

export enum DataSourceType {
  REST_API = "REST_API",
  MONGODB = "MONGODB",
}

export type Resource = RestResource; // ... | MOGGODB | POSTMARK ;
export type CoreResource = CoreRestResource; // ... | MOGGODB | POSTMARK ;
export type MixedResource = Resource | CoreResource;

export type ResourceMap = Map<string, Resource>;
export type CoreResourceMap = Map<string, CoreResource>;
export type MixedResourceMap = Map<string, MixedResource>;

//! yup schema for validation

export const resourceRestSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  type: yup.string().required(),
  baseUrl: yup.string().required(),
  defaultHeaders: yup.array().of(
    yup.object().shape({
      key: yup.string().required(),
      value: yup.string().required(),
    })
  ),
});
