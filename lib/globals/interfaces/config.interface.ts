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

export type LayoutConfig = {
  root: { [key: string]: BreakpointConfig };
  nested: { [key: string]: BreakpointConfig };
};
