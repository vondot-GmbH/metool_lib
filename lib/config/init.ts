import {
  LayoutConfig,
  WidgetConfig,
} from "../globals/interfaces/config.interface";
import ConfigProvider from "./config.provider";

interface InitOptions {
  widgets: WidgetConfig[];
  layoutConfig?: LayoutConfig;
}

const init = ({ widgets, layoutConfig }: InitOptions) => {
  const configProvider = ConfigProvider.getInstance();
  configProvider.registerWidgets(widgets);
  configProvider.setLayoutConfig(layoutConfig);
};

export default init;
