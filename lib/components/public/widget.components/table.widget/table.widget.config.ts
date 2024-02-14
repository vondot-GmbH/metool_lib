import { WidgetConfig } from "../../../../globals/interfaces/config.interface";
import TableWidgetIcon from "./icon.svg";
import tableWidgetOptionSidebar from "./sidebar.component/table.widget.option.sidebar.component";
import tableWidgetComponent from "./table.widget.component/table.widget.component";

export const TableWidgetConfig: WidgetConfig = {
  name: "table",
  type: "DATA_TABLE",
  component: tableWidgetComponent,
  icon: TableWidgetIcon,
  canHaveChildren: false,
  sidebarComponent: tableWidgetOptionSidebar,
};
