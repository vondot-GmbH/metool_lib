/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeAutoObservable } from "mobx";
import {
  LayoutBreakpoint,
  Widget,
  WidgetHierarchy,
  WidgetHierarchyMap,
  WidgetLayouts,
  WidgetPositioning,
} from "../schemas/widget.schemas/widget.schema";
import {
  DynamicWidgetStateMap,
  WidgetState,
} from "../globals/interfaces/widget.state.interface";
import ChangeRecordStore from "./change.record.store";
import { Layout } from "react-grid-layout";
import { convertLayoutToPositioningForBreakpoint } from "../globals/helpers/layout.helper";

class WidgetStore {
  private _dynamicWidgetStates: DynamicWidgetStateMap = new Map();
  private _structuredWidgetHierarchy: WidgetHierarchyMap = new Map();

  private changeRecordStore: ChangeRecordStore;

  constructor(changeRecordStore: ChangeRecordStore) {
    this.changeRecordStore = changeRecordStore;
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

  exportWidgetDataForTesting(): void {
    const widgets: Widget[] = [];

    // loop through all widgets in the map and add the widget to the array
    for (const change of this.changeRecordStore.getChangeRecords()) {
      widgets.push(change.data);
    }

    console.log("export widgets: ------");
    console.log(JSON.parse(JSON.stringify(widgets)));
    console.log("--------");
  }

  updateWidgetPositioningForBreakpoint(
    widgetID: string,
    breakpoint: LayoutBreakpoint,
    positioning: WidgetPositioning
  ): void {
    const widgetHierarchy =
      this.getStructuredWidgetHierarchyByWidgetID(widgetID);

    if (widgetHierarchy != null) {
      // update the positioning for the breakpoint
      widgetHierarchy.widget.positioning[breakpoint] = positioning;

      // update the widget with the new positioning
      this.setStructuredWidgetHierarchy(widgetID, widgetHierarchy);
    }
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

        // update the change record store
        this.changeRecordStore.setChangeWidgetRecord(
          widgetID,
          "UPDATE",
          widgetHierarchy.widget
        );
      }
    }
  }

  updateWidgetsLayoutForCurrentBreakpoint(
    updatedLayouts: Layout[],
    currentBreakpoint: LayoutBreakpoint
  ): void {
    const convertedLayouts = convertLayoutToPositioningForBreakpoint(
      updatedLayouts,
      currentBreakpoint
    );

    // loop through all updated widgets and update the positioning for the current breakpoint
    for (const widgetID in convertedLayouts) {
      const widgetLayouts = convertedLayouts[widgetID];

      // check if the widget exists
      if (widgetLayouts && widgetLayouts[currentBreakpoint]) {
        const widgetPositioning = widgetLayouts[currentBreakpoint];

        if (widgetPositioning) {
          this.updateWidgetPositioningForBreakpoint(
            widgetID,
            currentBreakpoint,
            widgetPositioning
          );

          // update the change record store
          this.changeRecordStore.setChangeWidgetRecord(
            widgetID,
            "UPDATE",
            this.getStructuredWidgetHierarchyByWidgetID(widgetID)?.widget
          );
        }
      }
    }
  }
}

export default WidgetStore;
