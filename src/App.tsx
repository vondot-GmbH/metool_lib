import "./App.css";
import { CanvasEditor } from "../lib/main";
import ViewStore from "../lib/stores/view.store";
import { Provider as MobxProvider } from "mobx-react";
import WidgetStore from "../lib/stores/widget.store";

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
        <CanvasEditor />
      </div>
    </MobxProvider>
  );
}

export default App;
