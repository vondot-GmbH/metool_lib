import { makeAutoObservable } from "mobx";
import { DataItem } from "../globals/interfaces/pagination.interface";
import { View } from "../schemas/view.schemas/view.schema";

class ViewStore {
  private _currentView: DataItem<View> = {
    data: undefined,
    isLoading: false,
  };

  constructor() {
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
