import { makeAutoObservable } from "mobx";
import { DataItem } from "../globals/interfaces/pagination.interface";
import { View_old } from "../schemas/view.schemas/view.schema";

class ViewStore {
  private _currentView: DataItem<View_old> = {
    data: undefined,
    isLoading: false,
  };

  constructor() {
    makeAutoObservable(this);
  }

  //! Setter
  setCurrentView = (view: View_old): void => {
    this._currentView.data = view;
  };

  //! Getter
  get currentView(): DataItem<View_old> | undefined {
    if (this._currentView == null) {
      return;
    }

    return JSON.parse(JSON.stringify(this._currentView));
  }
}

export default ViewStore;
