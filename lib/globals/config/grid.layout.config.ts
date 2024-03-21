import {
  faDisplay,
  faMobileNotch,
  faTabletScreenButton,
} from "@fortawesome/pro-regular-svg-icons";
import { GridLayoutConfig } from "../interfaces/config.interface";

export const DEFAULT_LAYOUT_CONFIG: GridLayoutConfig = {
  nested: {
    large: {
      cols: 48,
      rowHeight: 30,
      title: "Large",
      breakpoint: 1200,
    },
    medium: {
      cols: 24,
      rowHeight: 30,
      title: "Medium",
      breakpoint: 900,
    },
    small: {
      cols: 16,
      rowHeight: 30,
      title: "Small",
      breakpoint: 440,
    },
  },
  root: {
    large: {
      cols: 24,
      rowHeight: 30,
      icon: faDisplay,
      title: "Large",
      breakpoint: 1200,
    },
    medium: {
      cols: 12,
      rowHeight: 30,
      icon: faTabletScreenButton,
      title: "Medium",
      breakpoint: 900,
    },
    small: {
      cols: 8,
      rowHeight: 30,
      icon: faMobileNotch,
      title: "Small",
      breakpoint: 440,
    },
  },
};
