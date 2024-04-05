import { WidgetConfig } from "../../../../globals/interfaces/config.interface";
import TextWidgetSidebar from "./sidebar.component/text.widget.sidebar.component";
import TextWidgetIcon from "./text.svg";
import TextWidget from "./text.widget.component/text.widget.component";

export const TextWidgetConfig: WidgetConfig = {
  name: "text",
  type: "TEXT_WIDGET",
  component: TextWidget,
  icon: TextWidgetIcon,
  canHaveChildren: false,
  sidebarComponent: TextWidgetSidebar,
};
