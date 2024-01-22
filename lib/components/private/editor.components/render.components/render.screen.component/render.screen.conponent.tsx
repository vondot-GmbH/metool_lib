import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.screen.component.module.scss";
import RenderWidget from "../render.content.component/render.widget.component";
import { Widget } from "../../../../../schemas/widget.schemas/widget.schema";
import GridLayout from "../../grid.layout.component/grid.layout.component";
import {
  BASE_BREAKPOINTS,
  BASE_COLS,
} from "../../../../../globals/config/grid.layout.config";

interface RenderScreenProps {
  readonly?: boolean;
  content: Widget[];
}

const RenderScreen = ({
  readonly,
  content,
}: RenderScreenProps): JSX.Element => {
  return (
    <GridLayout
      key={"top-level-grid"}
      content={content}
      rowHeight={46}
      breakpoints={BASE_BREAKPOINTS}
      cols={BASE_COLS}
    >
      {content.map((widget) => (
        <div key={widget.positioning.i} className={styles.widgetContainer}>
          <RenderWidget readonly={readonly} widget={widget} />
        </div>
      ))}
    </GridLayout>
  );
};

export default RenderScreen;
