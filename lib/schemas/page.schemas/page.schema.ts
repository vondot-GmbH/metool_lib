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
  maxWidth?: number;
  maxHeight?: number;
  height?: number;
  width?: number;
  backgroundColor?: string;
  padding?: string;
  // ... // TODO
}

export interface LayoutOptions {
  backgroundColor?: string;
  // ...
}
