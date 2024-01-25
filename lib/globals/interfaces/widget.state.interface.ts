// base state for all widgets types
export interface BaseWidgetState {
  isLoading: boolean | null;
  hidden: boolean | null;
  disabled: boolean | null;
}

// state for specific widget types
export interface TableWidgetState extends BaseWidgetState {
  selectedItem: string | null;
}

export interface FormWidgetState extends BaseWidgetState {
  selectedField: string | null;
}

// union type for all widget types
export type WidgetState = TableWidgetState | FormWidgetState;

export type DynamicWidgetStateMap = Map<string, WidgetState>;
