import { SpacingModeValues } from "../../../../private/general.components/spacing.editor.component/spacing.editor.component";

export interface TableOptions {
  data: string;
  columns: TableColumn[];
  emptyStateText: string;
  rowSelectionType: "single" | "multiple" | "none";
  headerStyles?: CSSStyles; // Stile für den gesamten Kopfbereich
  headerCellStyles?: CSSStyles; // Stile für einzelne Kopfzellen
  bodyRowStyles?: CSSStyles; // Stile für Zeilen im Body-Bereich
  bodyCellStyles?: CSSStyles;
}

export interface TableColumn {
  columnID: string;
  source: string;
  label: string;
  textAlign: "left" | "center" | "right";
  format?: "string" | "number" | "date";
  columnStyles?: CSSStyles; // Stile für die gesamte Spalte
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
