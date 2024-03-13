import { makeAutoObservable } from "mobx";

import RootStore from "./root.store";

// TODO change to a view (not only the viewID)
// if the current view id is provided load view data and set

class ViewStore {
  private _currentViewID: string | undefined;

  // @ts-ignore
  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  //! Setter
  setCurrentView = (viewID: string): void => {
    this._currentViewID = viewID;
  };

  //! Getter
  get currentView(): string | undefined {
    return this._currentViewID;
  }
}

export default ViewStore;
