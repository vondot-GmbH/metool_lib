import { DataSourceType } from "../resource.schemas/resource.schema";
import * as yup from "yup";

export interface BaseQuery {
  _id: string | null; // TODO make this global
  queryID: string;
  title: string;
  description?: string;
  resourceID: string;
  type: DataSourceType;
}

//! REST API

export interface RestQuery extends BaseQuery {
  type: DataSourceType.REST_API;
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  headers?: { key: string; value: string }[];
  params?: { key: string; value: string }[];
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
  CREATE_RESOURCE = "createResource",

  GET_WIDGETS = "getWidgets",
  GET_WIDGETS_BY_ID = "getWidgetsById",
  UPDATE_WIDGET = "updateWidget",
  DELETE_WIDGET = "deleteWidget",
  CREATE_WIDGET = "createWidget",

  GET_VIEWS = "getViews",
  GET_VIEW_BY_ID = "getViewById",
  UPDATE_VIEW = "updateView",
  DELETE_VIEW = "deleteView",
  CREATE_VIEW = "createView",

  GET_PAGES = "getPages",
  GET_PAGE_BY_ID = "getPageById",
  UPDATE_PAGE = "updatePage",
  DELETE_PAGE = "deletePage",
  CREATE_PAGE = "createPage",
}

export interface CoreRestQuerConfig {
  [CoreRestQueryType.GET_QUERIES]: CoreRestQuery;
  [CoreRestQueryType.GET_QUERIES_BY_ID]: CoreRestQuery;
  [CoreRestQueryType.UPDATE_QUERY]: CoreRestQuery;
  [CoreRestQueryType.DELETE_QUERY]: CoreRestQuery;
  [CoreRestQueryType.CREATE_QUERY]: CoreRestQuery;

  [CoreRestQueryType.GET_RESOURCES]: CoreRestQuery;
  [CoreRestQueryType.GET_RESOURCES_BY_ID]: CoreRestQuery;
  [CoreRestQueryType.UPDATE_RESOURCE]: CoreRestQuery;
  [CoreRestQueryType.DELETE_RESOURCE]: CoreRestQuery;
  [CoreRestQueryType.CREATE_RESOURCE]: CoreRestQuery;

  [CoreRestQueryType.GET_WIDGETS]: CoreRestQuery;
  [CoreRestQueryType.GET_WIDGETS_BY_ID]: CoreRestQuery;
  [CoreRestQueryType.UPDATE_WIDGET]: CoreRestQuery;
  [CoreRestQueryType.DELETE_WIDGET]: CoreRestQuery;
  [CoreRestQueryType.CREATE_WIDGET]: CoreRestQuery;

  [CoreRestQueryType.GET_VIEWS]: CoreRestQuery;
  [CoreRestQueryType.GET_VIEW_BY_ID]: CoreRestQuery;
  [CoreRestQueryType.UPDATE_VIEW]: CoreRestQuery;
  [CoreRestQueryType.DELETE_VIEW]: CoreRestQuery;
  [CoreRestQueryType.CREATE_VIEW]: CoreRestQuery;

  [CoreRestQueryType.GET_PAGES]: CoreRestQuery;
  [CoreRestQueryType.GET_PAGE_BY_ID]: CoreRestQuery;
  [CoreRestQueryType.UPDATE_PAGE]: CoreRestQuery;
  [CoreRestQueryType.DELETE_PAGE]: CoreRestQuery;
  [CoreRestQueryType.CREATE_PAGE]: CoreRestQuery;
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
  description: yup.string(),
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
  params: yup.array().of(
    yup
      .object()
      .shape({
        key: yup.string().required(),
        value: yup.string().required(),
      })
      .notRequired()
  ),
  body: yup.string().notRequired(),
});
