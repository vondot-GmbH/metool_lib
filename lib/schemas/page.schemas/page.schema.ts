export interface Page {
  _id?: string;
  pageID: string;
  name: string;
  layoutConfig: string;
  views: string[];
}

export interface PageLayoutConfig {
  layoutID: string;
  // areaConfig or generall options for layout areas like colors or paddings etc.
}
