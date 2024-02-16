export interface Widget {
  _id?: string;
  widgetType: string;
  widgetID: string;
  positioning: WidgetLayouts;
  parentID?: string;
  view: string;
  options?: Record<string, any>;
}

export interface WidgetLayouts {
  i: string;
  [breakpoint: string]: WidgetPositioning | undefined | string;
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

export type WidgetHierarchyMap = Map<string, WidgetHierarchy>;

export interface WidgetHierarchy {
  widget: Widget;
  children: string[];
  level: "ROOT" | "NESTED";
}
