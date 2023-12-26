export interface Widget {
  schema: string;
  widgetID: string;
  positioning: WidgetLayouts;
  children?: Widget[];
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
