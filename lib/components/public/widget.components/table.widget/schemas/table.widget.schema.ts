import {
  CSSStyles,
  WidgetEvent,
} from "../../../../../globals/interfaces/widget.option.interface";

export interface TableOptions {
  data: string;
  columns: TableColumnOptions[];
  emptyStateText: string;
  rowSelectionType: "single" | "multiple" | "none";
  headerStyles?: CSSStyles;
  headerCellStyles?: CSSStyles;
  bodyRowStyles?: CSSStyles;
  bodyCellStyles?: CSSStyles;
  events: WidgetEvent[];
}

export interface TableColumnOptions {
  columnID: string;
  source: string;
  label: string;
  format?: "string" | "image";
  columnStyles?: CSSStyles;
}
