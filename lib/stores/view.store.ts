import { makeAutoObservable } from "mobx";

import RootStore from "./root.store";
import { CoreRestQueryType } from "../schemas/query.schemas/query.schema";
import { queryExecutor } from "../provider/http/http.rest.query.client";
import { View } from "../schemas/view.schemas/view.schema";

// TODO change to a view (not only the viewID)
// if the current view id is provided load view data and set

class ViewStore {
  private _currentView: View | undefined;

  // @ts-ignore
  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  //! Setter

  setCurrentView = (view: View): void => {
    this._currentView = view;
  };

  //! Getter
  get currentView(): View | undefined {
    return this._currentView;
  }

  //! Methods

  intializeView = async (viewID: string): Promise<void> => {
    return await this.fetchAndSaveViewById(viewID);
  };

  async fetchAndSaveViewById(viewID: string): Promise<void> {
    const viewQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.GET_VIEW_BY_ID
    );

    console.log("viewQuery from fetchAndSaveViewById::");
    console.log(viewQuery);

    if (viewQuery == null || viewID == null) return;

    console.log("bevore executeRestQuery::");

    const response = await queryExecutor.executeRestQuery(
      viewQuery,
      {
        viewID: viewID,
      },
      this.stores.resourceStore
    );

    console.log("response from fetchAndSaveViewById::");
    console.log(response);

    if (response == null) return;

    console.log("set curretn view::");

    this.setCurrentView(response);
  }
}

export default ViewStore;
