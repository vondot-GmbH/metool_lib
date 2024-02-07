import "./App.css";
import { CanvasEditor, Init } from "../lib/main";
import ViewStore from "../lib/stores/view.store";
import { Provider as MobxProvider } from "mobx-react";
import WidgetStore from "../lib/stores/widget.store";
import { EXAMPLE_WIDGETS_DATA_RENAMED } from "./example.data";
import ChangeRecordStore from "../lib/stores/change.record.store";
import { TableWidget } from "../lib/main";
import Gleap from "Gleap";
import EditorStore from "../lib/stores/editor.store";
import {
  faAngry,
  faHardDrive,
  faHandPointer,
} from "@fortawesome/free-regular-svg-icons";

// only for testing purposes

Init({
  widgets: [TableWidget, TableWidget],
  layoutConfig: {
    nested: {
      large: {
        cols: 48,
        rowHeight: 30,
        icon: faAngry,
        title: "Large",
        breakpoint: 1200,
      },
      medium: {
        cols: 24,
        rowHeight: 30,
        icon: faHandPointer,
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
        rowHeight: 30, // TODO define rowHeight on higher level
        icon: faAngry,
        title: "Large",
        breakpoint: 1200,
      },
      medium: {
        cols: 12,
        rowHeight: 30,
        icon: faHardDrive,
        title: "Medium",
        breakpoint: 900,
      },
      small: {
        cols: 8,
        rowHeight: 30,
        icon: faHardDrive,
        title: "Small",
        breakpoint: 440,
      },
    },
  },
});

Gleap.initialize("YZ6N1CITLut6MeqEhbITgwBid7oB7nc6");

const viewStore = new ViewStore();
const changeRecordStore = new ChangeRecordStore();
const widgetStore = new WidgetStore(changeRecordStore);
const editorStore = new EditorStore();

const stores = {
  viewStore,
  widgetStore,
  changeRecordStore,
  editorStore,
};

function App() {
  return (
    <MobxProvider {...stores}>
      <div className="main-container">
        <CanvasEditor
          widgets={EXAMPLE_WIDGETS_DATA_RENAMED}
          onSaveChanges={(changes) => {
            console.log("changes: ", JSON.stringify(changes, null, 2));
          }}
        />
      </div>
    </MobxProvider>
  );
}

export default App;
