// base state for all widgets types
export interface BaseWidgetState {
  isLoading: boolean | null;
  hidden: boolean | null;
  disabled: boolean | null;
}

// state for specific widget types
export interface TableWidgetState extends BaseWidgetState {
  selectedSourceRow?: string | null;
  selectedDataIndex?: number | null;
  selectedSourceRows?: string[] | null;
  selectedDataIndexes?: number[] | null;
}

export interface TextWidgetState extends BaseWidgetState {
  data: string;
}

export interface FormWidgetState extends BaseWidgetState {}

// union type for all widget types
export type WidgetState = TableWidgetState | FormWidgetState;

export type DynamicWidgetStateMap = Map<string, WidgetState>;

export interface WidgetContextMenu {
  isOpen: boolean;
  anchorPoint: { x: number; y: number };
  selectedWidgetID: string | null;
}
