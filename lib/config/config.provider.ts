import { WidgetConfig } from "../globals/interfaces/config.interface";

class Config {
  private static _instance: Config;
  private _registeredWidgets: WidgetConfig[] = [];

  private constructor() {}

  public static getInstance(): Config {
    if (!Config._instance) {
      Config._instance = new Config();
    }
    return Config._instance;
  }

  public registerWidgets(widgets: WidgetConfig[]) {
    this._registeredWidgets = widgets;
  }

  public getRegisteredWidgets(): WidgetConfig[] {
    return this._registeredWidgets;
  }
}

export default Config;
