import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface WidgetConfig {
  name: string;
  type: string;
  component: React.ComponentType<any>;
  icon: string;
  canHaveChildren: boolean;
  sidebarComponent?: React.ComponentType<any>;
}

export interface BreakpointConfig {
  cols: number;
  rowHeight: number;
  breakpoint: number;
  icon?: IconProp;
  title?: string;
}

export interface PreparedBreakpointConfig {
  minWidth: number | null;
  maxWidth: number | null;
}

export type GridLayoutConfig = {
  root: { [key: string]: BreakpointConfig };
  nested: { [key: string]: BreakpointConfig };
};

// page layout config

export interface CorePageLayoutConfig {
  layoutID: string;
  name: string;
  areas: CorePageLayoutAreaConfig[];
  component: React.ComponentType<any>;
}

export interface CorePageLayoutAreaConfig {
  layoutAreaID: string;
  propName: string;
  allowedWidgetTypes?: string[];
}
