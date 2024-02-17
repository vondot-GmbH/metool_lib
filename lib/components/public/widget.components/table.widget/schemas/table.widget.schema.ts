export interface TableOptions {
  columns: TableColumn[];
  headerColor: string;
  rowColor: string;
  rowBorderColor: string;
  emptyStateText: string;
}

export interface TableColumn {
  columnID: string;
  source: string;
  label: string;
  textAlign: "left" | "center" | "right";
  format?: "string" | "number" | "date";
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  headerColor?: string;
  rowColor?: string;
  borderBottomColor?: string;
}
