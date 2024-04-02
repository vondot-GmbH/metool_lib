import { WidgetConfig } from "../../../../globals/interfaces/config.interface";
import ContainerWidget from "./container.widget.component/container.widget.component";
import ContainerWidgetIcon from "./container.svg";
import ContainerWidgetSidebar from "./sidebar.component/container.widget.sidebar.component";

export const ContainerWidgetConfig: WidgetConfig = {
  name: "container",
  type: "CONTAINER_WIDGET",
  component: ContainerWidget,
  icon: ContainerWidgetIcon,
  sidebarComponent: ContainerWidgetSidebar,
  canHaveChildren: true,
};
