import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.content.comonent.module.scss";
import { Widget } from "../../../../../schemas/widget.schemas/widget.schema";
import { convertToGridLayout } from "../../../../../globals/helpers/layout.helper";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface RenderContentProps {
  readonly?: boolean;
  widget: Widget;
}

const RenderContent = ({
  readonly,
  widget,
}: RenderContentProps): JSX.Element => {
  const renderChildrenInGrid = (
    children: Widget[] | undefined
  ): JSX.Element | null => {
    if (!children || children.length === 0) return null;

    const childLayouts = convertToGridLayout(children);
    return (
      <ResponsiveGridLayout
        margin={[15, 15]}
        onDragStart={(_a, _b, _c, _d, e) => e.stopPropagation()}
        key={"nested-grid-" + widget.positioning.i}
        className={styles.nestedLayout}
        layouts={childLayouts}
        breakpoints={{ xl: 1200, md: 996, xs: 480 }}
        cols={{ xl: 12, md: 6, xs: 4 }}
      >
        {children.map((child) => (
          <div key={child.positioning.i} className={styles.childWidget}>
            <RenderContent readonly={readonly} widget={child} />
          </div>
        ))}
      </ResponsiveGridLayout>
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
