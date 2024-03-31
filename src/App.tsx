import "./App.css";
import {
  CanvasEditorPublic,
  ContainerWidget,
  DashboardPageLayout,
  InitializeMetool,
  RenderPage,
  TextWidget,
} from "../lib/main";
import { TableWidget } from "../lib/main";
import Gleap from "Gleap";
import {
  faHandPointer,
  faHardDrive,
} from "@fortawesome/free-regular-svg-icons";
import {
  faDisplay,
  faMobileNotch,
  faTabletScreenButton,
} from "@fortawesome/pro-regular-svg-icons";
import { coreQueryConfig, coreResources } from "./metool.config";
import { NavigationMenuWidgetConfig } from "../lib/components/public/widget.components/navigation.menu/navigation.menu.config";

//! TEST REACT PROJECT FOR METOOL LIBRARY (ONLY FOR DEVELOPMENT PURPOSES)

// initialize metool
InitializeMetool({
  themeConfig: {
    colors: {
      colorBorder: "#babbbb",

      colorPrimary: "#2bbf8c",
      colorPrimaryHighlight: "#2bbf8c",
      colorPrimaryUltralight: "#e6f9f4",
      colorSecondary: "#000000",
      colorSecondaryHighlight: "#5c5c5c",
      colorBackground: "#ffffff",
      colorInverted: "#000000",
      colorSurface: "rgb(248, 250, 250)",
      colorSurfaceDark: "#f2f2f2",
      colorError: "#fd5d5d",
      colorSuccess: "rgb(92, 195, 122)",
      colorHover: "hsla(158, 66%, 51%, 0.1)",
      colorWarning: "#f8b400",
      colorDisabled: "#cacecd",
    },
  },
  coreQueryConfig: coreQueryConfig,
  coreResources: [coreResources],
  widgets: [
    TableWidget,
    ContainerWidget,
    TextWidget,
    NavigationMenuWidgetConfig,
  ],
  pageLayoutConfigs: [DashboardPageLayout],
  gridLayoutConfig: {
    nested: {
      large: {
        cols: 48,
        rowHeight: 30,
        icon: faHandPointer,
        title: "Large",
        breakpoint: 1200,
      },
      medium: {
        cols: 24,
        rowHeight: 30,
        icon: faHardDrive,
        title: "Medium",
        breakpoint: 900,
      },
      small: {
        cols: 16,
        rowHeight: 30,
        icon: faHardDrive,
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
  },
});

Gleap.initialize("YZ6N1CITLut6MeqEhbITgwBid7oB7nc6");

function App() {
  return (
    <div className="main-container">
      <CanvasEditorPublic pageToRender="5f404b6b9I6b4c3017f99979" />

      {/* <RenderPage pageToRender="5f404b6b9I6b4c3017f99979" /> */}
    </div>
  );
}

export default App;
