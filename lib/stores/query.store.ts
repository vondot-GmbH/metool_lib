import { makeAutoObservable } from "mobx";
import {
  CoreRestQueryType,
  Query,
  QueryMap,
} from "../schemas/query.schemas/query.schema";
import ConfigProvider from "../config/config.provider";
import { Dependency, StateSelector } from "./state.store";
import { AnalyzedWidgetOptions } from "../schemas/widget.schemas/widget.schema";
import { queryExecutor } from "../provider/http/http.rest.query.client";
import RootStore from "./root.store";
import { getUniqueID } from "../globals/helpers/global.helper";

class QueryStore {
  private _queries: QueryMap = new Map();
  private _currentSelectedQuery: Query | null = null;

  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
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

    await this.stores.resourceStore?.fetchAllResourcesAndSave();

    await this.fetchAndSetQueries(queryDependencies);
  }

  //! Setter
  setQueries(queries: Query[]): void {
    queries.forEach((query) => {
      if (query?.queryID) this._queries.set(query?.queryID, query);
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
      _id: null,
      queryID: getUniqueID(),
      title: "New Query",
    } as Query;

    this.setCurrentSelectedQuery(query);

    return query;
  }

  async fetchAndSetQueries(dependencies: Dependency[]): Promise<void> {
    const filteredDependencies = dependencies?.filter(
      (dep) => dep.selector === StateSelector.QUERIES
    );

    if (filteredDependencies == null) {
      return;
    }

    for (const dependency of filteredDependencies) {
      const queryID = dependency.widgetID ?? null; // TODO check and rename widgetID to targetID

      const query = this.getQuery(CoreRestQueryType.GET_QUERIES_BY_ID);

      console.log("getQuery dep: ", query);

      if (queryID == null || query == null) continue;

      const response = await queryExecutor.executeRestQuery(
        query,
        {
          queryID: queryID,
        },
        this.stores.resourceStore
      );

      this.setQueries([response]);

      // TODO Move method
      await this.stores.stateStore?.executeAndProcessRestQueries([response]);
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

    const response = await queryExecutor.executeRestQuery(
      preparedQuery,
      {},
      this.stores.resourceStore
    );

    if (response == null) return;

    this.setCurrentSelectedQuery(response);
    this._queries.set(query.queryID, response);
  }

  async updateAndSaveQuery(query: Query): Promise<void> {
    const updateQuery = this.getQuery(CoreRestQueryType.UPDATE_QUERY);

    const preparedQuery = {
      ...updateQuery,
      body: query,
    } as any;

    if (query == null) return;

    const response = await queryExecutor.executeRestQuery(
      preparedQuery,
      { queryID: query.queryID },
      this.stores.resourceStore
    );

    if (response == null) return;

    this.setCurrentSelectedQuery(response);
    this._queries.set(query.queryID, response);
  }
}

export default QueryStore;
