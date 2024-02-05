export interface WidgetConfig {
  name: string;
  type: string;
  component: React.ComponentType<any>;
  icon: string;
}

export interface BreakpointConfig {
  cols: number;
  rowHeight: number;
  breakpoint: number;
  icon?: string;
  title?: string;
}

export type LayoutConfig = {
  root: { [key: string]: BreakpointConfig };
  nested: { [key: string]: BreakpointConfig };
};
