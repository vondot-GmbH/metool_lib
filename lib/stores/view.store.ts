import { makeAutoObservable } from "mobx";
import RootStore from "./root.store";
import { CoreRestQueryType } from "../schemas/query.schemas/query.schema";
import { queryExecutor } from "../provider/http/http.rest.query.client";
import { View } from "../schemas/view.schemas/view.schema";
import { getUniqueID } from "../globals/helpers/global.helper";

class ViewStore {
  private _currentSelectedView: View | undefined;

  private _views: Map<string, View> = new Map();

  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  //! Setter

  setCurrentSelectedView = (view: View): void => {
    this._currentSelectedView = view;
  };

  setViews = (views: View[]): void => {
    views.forEach((view: View) => {
      if (view?.viewID == null) return;
      this._views.set(view.viewID, view);
    });
  };

  //! Getter
  get currentSelectedView(): View | undefined {
    return this._currentSelectedView;
  }

  get views(): View[] {
    return Array.from(this._views.values());
  }

  getView(viewID: string): View | undefined {
    return this._views.get(viewID);
  }

  //! Methods

  createInitialView(): View {
    const view = {
      viewID: "new",
      name: "New View",
    } as View;

    this.setCurrentSelectedView(view);

    return view;
  }

  intializeView = async (viewID: string): Promise<void> => {
    const viewExists = this.getView(viewID);

    if (viewExists) {
      this.setCurrentSelectedView(viewExists);
      return;
    }

    return await this.fetchAndSaveViewById(viewID);
  };

  async fetchAndSaveViews(viewIDs: string[]): Promise<View[] | undefined> {
    const viewQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.GET_VIEWS
    );

    if (!viewQuery || !viewIDs.length) return;

    // filter the views by viewIDs
    const additionalParams = {
      filter: JSON.stringify({ viewID: { $in: viewIDs } }),
    };

    const response = await queryExecutor.executeRestQuery(
      viewQuery,
      {},
      this.stores.resourceStore,
      additionalParams
    );

    if (!response) return;

    this.setViews(response);

    return response;
  }

  // TODO
  // async getViewById(viewID: string): Promise<View | undefined> {
  //   let view = this.getView(viewID);

  //   if (view == null) {
  //     const viewQuery = this.stores.queryStore.getQuery(
  //       CoreRestQueryType.GET_VIEW_BY_ID
  //     );

  //     if (viewQuery == null || viewID == null) return;

  //     view = await queryExecutor.executeRestQuery(
  //       viewQuery,
  //       {
  //         viewID: viewID,
  //       },
  //       this.stores.resourceStore
  //     );

  //     if (view == null) return;
  //   }

  //   return view;
  // }

  async fetchAndSaveViewById(viewID: string): Promise<void> {
    const viewQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.GET_VIEW_BY_ID
    );

    if (viewQuery == null || viewID == null) return;

    const response = await queryExecutor.executeRestQuery(
      viewQuery,
      {
        viewID: viewID,
      },
      this.stores.resourceStore
    );

    if (response == null) return;

    this.setCurrentSelectedView(response);
    this.setViews([response]);
  }

  async updateAndSaveView(view: View): Promise<void> {
    const updateQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.UPDATE_VIEW
    );

    if (view == null || updateQuery == null) return;

    const preparedView = {
      ...updateQuery,
      body: view,
    } as any;

    const response = await queryExecutor.executeRestQuery(
      preparedView,
      { viewID: view.viewID },
      this.stores.resourceStore
    );

    if (response == null || response?.viewID == null) return;

    this.setCurrentSelectedView(response);
    this.setViews([response]);
  }

  async createAndSaveViewForPage(view: View): Promise<void> {
    const createQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.CREATE_VIEW
    );

    const preparedView = {
      ...createQuery,
      body: {
        ...view,
        viewID: getUniqueID(),
      },
    } as any;

    const response = await queryExecutor.executeRestQuery(
      preparedView,
      {},
      this.stores.resourceStore
    );

    if (response == null || response?.viewID == null) return;

    this.setCurrentSelectedView(response);
    this.setViews([response]);
    await this.stores.pageStore.addViewToCurrentPageAndSave(response?.viewID);
  }
}

export default ViewStore;
