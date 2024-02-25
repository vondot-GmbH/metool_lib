import { DataSourceType } from "../resource.schemas/resource.schema";

export interface BaseQuery {
  _id?: string;
  queryID: string;
  description?: string;
  type: DataSourceType;
  query: string;
  transformer?: string;
  queryTimeout?: number;
  events?: Event[];
}

export interface RestQuery extends BaseQuery {
  type: DataSourceType.REST_API;
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  headers?: { key: string; value: string }[];
  params: string;
  body?: any;
}

export type Query = RestQuery; // ... | MOGGODB | POSTMARK ;

export type QueryMap = Map<string, Query>;
