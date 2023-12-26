import "./App.css";
import { RenderScreen } from "../lib/main";
import { EXAMPLE_WIDGETS_DATA } from "./example.data";

function App() {
  return (
    <div className="main-container">
      <RenderScreen content={EXAMPLE_WIDGETS_DATA} />
    </div>
  );
}

export default App;
