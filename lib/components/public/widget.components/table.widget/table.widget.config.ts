import { WidgetConfig } from "../../../../globals/interfaces/config.interface";
import TableWidgetIcon from "./icon.svg";
import TableWidgetSidebar from "./sidebar.component/table.widget.option.sidebar.component";
import TableWidget from "./table.widget.component/table.widget.component";

export const TableWidgetConfig: WidgetConfig = {
  name: "table",
  type: "DATA_TABLE",
  component: TableWidget,
  icon: TableWidgetIcon,
  canHaveChildren: false,
  sidebarComponent: TableWidgetSidebar,
};
