import "./App.css";
import {
  CanvasEditorPublic,
  ContainerWidget,
  DashboardPageLayout,
  InitializeMetool,
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

//! TEST REACT PROJECT FOR METOOL LIBRARY (ONLY FOR DEVELOPMENT PURPOSES)

// initialize metool
InitializeMetool({
  coreQueryConfig: coreQueryConfig,
  coreResources: [coreResources],
  widgets: [TableWidget, ContainerWidget, TextWidget],
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
      <CanvasEditorPublic pageToRender="5f9e9b6b9I6b4c3017f93k39" />

      {/* <RenderPage pageToRender="5f9e9b6b9I6b4c3017f3b3a0" /> */}
    </div>
  );
}

export default App;
