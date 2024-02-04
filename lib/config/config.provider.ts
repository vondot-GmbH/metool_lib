import { WidgetConfig } from "../globals/interfaces/config.interface";

class ConfigProvider {
  private static _instance: ConfigProvider;
  private _registeredWidgets: Map<string, WidgetConfig> = new Map();

  private constructor() {}

  public static getInstance(): ConfigProvider {
    if (!ConfigProvider._instance) {
      ConfigProvider._instance = new ConfigProvider();
    }
    return ConfigProvider._instance;
  }

  public registerWidgets(widgets: WidgetConfig[]) {
    widgets.forEach((widget) => {
      this._registeredWidgets.set(widget.type, widget);
    });
  }

  public getRegisteredWidget(type: string): WidgetConfig | undefined {
    return this._registeredWidgets.get(type);
  }

  public getRegisteredWidgets(): WidgetConfig[] {
    return Array.from(this._registeredWidgets.values());
  }
}

export default ConfigProvider;
