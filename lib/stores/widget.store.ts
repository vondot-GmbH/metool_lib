/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeAutoObservable } from "mobx";
import {
  Widget,
  WidgetHierarchy,
  WidgetHierarchyMap,
  WidgetLayouts,
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
  setDynamicWidgetState(widgetID: string, newState: WidgetState): void {
    this._dynamicWidgetStates.set(widgetID, newState);
  }

  setInitialStructuredWidgetHierarchyMap(
    hierarchyMap: WidgetHierarchyMap
  ): void {
    this._structuredWidgetHierarchy = hierarchyMap;
  }

  setStructuredWidgetHierarchy(
    widgetID: string,
    newHierarchy: WidgetHierarchy
  ): void {
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

  //! methods

  getAllWidgetsConvertedFromStructuredData(): Widget[] {
    const widgets: Widget[] = [];

    // loop through all widgets in the map and add the widget to the array
    for (const [id, value] of this._structuredWidgetHierarchy) {
      console.log(id);
      widgets.push(value.widget);
    }

    return widgets;
  }

  updateWidgetsLayout(updatedLayouts: Record<string, WidgetLayouts>): void {
    // loop through all updated widgets
    for (const widgetID in updatedLayouts) {
      const widgetLayouts = updatedLayouts[widgetID];
      const widgetHierarchy =
        this.getStructuredWidgetHierarchyByWidgetID(widgetID);

      if (widgetHierarchy != null) {
        // overwrite the old layout with the new one
        widgetHierarchy.widget.positioning = widgetLayouts;

        // update the widget with the new layout
        this.setStructuredWidgetHierarchy(widgetID, widgetHierarchy);
      }
    }
  }
}

export default WidgetStore;
