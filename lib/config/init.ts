import {
  LayoutConfig,
  WidgetConfig,
} from "../globals/interfaces/config.interface";
import { CoreResource } from "../schemas/resource.schemas/resource.schema";
import ConfigProvider from "./config.provider";

interface InitOptions {
  widgets: WidgetConfig[];
  layoutConfig?: LayoutConfig;
  coreResources?: CoreResource[];
}

const init = ({ widgets, layoutConfig, coreResources }: InitOptions) => {
  const configProvider = ConfigProvider.getInstance();
  configProvider.registerWidgets(widgets);
  configProvider.setLayoutConfig(layoutConfig);
  configProvider.registerCoreResources(coreResources);
};

export default init;
