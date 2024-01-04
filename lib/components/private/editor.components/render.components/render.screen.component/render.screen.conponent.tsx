import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.screen.component.module.scss";
import RenderContent from "../render.content.component/render.content.component";
import { Widget } from "../../../../../schemas/widget.schemas/widget.schema";
import GridLayout from "../../grid.layout.component/grid.layout.component";

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
      breakpoints={{ xl: 1200, md: 996, xs: 480 }}
      cols={{ xl: 22, md: 6, xs: 4 }}
      rowHeight={25}
    >
      {content.map((widget) => (
        <div key={widget.positioning.i} className={styles.widgetContainer}>
          <RenderContent readonly={readonly} widget={widget} />
        </div>
      ))}
    </GridLayout>
  );
};

export default RenderScreen;
