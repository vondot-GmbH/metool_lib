import { CSSStyles } from "../../../../../globals/interfaces/widget.option.interface";

export interface TableOptions {
  data: string;
  columns: TableColumn[];
  emptyStateText: string;
  rowSelectionType: "single" | "multiple" | "none";
  headerStyles?: CSSStyles;
  headerCellStyles?: CSSStyles;
  bodyRowStyles?: CSSStyles;
  bodyCellStyles?: CSSStyles;
}

export interface TableColumn {
  columnID: string;
  source: string;
  label: string;
  format?: "string" | "number" | "date";
  columnStyles?: CSSStyles;
}
