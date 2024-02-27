import { makeAutoObservable } from "mobx";
import { Query, QueryMap } from "../schemas/query.schemas/query.schema";

class QueryStore {
  private _queries: QueryMap = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  //! Setter
  setQueries(queries: Query[]): void {
    queries.forEach((query) => {
      if (query?._id) this._queries.set(query?._id, query);
    });
  }

  //! Getter

  get queries(): Query[] {
    return Array.from(this._queries.values());
  }

  getQuery(queryID: string): Query | undefined {
    return this._queries.get(queryID);
  }

  //! Methods

  addQuery(query: Query): void {
    if (query?._id) this._queries.set(query?._id, query);
  }

  updateQuery(query: Query): void {
    if (query?._id) this._queries.set(query?._id, query);
  }
}

export default QueryStore;
