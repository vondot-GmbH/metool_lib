import { DEFAULT_LAYOUT_CONFIG } from "../globals/config/grid.layout.config";
import {
  BreakpointConfig,
  LayoutConfig,
  WidgetConfig,
} from "../globals/interfaces/config.interface";
import {
  CoreQuery,
  CoreQueryMap,
  CoreRestQuerConfig,
} from "../schemas/query.schemas/query.schema";
import {
  CoreResource,
  CoreResourceMap,
} from "../schemas/resource.schemas/resource.schema";

class ConfigProvider {
  private static _instance: ConfigProvider;
  private _registeredWidgets: Map<string, WidgetConfig> = new Map();
  private _layoutConfig: LayoutConfig = { root: {}, nested: {} };
  private _coreResources: CoreResourceMap = new Map();
  private _coreQueries: CoreQueryMap = new Map();

  private constructor() {}

  //! setter

  public registerCoreResources(resources: CoreResource[] | undefined) {
    if (resources == null) {
      return;
    }

    // TODO
    resources.forEach((resource) => {
      if (resource?.resourceID == null) {
        return;
      }

      this._coreResources.set(resource?.resourceID, resource);
    });
  }

  public registerCoreQueries(coreQueryConfig: CoreRestQuerConfig) {
    Object.keys(coreQueryConfig).forEach((key) => {
      const query = coreQueryConfig[key as keyof CoreRestQuerConfig];
      if (query) {
        this._coreQueries.set(key, query);
      }
    });
  }

  public registerWidgets(widgets: WidgetConfig[]) {
    widgets.forEach((widget) => {
      this._registeredWidgets.set(widget.type, widget);
    });
  }

  public setLayoutConfig(layoutConfig: LayoutConfig | undefined) {
    if (layoutConfig == null) {
      this._layoutConfig = DEFAULT_LAYOUT_CONFIG;
      return;
    }

    this._layoutConfig = layoutConfig;
  }

  //! getter

  public getCoreResource(resourceKey: string): CoreResource | undefined {
    return this._coreResources.get(resourceKey);
  }

  public getCoreResources(): CoreResource[] {
    return Array.from(this._coreResources.values());
  }

  public getCoreQuery(queryKey: string): CoreQuery | undefined {
    return this._coreQueries.get(queryKey);
  }

  public getCoreQueries(): CoreQuery[] | undefined {
    return Array.from(this._coreQueries.values());
  }

  public static getInstance(): ConfigProvider {
    if (!ConfigProvider._instance) {
      ConfigProvider._instance = new ConfigProvider();
    }
    return ConfigProvider._instance;
  }

  public getLayoutConfig(): LayoutConfig {
    return this._layoutConfig;
  }

  public getRowHeight(level: "root" | "nested", breakpoint: string): number {
    const levelConfig = this._layoutConfig[level];
    const config: BreakpointConfig | undefined = levelConfig[breakpoint];
    return config?.rowHeight;
  }

  public getColsForAllLayouts(level: "root" | "nested"): {
    [key: string]: number;
  } {
    const levelConfig = this._layoutConfig[level];
    const colsForAllLayouts: { [key: string]: number } = {};

    Object.keys(levelConfig).forEach((breakpoint) => {
      const config: BreakpointConfig | undefined = levelConfig[breakpoint];

      if (config) {
        colsForAllLayouts[breakpoint] = config.cols;
      }
    });

    return colsForAllLayouts;
  }

  public getBreakpointsForAllLayouts(level: "root" | "nested"): {
    [key: string]: number;
  } {
    const levelConfig = this._layoutConfig[level];
    const breakpointsForAllLayouts: { [key: string]: number } = {};

    Object.keys(levelConfig).forEach((breakpoint) => {
      const config: BreakpointConfig | undefined = levelConfig[breakpoint];

      if (config) {
        breakpointsForAllLayouts[breakpoint] = config.breakpoint;
      }
    });

    return breakpointsForAllLayouts;
  }

  public getBreakpoints(level: "root" | "nested"): string[] {
    return Object.keys(this._layoutConfig[level]);
  }

  public getRegisteredWidget(type: string): WidgetConfig | undefined {
    return this._registeredWidgets.get(type);
  }

  public getRegisteredWidgets(): WidgetConfig[] {
    return Array.from(this._registeredWidgets.values());
  }
}

export default ConfigProvider;
