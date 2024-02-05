import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.widget.comonent.module.scss";
import GridLayout from "../../grid.layout.component/grid.layout.component";
import {
  NESTED_BREAKPOINTS,
  NESTED_COLS,
} from "../../../../../globals/config/grid.layout.config";
import { WidgetHierarchy } from "../../../../../schemas/widget.schemas/widget.schema";
import { getFilteredWidgetMapByWidgetID } from "../../../../../globals/helpers/widget.helper";
import { inject, observer } from "mobx-react";
import ViewStore from "../../../../../stores/view.store";
import WidgetContextMenu from "../../widget.context.menu.component/widget.context.menu.component";
import WidgetStore from "../../../../../stores/widget.store";
import classNames from "classnames";
import ConfigProvider from "../../../../../config/config.provider";
import React from "react";

interface RenderWidgetProps {
  readonly?: boolean;
  widgetToRender: WidgetHierarchy;
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
}

const RenderWidget = ({
  widgetToRender,
  readonly,
  widgetStore,
  viewStore,
}: RenderWidgetProps): JSX.Element => {
  const registeredWidgets = ConfigProvider.getInstance().getRegisteredWidgets();
  let widgetContainerClassName = classNames(styles.widgetContainer);
  const contextMenu = widgetStore?.getContextMenuState();
  const allWidgets = widgetStore?.getStructuredData();

  // if the widget is selected, add the selected widget class
  if (
    widgetToRender.widget.widgetID ==
    widgetStore?.getSelectedWidget()?.widget.widgetID
  ) {
    widgetContainerClassName += ` ${styles.selectedWidget}`;
  }

  const handleCloseContextMenu = () => {
    widgetStore?.setContextMenuState({
      isOpen: false,
      anchorPoint: { x: 0, y: 0 },
      selectedWidgetID: null,
    });
    widgetStore?.setSelectWidget(undefined);
  };

  const handleOnContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    widgetID: string
  ) => {
    event.preventDefault();
    event.stopPropagation();

    widgetStore?.setSelectWidget(widgetID);

    widgetStore?.setContextMenuState({
      isOpen: true,
      anchorPoint: {
        x: event.clientX + window.scrollX,
        y: event.clientY + window.scrollY,
      },
      selectedWidgetID: widgetID,
    });
  };

  const renderContextMenu = (): JSX.Element | null => {
    if (
      !contextMenu?.isOpen ||
      contextMenu?.selectedWidgetID != widgetToRender.widget.widgetID
    ) {
      return null;
    }

    return (
      <WidgetContextMenu
        isOpen={contextMenu.isOpen}
        anchorPoint={contextMenu.anchorPoint}
        onClose={handleCloseContextMenu}
      />
    );
  };

  // get nested widgets for the current widget
  const childrenWidgets = getFilteredWidgetMapByWidgetID(
    widgetToRender.children,
    allWidgets
  );

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
        parentWidgetID={widgetToRender.widget.widgetID}
        isNested
        key={"nested-grid-" + widgetToRender.widget.positioning.i}
        content={childrenWidgets}
        breakpoints={NESTED_BREAKPOINTS}
        cols={NESTED_COLS}
        rowHeight={20}
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
              widgetStore={widgetStore}
              viewStore={viewStore}
            />
          </div>
        ))}
      </GridLayout>
    );
  };

  // render the widget component based on the widget type and the registered widgets
  const renderWidgetComponent = (widgetType: string): JSX.Element => {
    // find the widget in the registered widgets
    const widget = registeredWidgets?.find(
      (widget) => widget.type === widgetType
    );

    if (!widget || !widget.component) {
      return <div>Widget not found</div>;
    }
    // render the widget component if it exists
    const WidgetComponent = widget.component as React.ComponentType<any>;

    return React.createElement(WidgetComponent);
  };

  return (
    <div
      className={widgetContainerClassName}
      onContextMenu={(e) =>
        !readonly && handleOnContextMenu(e, widgetToRender.widget.widgetID)
      }
    >
      {renderWidgetComponent(widgetToRender.widget.widgetType)}
      {renderNestedWidgets()}
      {renderContextMenu()}
    </div>
  );
};

export default inject("viewStore", "widgetStore")(observer(RenderWidget));
