import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./render.widget.comonent.module.scss";
import GridLayout from "../../grid.layout.component/grid.layout.component";
import {
  WidgetHierarchy,
  WidgetHierarchyMap,
} from "../../../../../schemas/widget.schemas/widget.schema";
import { getFilteredWidgetMapByWidgetID } from "../../../../../globals/helpers/widget.helper";
import { inject, observer } from "mobx-react";
import ViewStore from "../../../../../stores/view.store";
import WidgetContextMenu from "../../widget.context.menu.component/widget.context.menu.component";
import WidgetStore from "../../../../../stores/widget.store";
import classNames from "classnames";
import ConfigProvider from "../../../../../config/config.provider";
import React, { useState } from "react";
import SmallText from "../../../general.components/text.components/small.text.component/small.text.component";
import { WidgetConfig } from "../../../../../main";
import StateStore from "../../../../../stores/state.store";

interface RenderWidgetProps {
  readonly?: boolean;
  widgetToRender: WidgetHierarchy;
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
  stateStore?: StateStore;
  showVisualWidgetOutline: boolean;
}

const RenderWidget = ({
  widgetToRender,
  readonly,
  widgetStore,
  viewStore,
  stateStore,
  showVisualWidgetOutline,
}: RenderWidgetProps): JSX.Element => {
  const registeredWidgets = ConfigProvider.getInstance().getRegisteredWidgets();
  const contextMenu = widgetStore?.getContextMenuState();
  const allWidgets = widgetStore?.getStructuredData();
  const selectedWidgetID = widgetStore?.getSelectedWidget()?.widget.widgetID;

  const [hoveredWidgetID, setHoveredWidgetID] = useState<string | undefined>(
    "customerDataTableNested"
  );

  const handleHoverWidget = (event: any, widgetID: string) => {
    if (readonly) return;

    event.stopPropagation();
    setHoveredWidgetID(widgetID);
  };

  const handleLeaveWidget = () => {
    if (readonly) return;
    setHoveredWidgetID(undefined);
  };

  const widgetContainerClassName = classNames(styles.widgetContainer, {
    [styles.hovered]: hoveredWidgetID === widgetToRender.widget.widgetID,
    [styles.selected]: selectedWidgetID === widgetToRender.widget.widgetID,
    [styles.visualWidgetOutlineGuide]: showVisualWidgetOutline,
  });

  const handleCloseContextMenu = () => {
    if (readonly) return;

    widgetStore?.setContextMenuState({
      isOpen: false,
      anchorPoint: { x: 0, y: 0 },
      selectedWidgetID: null,
    });
  };

  const handleOnContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    widgetID: string
  ) => {
    if (readonly) return;

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
    allWidgets as WidgetHierarchyMap
  );

  // render nested widgets if there are any nested widgets
  const renderNestedWidgets = (widget: WidgetConfig): JSX.Element | null => {
    // if the widget cannot have children, return null
    if (!widget.canHaveChildren) {
      return null;
    }

    // convert the map to an array for rendering purposes
    const preparedChildrenWidgets = Array.from(childrenWidgets.values());

    // if there are no nested widgets, return empty grid layout to allow for drag and drop
    // TODO
    if (preparedChildrenWidgets == null || preparedChildrenWidgets.length < 1) {
      return (
        <GridLayout
          selectedWidgetID={selectedWidgetID}
          parentWidgetID={widgetToRender.widget.widgetID}
          isNested
          key={"nested-grid-" + widgetToRender.widget.positioning.i}
          content={childrenWidgets}
          onDragStart={(_a, _b, _c, _d, e) => e.stopPropagation()}
        >
          <div></div>
        </GridLayout>
      );
    }

    // orherwise render the nested widgets in a new grid layout
    return (
      <GridLayout
        selectedWidgetID={selectedWidgetID}
        parentWidgetID={widgetToRender.widget.widgetID}
        isNested
        key={"nested-grid-" + widgetToRender.widget.positioning.i}
        content={childrenWidgets}
        onDragStart={(_a, _b, _c, _d, e) => e.stopPropagation()}
      >
        {preparedChildrenWidgets.map((childWidget: WidgetHierarchy) => (
          <div
            key={childWidget.widget.positioning.i}
            className={styles.childWidget}
          >
            <RenderWidget
              showVisualWidgetOutline={showVisualWidgetOutline}
              key={childWidget.widget.positioning.i}
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

    return React.createElement(WidgetComponent, {
      widgetID: widgetToRender.widget.widgetID,
      widgetStore,
      stateStore,
      children: renderNestedWidgets(widget),
    });
  };

  const renderWidgetTypeLabel = () => {
    return (
      hoveredWidgetID === widgetToRender.widget.widgetID &&
      !readonly && (
        <div className={styles.widgetType}>
          <SmallText> {widgetToRender.widget.widgetType}</SmallText>
        </div>
      )
    );
  };

  const handleWidgetClick = (
    event: React.MouseEvent<HTMLDivElement>,
    widgetID: string
  ) => {
    if (readonly) return;
    event.stopPropagation();
    event.preventDefault();
    widgetStore?.setSelectWidget(widgetID);
  };

  return (
    <div
      onDoubleClick={(e) =>
        handleWidgetClick(e, widgetToRender.widget.widgetID)
      }
      className={widgetContainerClassName}
      data-widget-type={widgetToRender.widget.widgetType}
      onContextMenu={(e) =>
        handleOnContextMenu(e, widgetToRender.widget.widgetID)
      }
      onMouseEnter={(e) => handleHoverWidget(e, widgetToRender.widget.widgetID)}
      onMouseLeave={handleLeaveWidget}
    >
      {renderWidgetTypeLabel()}

      <div className={styles.widgetContentWrapper}>
        {renderWidgetComponent(widgetToRender.widget.widgetType)}
        {renderContextMenu()}
      </div>
    </div>
  );
};

export default inject(
  "viewStore",
  "widgetStore",
  "stateStore"
)(observer(RenderWidget));
