import {
  LayoutConfig,
  WidgetConfig,
} from "../globals/interfaces/config.interface";
import { CoreRestQuerConfig } from "../schemas/query.schemas/query.schema";
import { CoreResource } from "../schemas/resource.schemas/resource.schema";
import ConfigProvider from "./config.provider";

interface InitOptions {
  widgets: WidgetConfig[];
  layoutConfig?: LayoutConfig;
  coreResources?: CoreResource[];
  coreQueryConfig: CoreRestQuerConfig;
}

const initialize = ({
  widgets,
  layoutConfig,
  coreResources,
  coreQueryConfig,
}: InitOptions) => {
  const configProvider = ConfigProvider.getInstance();
  configProvider.registerWidgets(widgets);
  configProvider.setLayoutConfig(layoutConfig);
  configProvider.registerCoreResources(coreResources);
  configProvider.registerCoreQueries(coreQueryConfig);
};

export default initialize;
