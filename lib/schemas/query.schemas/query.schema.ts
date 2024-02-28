import {
  DataSourceType,
  MixedResource,
  resourceRestSchema,
} from "../resource.schemas/resource.schema";
import * as yup from "yup";

export interface BaseQuery {
  _id: string | null; // TODO make this global
  title: string;
  resource: MixedResource; // object id of the resource
  description?: string;
  type: DataSourceType;
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

export const restQuerySchema = yup.object().shape({
  title: yup.string().required(),
  resource: resourceRestSchema.required(),
  description: yup.string(),
  type: yup.string().required(),
  method: yup.string().required(),
  url: yup.string().required(),
  headers: yup.array().of(
    yup.object().shape({
      key: yup.string().required(),
      value: yup.string().required(),
    })
  ),
  params: yup.string().notRequired(),
  body: yup.object().notRequired(),
});
