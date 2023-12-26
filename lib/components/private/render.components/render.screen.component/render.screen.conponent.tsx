import { Responsive, WidthProvider } from "react-grid-layout";
import { Widget } from "../../../../schemas/widget.schemas/widget.schema";
import { convertToGridLayout } from "../../../../globals/helpers/layout.helper";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.screen.component.module.scss";
import RenderContent from "../render.content.component/render.content.component";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface RenderScreenProps {
  readonly?: boolean;
  content: Widget[];
}

const RenderScreen = ({
  readonly,
  content,
}: RenderScreenProps): JSX.Element => {
  const topLevelLayouts = convertToGridLayout(content);

  return (
    <ResponsiveGridLayout
      margin={[15, 15]}
      key={"top-level-grid"}
      className={styles.layout}
      layouts={topLevelLayouts}
      breakpoints={{ xl: 1200, md: 996, xs: 480 }}
      cols={{ xl: 12, md: 6, xs: 4 }}
      rowHeight={50}
    >
      {content.map((widget) => (
        <div key={widget.positioning.i} className={styles.widgetContainer}>
          <RenderContent readonly={readonly} widget={widget} />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default RenderScreen;
