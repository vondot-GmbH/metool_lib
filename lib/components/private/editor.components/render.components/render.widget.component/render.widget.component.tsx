/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.widget.comonent.module.scss";
import GridLayout from "../../grid.layout.component/grid.layout.component";
import {
  NESTED_BREAKPOINTS,
  NESTED_COLS,
} from "../../../../../globals/config/grid.layout.config";
import {
  WidgetHierarchy,
  WidgetHierarchyMap,
} from "../../../../../schemas/widget.schemas/widget.schema";
import { getFilteredWidgetMapByWidgetID } from "../../../../../globals/helpers/widget.helper";

interface RenderWidgetProps {
  readonly?: boolean;
  widget: WidgetHierarchy;
  allWidgets: WidgetHierarchyMap;
}

const RenderWidget = ({
  widget,
  allWidgets,
  readonly,
}: RenderWidgetProps): JSX.Element => {
  const childrenWidgets = getFilteredWidgetMapByWidgetID(
    widget.children,
    allWidgets
  );

  const preparedChildrenWidgets = Array.from(childrenWidgets.values());

  return (
    <div className={styles.widgetContainer}>
      {widget.widget.widgetID}

      {/* Render the children widgets recursively, if they exist */}
      {preparedChildrenWidgets.length > 0 && (
        <GridLayout
          isNested
          key={"nested-grid-" + widget.widget.positioning.i}
          content={childrenWidgets}
          breakpoints={NESTED_BREAKPOINTS}
          cols={NESTED_COLS}
          rowHeight={25}
          onDragStart={(_a, _b, _c, _d, e) => e.stopPropagation()}
        >
          {preparedChildrenWidgets.map((childWidget) => (
            <div
              key={childWidget.widget.positioning.i}
              className={styles.childWidget}
            >
              <RenderWidget
                readonly={readonly}
                widget={childWidget}
                allWidgets={allWidgets}
              />
            </div>
          ))}
        </GridLayout>
      )}
    </div>
  );
};

export default RenderWidget;
