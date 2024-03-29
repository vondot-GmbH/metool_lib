import { WidgetConfig } from "../../../../globals/interfaces/config.interface";
import containerWidgetComponent from "./container.widget.component/container.widget.component";
import ContainerWidgetIcon from "./container.svg";

export const ContainerWidgetConfig: WidgetConfig = {
  name: "container",
  type: "CONTAINER_WIDGET",
  component: containerWidgetComponent,
  icon: ContainerWidgetIcon,
  canHaveChildren: true,
};
