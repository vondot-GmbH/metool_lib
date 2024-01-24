export interface Widget {
  _id?: string;
  widgetType: string;
  widgetID: string;
  positioning: WidgetLayouts;
  parentID?: string;
  view: string;
}

export interface WidgetLayouts {
  i: string;
  xs: WidgetPositioning;
  md: WidgetPositioning;
  xl: WidgetPositioning;
}

export interface WidgetPositioning {
  x: PositionValue;
  y: PositionValue;
  w: PositionValue;
  h: PositionValue;
}

export interface PositionValue {
  value: number;
  isInfinity: boolean;
}

export type LayoutBreakpoint = "xs" | "md" | "xl";

export type WidgetHierarchyMap = Map<string, WidgetHierarchy>;

export interface WidgetHierarchy {
  widget: Widget;
  children: string[]; // Speichert nur die IDs der Kinder
  level: "ROOT" | "NESTED";
}
