import { WidgetConfig } from "../globals/interfaces/config.interface";
import Config from "./config.provider";

interface InitOptions {
  widgets: WidgetConfig[];
}

const init = ({ widgets }: InitOptions) => {
  Config.getInstance().registerWidgets(widgets);
};

export default init;
