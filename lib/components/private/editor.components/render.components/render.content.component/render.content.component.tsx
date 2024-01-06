import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.content.comonent.module.scss";
import { Widget } from "../../../../../schemas/widget.schemas/widget.schema";
import GridLayout from "../../grid.layout.component/grid.layout.component";
import {
  NESTED_BREAKPOINTS,
  NESTED_COLS,
} from "../../../../../globals/config/grid.layout.config";

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
        breakpoints={NESTED_BREAKPOINTS}
        cols={NESTED_COLS}
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
      {widget.widgetID}
      {renderChildrenInGrid(widget.children)}
    </div>
  );
};

export default RenderContent;
