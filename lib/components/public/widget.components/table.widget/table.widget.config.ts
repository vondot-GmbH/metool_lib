import { WidgetConfig } from "../../../../globals/interfaces/config.interface";
import TableWidgetIcon from "./icon.svg";
import tableWidgetComponent from "./table.widget.component";

export const TableWidgetConfig: WidgetConfig = {
  name: "table",
  type: "DATA_TABLE",
  component: tableWidgetComponent,
  icon: TableWidgetIcon,
};
