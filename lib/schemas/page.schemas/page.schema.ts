export interface Page {
  _id?: string;
  pageID: string;
  name: string;
  layoutConfig: PageLayoutConfig;
  views: string[];
}

export interface PageLayoutConfig {
  layoutID: string;
  options?: LayoutOptions;
  areas?: Record<string, AreaOptions>;
}

export interface AreaOptions {
  height?: string;
  width?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  maxHeight?: string;
  minHeight?: string;
  maxWidth?: string;
  minWidth?: string;
  border?: string;
  borderRadius?: string;
}

export interface LayoutOptions {
  backgroundColor?: string;
  layoutType?: string;
}
