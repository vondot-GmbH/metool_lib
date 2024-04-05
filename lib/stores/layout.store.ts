import { makeAutoObservable, runInAction } from "mobx";
import {
  AnalyzedWidgetOptions,
  Widget,
  WidgetHierarchy,
  WidgetHierarchyLocation,
  WidgetHierarchyMap,
  WidgetPositioning,
} from "../schemas/widget.schemas/widget.schema";
import RootStore from "./root.store";
import { structureWidgetsHierarchy } from "../globals/helpers/widget.helper";
import { extractDependenciesAndNonDependencies } from "../globals/helpers/state.helper";
import { CoreRestQueryType } from "../schemas/query.schemas/query.schema";
import { queryExecutor } from "../providers/http/http.rest.query.client";
import { Layout } from "react-grid-layout";
import { convertLayoutToPositioningForBreakpoint } from "../globals/helpers/layout.helper";

class LayoutStore {
  private _structuredLayoutAreaWidgets: WidgetHierarchyMap = new Map();
  private _analyzedLayoutWidgetOptions: Map<string, AnalyzedWidgetOptions> =
    new Map();

  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  //! setter
  setInitialLayoutAreaWidgetAndConvert(widgets: Widget[]): WidgetHierarchyMap {
    const structuredWidgets = structureWidgetsHierarchy(widgets);

    runInAction(() => {
      this._structuredLayoutAreaWidgets = structuredWidgets;
    });

    const widgetIDs = Array.from(this._structuredLayoutAreaWidgets.keys());

    for (let i = 0; i < widgetIDs.length; i++) {
      const widgetID = widgetIDs[i];
      const widgetHierarchy = this._structuredLayoutAreaWidgets.get(widgetID);

      if (widgetHierarchy) {
        const { dependencies, nonDependencies } =
          extractDependenciesAndNonDependencies(widgetHierarchy.widget.options);

        runInAction(() => {
          this._analyzedLayoutWidgetOptions.set(widgetID, {
            options: nonDependencies,
            dependencies: dependencies,
          });
        });
      }
    }

    return this._structuredLayoutAreaWidgets;
  }

  setStructuredLayoutAreaWidget(
    widgetID: string,
    newHierarchy: WidgetHierarchy
  ): void {
    this._structuredLayoutAreaWidgets.set(widgetID, newHierarchy);
  }

  //! getter

  getAnalyzedLayoutWidgetOption(
    widgetID: string
  ): AnalyzedWidgetOptions | undefined {
    return this._analyzedLayoutWidgetOptions.get(widgetID);
  }

  getStructuredLayoutAreaWidget(): WidgetHierarchyMap {
    return this._structuredLayoutAreaWidgets;
  }

  getStructuredLayoutAreaWidgeyByWidgetID(
    widgetID: string
  ): WidgetHierarchy | undefined {
    if (this._structuredLayoutAreaWidgets.get(widgetID) == null) {
      return;
    }

    return this._structuredLayoutAreaWidgets.get(widgetID);
  }

  getWidgetsForLayoutArea(layoutAreaID: string): WidgetHierarchy[] {
    const widgets: WidgetHierarchy[] = [];

    this._structuredLayoutAreaWidgets.forEach((widgetHierarchy) => {
      if (widgetHierarchy.widget.layoutAreaID === layoutAreaID) {
        widgets.push(widgetHierarchy);
      }
    });

    return widgets;
  }

  getLayoutAreaWidget(widgetID: string): WidgetHierarchy | undefined {
    return this._structuredLayoutAreaWidgets.get(widgetID);
  }

  //! methods

  async initLayoutAreaWidgetsAndProcess(pageID: string): Promise<void> {
    const widgets = await this.fetchLayoutWidgetsForPage(pageID);

    runInAction(() => {
      this.setInitialLayoutAreaWidgetAndConvert(widgets ?? []);
    });
  }

  async fetchLayoutWidgetsForPage(
    pageID: string
  ): Promise<Widget[] | undefined> {
    const getWidgetsQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.GET_WIDGETS
    );

    if (getWidgetsQuery == null) return;

    const response = await queryExecutor.executeRestQuery(
      getWidgetsQuery,
      {},
      this.stores.resourceStore,
      { pageID: pageID }
    );

    return response;
  }

  private updateWidgetPositioningForBreakpoint(
    widgetID: string,
    breakpoint: string,
    positioning: WidgetPositioning
  ): void {
    const structuredLayoutAreaWidget =
      this.getStructuredLayoutAreaWidgeyByWidgetID(widgetID);

    if (structuredLayoutAreaWidget != null) {
      // update the positioning for the breakpoint
      structuredLayoutAreaWidget.widget.positioning[breakpoint] = positioning;

      // update the widget with the new positioning
      this.setStructuredLayoutAreaWidget(widgetID, structuredLayoutAreaWidget);
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
          this.stores.changeRecordStore.setChangeWidgetRecord(
            widgetID,
            "UPDATE",
            this.getStructuredLayoutAreaWidgeyByWidgetID(widgetID)?.widget
          );
        }
      }
    }
  }

  deleteWidget(widgetID: string): void {
    // get the widget to delete from the map
    const widgetToDelete =
      this.getStructuredLayoutAreaWidgeyByWidgetID(widgetID);

    // check if the widget exists
    if (widgetToDelete == null) {
      return;
    }

    // Check if the widget is nested and update the parent widget's children list
    if (widgetToDelete.location === WidgetHierarchyLocation.NESTED) {
      for (const [parentID, parentWidget] of this
        ._structuredLayoutAreaWidgets) {
        const childIndex = parentWidget.children.indexOf(widgetID);

        if (childIndex !== -1) {
          // remove the widget from the parent widget's children list
          parentWidget.children.splice(childIndex, 1);
          this._structuredLayoutAreaWidgets.set(parentID, parentWidget);
          break;
        }
      }
    }

    // delete the widget from the map
    this._structuredLayoutAreaWidgets.delete(widgetID);

    // set the change record for the widget to delete
    this.stores.changeRecordStore.setChangeWidgetRecord(
      widgetID,
      "DELETE",
      widgetToDelete.widget
    );
  }

  addWidget(args: {
    widgetType: string;
    layoutAreaID: string;
    layout: Layout;
    currentBreakpoint: string;
  }): void {
    const { widgetType, layout, currentBreakpoint, layoutAreaID } = args;

    const widgetID = layout.i;
    const pageID = this.stores.pageStore.currentPageToRender?.pageID;

    if (pageID == null || layoutAreaID == null) {
      return;
    }

    // create the new widget object
    const newWidget: WidgetHierarchy = {
      widget: {
        widgetID,
        widgetType,
        pageID: pageID,
        layoutAreaID: layoutAreaID,
        positioning: {
          i: widgetID,

          [currentBreakpoint]: {
            x: {
              value: layout.x,
              isInfinity: false,
            },
            y: {
              value: layout.y,
              isInfinity: false,
            },
            w: {
              value: layout.w,
              isInfinity: false,
            },
            h: {
              value: layout.h,
              isInfinity: false,
            },
          },
        } as any,
      },
      children: [],
      location: WidgetHierarchyLocation.LAYOUT_AREA,
    };

    // add the new widget to the map
    this._structuredLayoutAreaWidgets.set(widgetID, newWidget);

    // set the change record for the new widget
    this.stores.changeRecordStore.setChangeWidgetRecord(
      widgetID,
      "CREATE",
      newWidget.widget
    );
  }
}

export default LayoutStore;
