import styles from "./render.widget.comonent.module.scss";
import { WidgetHierarchy } from "../../../../../schemas/widget.schemas/widget.schema";
import { inject, observer } from "mobx-react";
import ViewStore from "../../../../../stores/view.store";
import WidgetContextMenu from "../../widget.context.menu.component/widget.context.menu.component";
import WidgetStore from "../../../../../stores/widget.store";
import classNames from "classnames";
import ConfigProvider from "../../../../../config/config.provider";
import React, { useRef, useState } from "react";
import SmallText from "../../../general.components/text.components/small.text.component/small.text.component";
import StateStore from "../../../../../stores/state.store";
import EditorStore from "../../../../../stores/editor.store";

interface RenderWidgetProps {
  readonly?: boolean;
  widgetToRender: WidgetHierarchy;
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
  stateStore?: StateStore;
  editorStore?: EditorStore;
  showVisualWidgetOutline: boolean;
}

const RenderLayoutAreaWidget = ({
  widgetToRender,
  readonly,
  widgetStore,
  editorStore,
  stateStore,
  showVisualWidgetOutline,
}: RenderWidgetProps): JSX.Element => {
  const registeredWidgets = ConfigProvider.getInstance().getRegisteredWidgets();
  const contextMenu = editorStore?.widgetContextMenu;
  const selectedWidgetID = editorStore?.selectedWidget?.widget.widgetID;
  const widgetRef = useRef(null);
  // @ts-ignore
  const [hoveredWidgetID, setHoveredWidgetID] = useState<string | undefined>();

  const widgetContainerClassName = classNames(styles.widgetContainer, {
    [styles.hovered]: hoveredWidgetID === widgetToRender.widget.widgetID,
    [styles.selected]: selectedWidgetID === widgetToRender.widget.widgetID,
    [styles.visualWidgetOutlineGuide]: showVisualWidgetOutline,
  });

  const handleCloseContextMenu = () => {
    if (readonly) return;

    editorStore?.setWidgetContextMenu({
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

    editorStore?.setSelectWidget(widgetID);

    editorStore?.setWidgetContextMenu({
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

  const renderWidgetComponent = React.useMemo(() => {
    const widgetType = widgetToRender.widget.widgetType;
    const widget = registeredWidgets?.find(
      (widget) => widget.type === widgetType
    );

    if (!widget || !widget.component) {
      return <div>Widget not found</div>;
    }
    const WidgetComponent = widget.component as React.ComponentType<any>;

    return React.createElement(WidgetComponent, {
      widgetID: widgetToRender.widget.widgetID,
      widgetStore,
      stateStore,
    });
  }, [widgetToRender, registeredWidgets, widgetStore, stateStore]);

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
    editorStore?.setSelectWidget(widgetID);
  };

  return (
    <div
      ref={widgetRef}
      onDoubleClick={(e) =>
        handleWidgetClick(e, widgetToRender.widget.widgetID)
      }
      className={widgetContainerClassName}
      data-widget-type={widgetToRender.widget.widgetType}
      onContextMenu={(e) =>
        handleOnContextMenu(e, widgetToRender.widget.widgetID)
      }
    >
      {renderWidgetTypeLabel()}

      <div className={styles.widgetContentWrapper}>
        {renderWidgetComponent}
        {renderContextMenu()}
      </div>
    </div>
  );
};

export default inject(
  "viewStore",
  "widgetStore",
  "stateStore",
  "editorStore"
)(observer(RenderLayoutAreaWidget));
