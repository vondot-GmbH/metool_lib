import "./App.css";
import { CanvasEditor } from "../lib/main";
import ViewStore from "../lib/stores/view.store";
import { Provider as MobxProvider } from "mobx-react";
import WidgetStore from "../lib/stores/widget.store";
import { EXAMPLE_DATA_EXPORTED } from "./example.data";
import ChangeRecordStore from "../lib/stores/change.record.store";

// only for testing purposes

const viewStore = new ViewStore();
const changeRecordStore = new ChangeRecordStore();
const widgetStore = new WidgetStore(changeRecordStore);

const stores = {
  viewStore,
  widgetStore,
  changeRecordStore,
};

function App() {
  return (
    <MobxProvider {...stores}>
      <div className="main-container">
        <CanvasEditor
          widgets={EXAMPLE_DATA_EXPORTED}
          onSaveChanges={(changes) => {
            console.log("changes: ", JSON.stringify(changes, null, 2));
          }}
        />
      </div>
    </MobxProvider>
  );
}

export default App;
