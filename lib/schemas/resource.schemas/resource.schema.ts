export interface BaseResource {
  _id?: string;
  title: string;
  description?: string;
  type: DataSourceType;
}

export interface BaseCoreResource {
  title: string;
  description?: string;
  type: DataSourceType;
  coreResource: true; // defines resources that are set in code and cannot be edited
  key: string; // unique key for the resource instead of _id
}

//! REST API

export interface RestResource extends BaseResource {
  baseUrl: string;
  defaultHeaders?: { key: string; value: string }[];
  type: DataSourceType.REST_API;
}

export interface CoreRestResource extends BaseCoreResource {
  baseUrl: string;
  defaultHeaders?: { key: string; value: string }[];
  type: DataSourceType.REST_API;
}

//! types

export enum DataSourceType {
  REST_API = "REST_API",
}

export type Resource = RestResource; // ... | MOGGODB | POSTMARK ;
export type CoreResource = CoreRestResource; // ... | MOGGODB | POSTMARK ;
export type MixedResource = Resource | CoreResource;

export type ResourceMap = Map<string, Resource>;
export type CoreResourceMap = Map<string, CoreResource>;
export type MixedResourceMap = Map<string, MixedResource>;
