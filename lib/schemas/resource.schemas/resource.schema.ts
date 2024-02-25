export interface BaseResource {
  _id?: string;
  resourceID: string;
  description?: string;
  type: DataSourceType;
}

export interface RestResource extends BaseResource {
  baseUrl: string;
  defaultHeaders?: { key: string; value: string }[];
}

export enum DataSourceType {
  REST_API = "REST_API",
}

export type Resource = RestResource; // ... | MOGGODB | POSTMARK ;

export type ResourceMap = Map<string, Resource>;
