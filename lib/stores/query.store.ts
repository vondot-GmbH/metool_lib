import { makeAutoObservable } from "mobx";
import {
  CoreRestQueryType,
  Query,
  QueryMap,
} from "../schemas/query.schemas/query.schema";
import ConfigProvider from "../config/config.provider";
import StateStore, { Dependency, StateSelector } from "./state.store";
import { AnalyzedWidgetOptions } from "../schemas/widget.schemas/widget.schema";
import { queryExecutor } from "../provider/http/http.rest.query.client";

class QueryStore {
  private _queries: QueryMap = new Map();

  private _stateStore: StateStore;

  constructor(stateStore: StateStore) {
    this._stateStore = stateStore;
    makeAutoObservable(this);
  }

  async intializeCoreQueriesAndExecuteDependencies(
    analyzedWidgetOptions: Map<string, AnalyzedWidgetOptions>
  ): Promise<void> {
    const configProvider = ConfigProvider.getInstance();
    const coreQueries = configProvider.getCoreQueries();

    // Verwende map und flat, um eine flache Liste aller Abhängigkeiten zu erstellen
    const allDependencies = Array.from(analyzedWidgetOptions.values())
      .map((analyzedWidgetOption) => analyzedWidgetOption.dependencies)
      .flat();

    // Filtere die flache Liste, um nur Abhängigkeiten mit dem Selector 'queries' zu erhalten
    const queryDependencies = allDependencies.filter(
      (dependency) => dependency.selector === "queries"
    );

    if (coreQueries == null || queryDependencies == null) {
      return;
    }

    // set all provided core queries
    this.setQueries(coreQueries);

    await this.fetchAndSetQueries(queryDependencies);
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

  async fetchAndSetQueries(dpendencies: Dependency[]): Promise<void> {
    const filteredDependencies = dpendencies?.filter(
      (dep) => dep.selector === StateSelector.QUERIES
    );

    if (filteredDependencies == null) {
      return;
    }

    for (const dependency of filteredDependencies) {
      const queryID = dependency.widgetID ?? null; // TODO check and rename widgetID to targetID

      const query = this.getQuery(CoreRestQueryType.GET_QUERIES_BY_ID);

      console.log("queryID", queryID);
      console.log("query", query);

      if (queryID == null || query == null) continue;

      const response = await queryExecutor.executeRestQuery(query, {
        queryID: queryID,
      });

      this.setQueries([response]);

      // TODO Move method
      await this._stateStore?.executeAndProcessRestQueries([response]);
    }

    // this.setQueries(response);
  }
}

export default QueryStore;
