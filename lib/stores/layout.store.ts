import { makeAutoObservable, runInAction } from "mobx";
import {
  AnalyzedWidgetOptions,
  Widget,
  WidgetHierarchy,
  WidgetHierarchyMap,
} from "../schemas/widget.schemas/widget.schema";
import RootStore from "./root.store";
import { structureWidgetsHierarchy } from "../globals/helpers/widget.helper";
import { extractDependenciesAndNonDependencies } from "../globals/helpers/state.helper";
import { CoreRestQueryType } from "../schemas/query.schemas/query.schema";
import { queryExecutor } from "../provider/http/http.rest.query.client";

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

    this.stores.queryStore.executeAndSaveDependencies(
      this._analyzedLayoutWidgetOptions
    );

    return this._structuredLayoutAreaWidgets;
  }

  //! getter

  getStructuredLayoutAreaWidget(): WidgetHierarchyMap {
    return this._structuredLayoutAreaWidgets;
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
  //! methods

  async initLayoutAreaWidgetsAndProcess(pageID: string): Promise<void> {
    const widgets = await this.fetchLayoutWidgetsForPage(pageID);

    if (widgets == null) {
      return;
    }

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
}

export default LayoutStore;
