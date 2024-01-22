import { makeAutoObservable } from "mobx";
import { WidgetState } from "../globals/interfaces/widget.state.interface";

class WidgetStore {
  // TODO should we using DataItem type for _widgetStates ?
  private _widgetStates: Record<string, WidgetState> = {};

  constructor() {
    makeAutoObservable(this);
  }

  //! Setter
  setWidgetState(widgetID: string, newState: WidgetState) {
    this._widgetStates[widgetID] = newState;
  }

  //! Getter
  getWidgetState(widgetID: string): WidgetState | undefined {
    if (this._widgetStates[widgetID] == null) {
      return;
    }

    return JSON.parse(JSON.stringify(this._widgetStates[widgetID]));
  }
}

export default WidgetStore;
