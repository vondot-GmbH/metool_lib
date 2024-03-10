import {
  DataSourceType,
  MixedResource,
  resourceRestSchema,
} from "../resource.schemas/resource.schema";
import * as yup from "yup";

export interface BaseQuery {
  _id: string | null; // TODO make this global
  queryID: string;
  title: string;
  description?: string;
  resource: MixedResource; // object id of the resource
  resourceID: string;
  type: DataSourceType;
}

//! REST API

export interface RestQuery extends BaseQuery {
  type: DataSourceType.REST_API;
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  headers?: { key: string; value: string }[];
  params: string;
  body?: string;
}

export interface CoreRestQuery extends RestQuery {
  type: DataSourceType.REST_API;
  core: true;
}
export enum CoreRestQueryType {
  GET_QUERIES = "getQueries",
  GET_QUERIES_BY_ID = "getQueriesById",
  UPDATE_QUERY = "updateQuery",
  DELETE_QUERY = "deleteQuery",
  CREATE_QUERY = "createQuery",

  GET_RESOURCES = "getResources",
  GET_RESOURCES_BY_ID = "getResourcesById",
  UPDATE_RESOURCE = "updateResource",
  DELETE_RESOURCE = "deleteResource",
}

export interface CoreRestQuerConfig {
  // getWidgets: CoreRestQuery;
  // updateWidget: CoreRestQuery;
  // deleteWidget: CoreRestQuery;
  // createWidget: CoreRestQuery;

  [CoreRestQueryType.GET_QUERIES]: CoreRestQuery;
  [CoreRestQueryType.GET_QUERIES_BY_ID]: CoreRestQuery;
  [CoreRestQueryType.UPDATE_QUERY]: CoreRestQuery;
  [CoreRestQueryType.UPDATE_QUERY]: CoreRestQuery;
  [CoreRestQueryType.CREATE_QUERY]: CoreRestQuery;

  [CoreRestQueryType.GET_RESOURCES]: CoreRestQuery;
  [CoreRestQueryType.GET_RESOURCES_BY_ID]: CoreRestQuery;
  [CoreRestQueryType.UPDATE_RESOURCE]: CoreRestQuery;
  [CoreRestQueryType.DELETE_RESOURCE]: CoreRestQuery;
}

//! QUERY RESPONSE

export interface BaseQueryResponse extends BaseQuery {
  data: any;
}

export interface RestQueryResponse extends BaseQueryResponse {
  status: number;
  message: string;
  data: any;
  skip: number;
  limit: number;
}

//! types

export type Query = RestQuery; // ... | MOGGODB | POSTMARK ;
export type CoreQuery = CoreRestQuery; // ... | MOGGODB | POSTMARK ;
export type MixedQuery = Query | CoreQuery;

export type QueryMap = Map<string, Query>;
export type CoreQueryMap = Map<string, CoreQuery>;
export type MixedQueryMap = Map<string, MixedQuery>;

export const restQuerySchema = yup.object().shape({
  title: yup.string().required(),
  resource: resourceRestSchema.required(),
  description: yup.string(),
  type: yup.string().required(),
  method: yup.string().required(),
  url: yup.string().required(),
  headers: yup.array().of(
    yup
      .object()
      .shape({
        key: yup.string().required(),
        value: yup.string().required(),
      })
      .notRequired()
  ),
  params: yup.string().notRequired(),
  body: yup.string().notRequired(),
});
