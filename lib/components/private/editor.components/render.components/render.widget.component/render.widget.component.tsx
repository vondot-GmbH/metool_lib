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
import { useState } from "react";
import WidgetContextMenu from "../../widget.context.menu.component/widget.context.menu.component";

interface RenderWidgetProps {
  readonly?: boolean;
  widgetToRender: WidgetHierarchy;
  allWidgets: WidgetHierarchyMap;
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
}

const RenderWidget = ({
  widgetToRender,
  allWidgets,
  readonly,
  widgetStore,
  viewStore,
}: RenderWidgetProps): JSX.Element => {
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    anchorPoint: { x: 0, y: 0 },
  });

  const handleCloseMenu = () => {
    setContextMenu({ isOpen: false, anchorPoint: { x: 0, y: 0 } });
    widgetStore?.setSelectWidget(undefined);
  };

  const handleOnContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    widgetID: string
  ) => {
    event.preventDefault();
    event.stopPropagation();

    widgetStore?.setSelectWidget(widgetID);

    setContextMenu({
      isOpen: true,
      anchorPoint: { x: event.pageX, y: event.pageY },
    });
  };

  // get nested widgets for the current widget
  const childrenWidgets = getFilteredWidgetMapByWidgetID(
    widgetToRender.children,
    allWidgets
  );

  const renderContextMenu = (): JSX.Element | null => {
    if (!contextMenu.isOpen) return null;

    return (
      <WidgetContextMenu
        isOpen={contextMenu.isOpen}
        anchorPoint={contextMenu.anchorPoint}
        onClose={handleCloseMenu}
        widgetID={widgetToRender.widget.widgetID}
      />
    );
  };

  // render nested widgets if there are any nested widgets
  const renderNestedWidgets = (): JSX.Element | null => {
    // convert the map to an array for rendering purposes
    const preparedChildrenWidgets = Array.from(childrenWidgets.values());

    // if there are no nested widgets, return null
    if (preparedChildrenWidgets == null || preparedChildrenWidgets.length < 1) {
      return null;
    }

    // orherwise render the nested widgets in a new grid layout
    return (
      <GridLayout
        isNested
        key={"nested-grid-" + widgetToRender.widget.positioning.i}
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
              widgetToRender={childWidget}
              allWidgets={allWidgets}
              widgetStore={widgetStore}
              viewStore={viewStore}
            />
          </div>
        ))}
      </GridLayout>
    );
  };

  return (
    <div
      className={styles.widgetContainer}
      onContextMenu={(e) =>
        !readonly && handleOnContextMenu(e, widgetToRender.widget.widgetID)
      }
    >
      {widgetToRender.widget.widgetID}
      {renderNestedWidgets()}
      {renderContextMenu()}
    </div>
  );
};

export default inject("viewStore", "widgetStore")(observer(RenderWidget));
