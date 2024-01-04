import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.content.comonent.module.scss";
import { Widget } from "../../../../../schemas/widget.schemas/widget.schema";
import GridLayout from "../../grid.layout.component/grid.layout.component";

interface RenderContentProps {
  readonly?: boolean;
  widget: Widget;
}

// TODO change naming to RenderWidget or RenderWidgetContent
const RenderContent = ({
  readonly,
  widget,
}: RenderContentProps): JSX.Element => {
  const renderChildrenInGrid = (
    children: Widget[] | undefined
  ): JSX.Element | null => {
    if (!children || children.length === 0) return null;

    return (
      <GridLayout
        key={"nested-grid-" + widget.positioning.i}
        content={children}
        breakpoints={{ xl: 1200, md: 996, xs: 480 }}
        cols={{ xl: 12, md: 6, xs: 4 }}
        rowHeight={25}
        onDragStart={(_a, _b, _c, _d, e) => e.stopPropagation()}
        //   className={styles.nestedLayout}
      >
        {children.map((child) => (
          <div key={child.positioning.i} className={styles.childWidget}>
            <RenderContent readonly={readonly} widget={child} />
          </div>
        ))}
      </GridLayout>
    );
  };

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.demoWidget}>
        {widget.widgetID}
        {renderChildrenInGrid(widget.children)}
      </div>
    </div>
  );
};

export default RenderContent;
