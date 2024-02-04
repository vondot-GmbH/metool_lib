import { WidgetConfig } from "../globals/interfaces/config.interface";
import ConfigProvider from "./config.provider";

interface InitOptions {
  widgets: WidgetConfig[];
}

const init = ({ widgets }: InitOptions) => {
  ConfigProvider.getInstance().registerWidgets(widgets);
};

export default init;
