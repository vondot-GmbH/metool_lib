import {
  GridLayoutConfig,
  CorePageLayoutConfig,
  WidgetConfig,
} from "../globals/interfaces/config.interface";
import { CoreRestQuerConfig } from "../schemas/query.schemas/query.schema";
import { CoreResource } from "../schemas/resource.schemas/resource.schema";
import ConfigProvider from "./config.provider";

interface InitOptions {
  widgets: WidgetConfig[];
  gridLayoutConfig?: GridLayoutConfig;
  coreResources?: CoreResource[];
  coreQueryConfig: CoreRestQuerConfig;
  pageLayoutConfigs?: CorePageLayoutConfig[];
}

const initialize = ({
  widgets,
  gridLayoutConfig,
  coreResources,
  coreQueryConfig,
  pageLayoutConfigs,
}: InitOptions) => {
  const configProvider = ConfigProvider.getInstance();

  configProvider.registerWidgets(widgets);
  configProvider.setLayoutConfig(gridLayoutConfig);
  configProvider.registerCoreResources(coreResources);
  configProvider.registerCoreQueries(coreQueryConfig);
  configProvider.registerPageLayouts(pageLayoutConfigs);
};

export default initialize;
