import { makeAutoObservable } from "mobx";
import {
  CoreRestQueryType,
  Query,
  QueryMap,
  RestQuery,
} from "../schemas/query.schemas/query.schema";
import ConfigProvider from "../config/config.provider";
import { Dependency, StateSelector } from "./state.store";
import { AnalyzedWidgetOptions } from "../schemas/widget.schemas/widget.schema";
import { queryExecutor } from "../provider/http/http.rest.query.client";
import RootStore from "./root.store";
import { getUniqueID } from "../globals/helpers/global.helper";
import { EditorMode } from "../globals/enums/editor.enum";

class QueryStore {
  private _queries: QueryMap = new Map();
  private _currentSelectedQuery: Query | null = null;

  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  async executeAndSaveDependencies(
    analyzedWidgetOptions: Map<string, AnalyzedWidgetOptions>
  ): Promise<void> {
    // fetch all queries if the editor mode is set otherwise only fetch the dependencies for the current view
    const fetchAllQueries =
      this.stores.editorStore?.editorMode == EditorMode.EDIT ? true : false;

    // create a flat list of all dependencies from the analyzedWidgetOptions
    const allDependencies = Array.from(analyzedWidgetOptions.values())
      .map((analyzedWidgetOption) => analyzedWidgetOption.dependencies)
      .flat();

    // filter out all dependencies that are queries
    const queryDependencies = allDependencies.filter(
      (dependency) => dependency.selector === "queries"
    );

    if (queryDependencies == null) {
      return;
    }

    await this.stores.resourceStore?.fetchAllResourcesAndSave();

    await this.fetchAndExecuteQueryDependencies(
      queryDependencies,
      fetchAllQueries
    );
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

  intializeQueries(queries?: Query[]): Query[] {
    const configProvider = ConfigProvider.getInstance();
    const coreQueries = configProvider.getCoreQueries();

    // set all provided queries
    if (queries != null) this.setQueries(queries);

    // set all core queries from the config provider
    if (coreQueries != null) this.setQueries(coreQueries);

    return this.queries;
  }

  createInitialQuery(): Query {
    const query = {
      queryID: "new",
      title: "New Query",
    } as Query;

    this.setCurrentSelectedQuery(query);

    return query;
  }

  async fetchAndExecuteQueryDependencies(
    dependencies: Dependency[],
    fetchAllQueries?: boolean
  ): Promise<RestQuery[] | undefined> {
    const queries: RestQuery[] = [];

    const filteredDependencies = dependencies?.filter(
      (dep) => dep.selector === StateSelector.QUERIES
    );

    if (fetchAllQueries) {
      const fetchedQueries = await this.fetchAndSaveRestQueries();
      if (fetchedQueries) queries.push(...fetchedQueries);
    }

    for (const dependency of filteredDependencies) {
      let requestedQuery = this.getQuery(dependency.identifierID);

      const queryID = dependency.identifierID;

      if (!fetchAllQueries || requestedQuery == null) {
        requestedQuery = await this.fetchAndSaveRestQueryById(queryID);

        if (requestedQuery == null) continue;

        queries.push(requestedQuery);
      }
    }

    await this.stores.stateStore?.executeAndProcessRestQueries(queries);

    return queries;
  }

  async fetchAndSaveRestQueryById(
    queryID: string
  ): Promise<RestQuery | undefined> {
    const query = this.getQuery(CoreRestQueryType.GET_QUERIES_BY_ID);

    if (queryID == null || query == null) return;

    const response = await queryExecutor.executeRestQuery(
      query,
      {
        queryID: queryID,
      },
      this.stores.resourceStore
    );

    if (response == null) return;

    this._queries.set(response?.queryID, response);

    return response;
  }

  async fetchAndSaveRestQueries(): Promise<RestQuery[]> {
    const query = this.getQuery(CoreRestQueryType.GET_QUERIES);

    if (query == null) return [];

    const response = await queryExecutor.executeRestQuery(
      query,
      {},
      this.stores.resourceStore
    );

    if (response == null) return [];

    this.setQueries(response);

    return response;
  }

  async createAndSaveQuery(query: Query): Promise<void> {
    const createQuery = this.getQuery(CoreRestQueryType.CREATE_QUERY);

    const preparedQuery = {
      ...createQuery,
      body: {
        ...query,
        queryID: getUniqueID(),
      },
    } as any;

    const response = await queryExecutor.executeRestQuery(
      preparedQuery,
      {},
      this.stores.resourceStore
    );

    if (response == null) return;

    this.setCurrentSelectedQuery(response);
    this._queries.set(response?.queryID, response);
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

    if (response == null || response?.queryID == null) return;

    this.setCurrentSelectedQuery(response);
    this._queries.set(response?.queryID, response);
  }
}

export default QueryStore;
