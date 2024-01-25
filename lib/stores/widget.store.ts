import { makeAutoObservable } from "mobx";
import {
  WidgetHierarchy,
  WidgetHierarchyMap,
} from "../schemas/widget.schemas/widget.schema";
import {
  DynamicWidgetStateMap,
  WidgetState,
} from "../globals/interfaces/widget.state.interface";

class WidgetStore {
  private _dynamicWidgetStates: DynamicWidgetStateMap = new Map();
  private _structuredWidgetHierarchy: WidgetHierarchyMap = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  //! setter
  setDynamicWidgetState(widgetID: string, newState: WidgetState) {
    this._dynamicWidgetStates.set(widgetID, newState);
  }

  setInitialStructuredWidgetHierarchyMap(hierarchyMap: WidgetHierarchyMap) {
    this._structuredWidgetHierarchy = hierarchyMap;
  }

  setStructuredWidgetHierarchy(
    widgetID: string,
    newHierarchy: WidgetHierarchy
  ) {
    this._structuredWidgetHierarchy.set(widgetID, newHierarchy);
  }

  //! getter

  getStructuredWidgetHierarchyByWidgetID(
    widgetID: string
  ): WidgetHierarchy | undefined {
    if (this._structuredWidgetHierarchy.get(widgetID) == null) {
      return;
    }

    return JSON.parse(
      JSON.stringify(this._structuredWidgetHierarchy.get(widgetID))
    );
  }

  getStructuredData() {
    return JSON.parse(JSON.stringify(this._structuredWidgetHierarchy));
  }

  getDynamicStateByWidgetID(widgetID: string): WidgetState | undefined {
    if (this._dynamicWidgetStates.get(widgetID) == null) {
      return;
    }

    return JSON.parse(JSON.stringify(this._dynamicWidgetStates.get(widgetID)));
  }
}

export default WidgetStore;
