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
import { inject, observer } from "mobx-react";
import ViewStore from "../../../../../stores/view.store";
import WidgetStore from "../../../../../stores/widget.store";

interface RenderWidgetProps {
  readonly?: boolean;
  widget: WidgetHierarchy;
  allWidgets: WidgetHierarchyMap;
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
}

const RenderWidget = ({
  widget,
  allWidgets,
  readonly,
}: RenderWidgetProps): JSX.Element => {
  // get nested widgets for the current widget
  const childrenWidgets = getFilteredWidgetMapByWidgetID(
    widget.children,
    allWidgets
  );

  // convert the map to an array for rendering purposes
  const preparedChildrenWidgets = Array.from(childrenWidgets.values());

  // render nested widgets if there are any nested widgets
  const renderNestedWidgets = (): JSX.Element | null => {
    // if there are no nested widgets, return null
    if (preparedChildrenWidgets == null || preparedChildrenWidgets.length < 1) {
      return null;
    }

    // orherwise render the nested widgets in a new grid layout
    return (
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
    );
  };

  return (
    <div className={styles.widgetContainer}>
      {widget.widget.widgetID}
      {renderNestedWidgets()}
    </div>
  );
};

export default inject("viewStore", "widgetStore")(observer(RenderWidget));
