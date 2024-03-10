import { makeAutoObservable } from "mobx";
import { DataItem } from "../globals/interfaces/pagination.interface";
import { View } from "../schemas/view.schemas/view.schema";
import RootStore from "./root.store";

class ViewStore {
  private _currentView: DataItem<View> = {
    data: undefined,
    isLoading: false,
  };

  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  //! Setter
  setCurrentView = (view: View): void => {
    this._currentView.data = view;
  };

  //! Getter
  get currentView(): DataItem<View> | undefined {
    if (this._currentView == null) {
      return;
    }

    return JSON.parse(JSON.stringify(this._currentView));
  }
}

export default ViewStore;
