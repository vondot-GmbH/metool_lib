import { WidgetConfig } from "../../../../globals/interfaces/config.interface";
import { TableWidget } from "./table.widget.component";
import TableWidgetIcon from "./icon.svg";

export const TableWidgetConfig: WidgetConfig = {
  name: "table",
  type: "DATA_TABLE",
  component: TableWidget,
  icon: TableWidgetIcon,
};
