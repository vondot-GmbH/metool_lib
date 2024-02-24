export interface Query {
  _id?: string;
  queryID: string;
  resource: string;
  actionType: string;
  query: string;
  params: string;
}

export type QueryMap = Map<string, Query>;
