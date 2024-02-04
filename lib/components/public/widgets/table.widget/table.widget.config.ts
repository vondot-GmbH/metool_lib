import { WidgetConfig } from "../../../../globals/interfaces/config.interface";
import { TableWidget } from "./table.widget.component";
import TableWidgetIcon from "./icon.png";

export const TableWidgetConfig: WidgetConfig = {
  type: "DATA_TABLE",
  component: TableWidget,
  icon: TableWidgetIcon,
};
