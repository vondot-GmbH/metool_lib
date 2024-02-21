import { WidgetConfig } from "../../../../globals/interfaces/config.interface";
import textWidgetSidebarComponent from "./sidebar.component/text.widget.sidebar.component";
import TextWidgetIcon from "./text.svg";
import textWidgetComponent from "./text.widget.component/text.widget.component";

export const TextWidgetConfig: WidgetConfig = {
  name: "text",
  type: "TEXT_WIDGET",
  component: textWidgetComponent,
  icon: TextWidgetIcon,
  canHaveChildren: false,
  sidebarComponent: textWidgetSidebarComponent,
};
