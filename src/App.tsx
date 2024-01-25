import "./App.css";
import { CanvasEditor } from "../lib/main";
import ViewStore from "../lib/stores/view.store";
import { Provider as MobxProvider } from "mobx-react";
import WidgetStore from "../lib/stores/widget.store";
import { EXAMPLE_WIDGETS_DATA_NEW } from "./example.data";

// only for testing purposes

const viewStore = new ViewStore();
const widgetStore = new WidgetStore();

const stores = {
  viewStore,
  widgetStore,
};

function App() {
  return (
    <MobxProvider {...stores}>
      <div className="main-container">
        <CanvasEditor widgets={EXAMPLE_WIDGETS_DATA_NEW} />
      </div>
    </MobxProvider>
  );
}

export default App;
