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
  // textAlign: "left" | "center" | "right";
  format?: "string" | "number" | "date";
  columnStyles?: CSSStyles;
}

interface CSSStyles {
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  textAlign?: "left" | "center" | "right";
  borderRadius?: string;
  border?: string;
  minWidth?: string;
  maxWidth?: string;
}
