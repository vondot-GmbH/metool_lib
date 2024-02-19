export interface TableOptions {
  columns: TableColumn[];
  headerTextColor?: string; // TODO not used
  rowTextColor?: string; // TODO not used
  headerBackgroundColor?: string;
  rowBackgroundColor?: string;
  borderBottomColor?: string;
  rowHoverColor?: string;
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
  headerTextColor?: string; // TODO not used
  rowTextColor?: string; // TODO not used
  headerBackgroundColor?: string;
  rowBackgroundColor?: string;
}
