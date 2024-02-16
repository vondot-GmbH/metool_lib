import { makeAutoObservable } from "mobx";
import {
  Widget,
  WidgetHierarchy,
  WidgetHierarchyMap,
  WidgetLayouts,
  WidgetPositioning,
} from "../schemas/widget.schemas/widget.schema";
import { WidgetContextMenu } from "../globals/interfaces/widget.state.interface";
import ChangeRecordStore from "./change.record.store";
import { Layout } from "react-grid-layout";
import { structureWidgetsHierarchy } from "../globals/helpers/widget.helper";
import { convertLayoutToPositioningForBreakpoint } from "../globals/helpers/layout.helper";

class WidgetStore {
  private _structuredWidgetHierarchy: WidgetHierarchyMap = new Map();

  // TODO maby move this to editor store
  private _selectedWidget: WidgetHierarchy | undefined;

  // TODO maby move this to editor store
  private _contextMenu: WidgetContextMenu = {
    isOpen: false,
    anchorPoint: { x: 0, y: 0 },
    selectedWidgetID: null,
  };

  private changeRecordStore: ChangeRecordStore;

  constructor(changeRecordStore: ChangeRecordStore) {
    this.changeRecordStore = changeRecordStore;
    makeAutoObservable(this);
  }

  //! setter

  setInitialWidgetAndConvert(widgets: Widget[]): WidgetHierarchyMap {
    const structuredWidgets = structureWidgetsHierarchy(widgets);
    this._structuredWidgetHierarchy = structuredWidgets;
    return this._structuredWidgetHierarchy;
  }

  setStructuredWidgetHierarchy(
    widgetID: string,
    newHierarchy: WidgetHierarchy
  ): void {
    this._structuredWidgetHierarchy.set(widgetID, newHierarchy);
  }

  setSelectWidget(widgetID: string | undefined): void {
    if (widgetID == null) {
      this._selectedWidget = undefined;
      return;
    }

    const selectedWidget = this._structuredWidgetHierarchy.get(widgetID);

    if (selectedWidget == null) {
      this._selectedWidget = undefined;
      return;
    }

    this._selectedWidget = selectedWidget;
  }

  setContextMenuState(contextMenu: WidgetContextMenu): void {
    this._contextMenu = contextMenu;
  }

  // TODO
  exportWidgetsTEST() {
    const widgets = [] as any[];
    const widget = this.getStructuredData();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [key, value] of Object.entries(widget)) {
      widgets.push(value.widget);
    }

    return JSON.stringify(widgets, null, 2);
  }

  //! getter

  getStructuredWidgetHierarchyByWidgetID(
    widgetID: string
  ): WidgetHierarchy | undefined {
    if (this._structuredWidgetHierarchy.get(widgetID) == null) {
      return;
    }

    return this._structuredWidgetHierarchy.get(widgetID);
  }

  getStructuredData(): WidgetHierarchyMap {
    return JSON.parse(JSON.stringify(this._structuredWidgetHierarchy));
  }

  getSelectedWidget(): WidgetHierarchy | undefined {
    if (this._selectedWidget == null) {
      return;
    }

    return this._selectedWidget;
  }

  getContextMenuState(): WidgetContextMenu {
    return JSON.parse(JSON.stringify(this._contextMenu));
  }

  //! methods

  updateWidgetOption(widgetID: string, optionName: string, value: any): void {
    const widgetHierarchy =
      this.getStructuredWidgetHierarchyByWidgetID(widgetID);

    if (widgetHierarchy != null) {
      const options = widgetHierarchy.widget.options ?? {};

      options[optionName] = value;
      this.setStructuredWidgetHierarchy(widgetID, widgetHierarchy);

      this.changeRecordStore.setChangeWidgetRecord(
        widgetID,
        "UPDATE",
        widgetHierarchy.widget
      );
    }
  }

  getWidgetOption(widgetID: string, optionName: string): any {
    const widgetHierarchy =
      this.getStructuredWidgetHierarchyByWidgetID(widgetID);

    if (widgetHierarchy != null) {
      return widgetHierarchy.widget.options?.[optionName] ?? null;
    }
  }

  updateWidgetPositioningForBreakpoint(
    widgetID: string,
    breakpoint: string,
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
    currentBreakpoint: string,
    breakPoints: { [key: string]: number }
  ): void {
    const convertedLayouts = convertLayoutToPositioningForBreakpoint(
      updatedLayouts,
      currentBreakpoint,
      breakPoints
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
            widgetPositioning as WidgetPositioning
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

  deleteWidget(widgetID: string, isRootCall = true): void {
    // get the widget to delete from the map
    const widgetToDelete =
      this.getStructuredWidgetHierarchyByWidgetID(widgetID);

    // check if the widget exists
    if (widgetToDelete == null) {
      return;
    }

    // if this is the root call (not a recursive call), update the parent widget's children list
    if (isRootCall && widgetToDelete.level === "NESTED") {
      for (const [parentID, parentWidget] of this._structuredWidgetHierarchy) {
        const childIndex = parentWidget.children.indexOf(widgetID);

        if (childIndex !== -1) {
          // remove the widget from the parent widget's children list
          parentWidget.children.splice(childIndex, 1);
          this._structuredWidgetHierarchy.set(parentID, parentWidget);
          break;
        }
      }
    }

    // get the children of the widget to delete
    const childrenIDs = widgetToDelete.children;

    // delete all children of the widget to delete
    for (const childID of childrenIDs) {
      this.deleteWidget(childID, false);
    }

    // delete the widget from the map
    this._structuredWidgetHierarchy.delete(widgetID);

    // set the change record for the widget to delete
    this.changeRecordStore.setChangeWidgetRecord(
      widgetID,
      "DELETE",
      widgetToDelete.widget
    );
  }

  addWidget(args: {
    widgetType: string;
    layout: Layout;
    parentID: string | null;
    currentBreakpoint: string;
  }): void {
    const { widgetType, layout, parentID, currentBreakpoint } = args;

    const widgetID = layout.i;

    // create the new widget object
    const newWidget: WidgetHierarchy = {
      widget: {
        widgetID,
        widgetType,
        view: "",
        positioning: {
          i: widgetID,

          [currentBreakpoint]: {
            x: layout.x,
            y: layout.y,
            w: layout.w,
            h: layout.h,
          },
        } as any,
      },
      children: [],
      level: parentID ? "NESTED" : "ROOT",
    };

    if (parentID) {
      newWidget.widget.parentID = parentID;
    }

    // add the new widget to the map
    this._structuredWidgetHierarchy.set(widgetID, newWidget);

    // check if the widget has a parent widget and add the widget to the children of the parent widget
    if (parentID) {
      const parentWidget = this._structuredWidgetHierarchy.get(parentID);

      if (parentWidget) {
        parentWidget.children.push(widgetID);
        this._structuredWidgetHierarchy.set(parentID, parentWidget);
      }
    }

    // set the change record for the new widget
    this.changeRecordStore.setChangeWidgetRecord(
      widgetID,
      "CREATE",
      newWidget.widget
    );
  }
}

export default WidgetStore;
