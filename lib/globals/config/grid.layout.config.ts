import { LayoutConfig } from "../interfaces/config.interface";

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  nested: {
    xl: {
      cols: 48,
      rowHeight: 30,
      icon: "icon",
      title: "Large",
      breakpoint: 1200,
    },
    md: {
      cols: 24,
      rowHeight: 30,
      icon: "icon",
      title: "Medium",
      breakpoint: 768,
    },
    xs: {
      cols: 16,
      rowHeight: 30,
      icon: "icon",
      title: "Small",
      breakpoint: 480,
    },
  },
  root: {
    xl: {
      cols: 24,
      rowHeight: 30,
      icon: "icon",
      title: "Large",
      breakpoint: 1200,
    },
    md: {
      cols: 12,
      rowHeight: 30,
      icon: "icon",
      title: "Medium",
      breakpoint: 996,
    },
    xs: {
      cols: 8,
      rowHeight: 30,
      icon: "icon",
      title: "Small",
      breakpoint: 480,
    },
  },
};
