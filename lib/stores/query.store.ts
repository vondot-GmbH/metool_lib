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
  private _currentSelectedQuery: Query | null = null;

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

  setCurrentSelectedQuery(query: Query): void {
    this._currentSelectedQuery = query;
  }

  //! Getter

  get queries(): Query[] {
    return Array.from(this._queries.values());
  }

  getQuery(queryID: string): Query | undefined {
    return this._queries.get(queryID);
  }

  get currentSelectedQuery(): Query | null {
    return this._currentSelectedQuery;
  }

  //! Methods

  createInitialQuery(): Query {
    const query = {
      _id: "new",
      title: "New Query",
    } as Query;

    this.setCurrentSelectedQuery(query);

    return query;
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

  async createAndSaveQuery(query: Query): Promise<void> {
    const createQuery = this.getQuery(CoreRestQueryType.CREATE_QUERY);

    const preparedQuery = {
      ...createQuery,
      body: query,
    } as any;

    if (query == null) return;

    const response = await queryExecutor.executeRestQuery(preparedQuery, {});

    if (response == null) return;

    this.setCurrentSelectedQuery(response);
    this._queries.set(response._id, response);
  }
}

export default QueryStore;
