import { makeAutoObservable } from "mobx";
import {
  AnalyzedWidgetOptions,
  Widget,
  WidgetHierarchy,
  WidgetHierarchyLocation,
  WidgetHierarchyMap,
  WidgetLayouts,
  WidgetPositioning,
} from "../schemas/widget.schemas/widget.schema";
import { Layout } from "react-grid-layout";
import { structureWidgetsHierarchy } from "../globals/helpers/widget.helper";
import { convertLayoutToPositioningForBreakpoint } from "../globals/helpers/layout.helper";
import { extractDependenciesAndNonDependencies } from "../globals/helpers/state.helper";
import { runInAction } from "mobx";
import RootStore from "./root.store";
import { CoreRestQueryType } from "../schemas/query.schemas/query.schema";
import { queryExecutor } from "../providers/http/http.rest.query.client";
import { ChangeRecord } from "../globals/interfaces/change.record.interface";

class WidgetStore {
  private _structuredWidgetHierarchy: WidgetHierarchyMap = new Map();
  private _analyzedWidgetOptions: Map<string, AnalyzedWidgetOptions> =
    new Map();

  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  //! setter

  setInitialWidgetAndConvert(widgets: Widget[]): WidgetHierarchyMap {
    const structuredWidgets = structureWidgetsHierarchy(widgets);

    runInAction(() => {
      this._structuredWidgetHierarchy = structuredWidgets;
    });

    const widgetIDs = Array.from(this._structuredWidgetHierarchy.keys());

    for (let i = 0; i < widgetIDs.length; i++) {
      const widgetID = widgetIDs[i];
      const widgetHierarchy = this._structuredWidgetHierarchy.get(widgetID);

      if (widgetHierarchy) {
        const { dependencies, nonDependencies } =
          extractDependenciesAndNonDependencies(widgetHierarchy.widget.options);

        runInAction(() => {
          this._analyzedWidgetOptions.set(widgetID, {
            options: nonDependencies,
            dependencies: dependencies,
          });
        });
      }
    }

    this.stores.queryStore.executeAndSaveDependencies(
      this._analyzedWidgetOptions
    );

    return this._structuredWidgetHierarchy;
  }

  setStructuredWidgetHierarchy(
    widgetID: string,
    newHierarchy: WidgetHierarchy
  ): void {
    this._structuredWidgetHierarchy.set(widgetID, newHierarchy);
  }

  //! getter

  getAnalyzedWidgetOptions(
    widgetID: string
  ): AnalyzedWidgetOptions | undefined {
    const options = this._analyzedWidgetOptions.get(widgetID);

    if (options != null) {
      return options;
    }

    return this.stores.layoutStore?.getAnalyzedLayoutWidgetOption(widgetID);
  }

  getStructuredWidgetHierarchyByWidgetID(
    widgetID: string
  ): WidgetHierarchy | undefined {
    if (this._structuredWidgetHierarchy.get(widgetID) == null) {
      return;
    }

    return this._structuredWidgetHierarchy.get(widgetID);
  }

  getStructuredData(): WidgetHierarchyMap {
    return this._structuredWidgetHierarchy;
  }

  // TODO rename structuredWidgetHierarchy
  getStructuredWidget(widgetID: string): WidgetHierarchy | undefined {
    return this._structuredWidgetHierarchy.get(widgetID);
  }

  //! methods

  findWidgetAcrossStores(widgetID: string): WidgetHierarchy | undefined {
    // search in the structured widget hierarchy
    const widget = this._structuredWidgetHierarchy.get(widgetID);

    if (widget != null) {
      return widget;
    }

    // if the widget is not found in the structured widget hierarchy, search in the layout area widgets
    return this.stores.layoutStore.getLayoutAreaWidget(widgetID);
  }

  updateWidgetAcrossStores(widget: WidgetHierarchy): void {
    const widgetID = widget.widget.widgetID;

    // check if the widget is in the structured widget hierarchy
    if (this._structuredWidgetHierarchy.has(widgetID)) {
      this._structuredWidgetHierarchy.set(widgetID, widget);
      return;
    }

    // if the widget is not in the structured widget hierarchy, update the layout area widget
    this.stores.layoutStore.setStructuredLayoutAreaWidget(widgetID, widget);
  }

  // TODO
  async initWidgetsAndProcess(viewID: string): Promise<void> {
    const widgets = await this.fetchWidgetsForView(viewID);

    runInAction(() => {
      this.setInitialWidgetAndConvert(widgets ?? []);
    });
  }

  // update a single option of a widget by the widgetID and the option name
  updateWidgetOption(widgetID: string, optionName: string, value: any): void {
    const widgetHierarchy = this.findWidgetAcrossStores(widgetID);

    if (widgetHierarchy != null) {
      const updatedWidgetHierarchy = JSON.parse(
        JSON.stringify(widgetHierarchy)
      );

      const options = updatedWidgetHierarchy.widget.options ?? {};

      options[optionName] = value;
      updatedWidgetHierarchy.widget.options = options;

      this.updateWidgetAcrossStores(updatedWidgetHierarchy);

      this.stores.changeRecordStore.setChangeWidgetRecord(
        widgetID,
        "UPDATE",
        updatedWidgetHierarchy.widget
      );
    }
  }

  // update a single element of an option array of a widget
  updateWidgetOptionArrayItem<T>({
    widgetID,
    optionName,
    identifierField,
    identifierValue,
    updatedProperties,
  }: {
    widgetID: string;
    optionName: string;
    identifierField: keyof T;
    identifierValue: any;
    updatedProperties: Partial<T>;
  }): void {
    const widgetHierarchy = this.findWidgetAcrossStores(widgetID);

    if (widgetHierarchy != null) {
      const updatedWidgetHierarchy = JSON.parse(
        JSON.stringify(widgetHierarchy)
      );
      const optionsArray: T[] =
        updatedWidgetHierarchy.widget.options?.[optionName] ?? [];

      const updatedOptionsArray = optionsArray.map((item) => {
        if (item[identifierField] === identifierValue) {
          return { ...item, ...updatedProperties };
        }
        return item;
      });

      updatedWidgetHierarchy.widget.options[optionName] = updatedOptionsArray;

      this.updateWidgetAcrossStores(updatedWidgetHierarchy);

      this.stores.changeRecordStore.setChangeWidgetRecord(
        widgetID,
        "UPDATE",
        updatedWidgetHierarchy.widget
      );
    }
  }

  getWidgetOption(widgetID: string, optionName: string): any {
    const widgetHierarchy = this.findWidgetAcrossStores(widgetID);

    if (widgetHierarchy != null) {
      return widgetHierarchy.widget.options?.[optionName] ?? null;
    }
  }

  getAllOptionsForWidget(widgetID: string): any {
    const widgetHierarchy = this.findWidgetAcrossStores(widgetID);

    if (widgetHierarchy != null) {
      return widgetHierarchy.widget.options ?? {};
    }
  }

  private updateWidgetPositioningForBreakpoint(
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
        this.stores.changeRecordStore.setChangeWidgetRecord(
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
          this.stores.changeRecordStore.setChangeWidgetRecord(
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
    if (
      isRootCall &&
      widgetToDelete.location === WidgetHierarchyLocation.NESTED
    ) {
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
    this.stores.changeRecordStore.setChangeWidgetRecord(
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
    const viewID = this.stores.viewStore.currentSelectedView?.viewID;

    if (viewID == null) {
      return;
    }

    // create the new widget object
    const newWidget: WidgetHierarchy = {
      widget: {
        widgetID,
        widgetType,
        viewID: viewID,
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
      location: parentID
        ? WidgetHierarchyLocation.NESTED
        : WidgetHierarchyLocation.ROOT,
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
    this.stores.changeRecordStore.setChangeWidgetRecord(
      widgetID,
      "CREATE",
      newWidget.widget
    );
  }

  //! QUERY METHODS

  async processWidgetChange(record: ChangeRecord): Promise<void> {
    switch (record.action) {
      case "CREATE":
        await this.createWidget(record.data);
        break;
      case "UPDATE":
        await this.updateWidget(record.data);

        break;
      case "DELETE":
        await this.deleteWidgetByID(record.data);
        break;

      default:
        return;
    }
  }

  async createWidget(widget: Widget): Promise<Widget | undefined> {
    const createQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.CREATE_WIDGET
    );

    const preparedQuery = {
      ...createQuery,
      body: widget,
    } as any;

    const response = await queryExecutor.executeRestQuery(
      preparedQuery,
      {},
      this.stores.resourceStore
    );

    return response;
  }

  async updateWidget(widget: Widget): Promise<Widget | undefined> {
    const updateQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.UPDATE_WIDGET
    );

    const preparedQuery = {
      ...updateQuery,
      body: widget,
    } as any;

    const response = await queryExecutor.executeRestQuery(
      preparedQuery,
      { widgetID: widget.widgetID },
      this.stores.resourceStore
    );

    return response;
  }

  async deleteWidgetByID(widget: Widget): Promise<void> {
    const deleteQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.DELETE_WIDGET
    );

    const preparedQuery = {
      ...deleteQuery,
    } as any;

    await queryExecutor.executeRestQuery(
      preparedQuery,
      { widgetID: widget.widgetID },
      this.stores.resourceStore
    );
  }
  // TODO
  async fetchWidgetsForView(viewID: string): Promise<Widget[] | undefined> {
    const getWidgetsQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.GET_WIDGETS
    );

    if (getWidgetsQuery == null) return;

    const response = await queryExecutor.executeRestQuery(
      getWidgetsQuery,
      {},
      this.stores.resourceStore,
      { viewID: viewID }
    );

    return response;
  }
}

export default WidgetStore;
