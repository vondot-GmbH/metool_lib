import { Query } from "../../../../../main";
import { SpacingModeValues } from "../../../../private/general.components/spacing.editor.component/spacing.editor.component";

export interface TableOptions {
  dataQuery: Query;
  columns: TableColumn[];
  headerTextColor?: string; // TODO not used
  rowTextColor?: string; // TODO not used
  headerBackgroundColor?: string;
  rowBackgroundColor?: string;
  borderBottomColor?: string;
  rowHoverColor?: string;
  emptyStateText: string;
  rowSelectionBackgroundColor?: string;
  rowSelectionType: "single" | "multiple" | "none";
  tableCellPadding: SpacingModeValues;
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
