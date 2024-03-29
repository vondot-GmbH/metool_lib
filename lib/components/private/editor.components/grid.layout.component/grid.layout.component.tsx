import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import {
  convertDynamicLayouts,
  convertToGridLayout,
  generateGridLayoutBackground,
} from "../../../../globals/helpers/layout.helper";
import {
  WidgetHierarchyLocation,
  WidgetHierarchyMap,
} from "../../../../schemas/widget.schemas/widget.schema";
import { useEffect, useMemo, useState } from "react";
import styles from "./grid.layout.component.module.scss";
import ViewStore from "../../../../stores/view.store";
import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../stores/widget.store";
import ConfigProvider from "../../../../config/config.provider";
import EditorStore from "../../../../stores/editor.store";
import { getUniqueID } from "../../../../globals/helpers/global.helper";

interface GridLayoutProps {
  key: string;
  children: React.ReactNode | React.ReactNode[];
  content: WidgetHierarchyMap;
  onDragStart?: ReactGridLayout.ItemCallback | undefined;
  isNested?: boolean;
  onDragStop?: ReactGridLayout.ItemCallback | undefined;
  onResizeStart?: ReactGridLayout.ItemCallback | undefined;
  onResizeStop?: ReactGridLayout.ItemCallback | undefined;
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
  editorStore?: EditorStore;
  parentWidgetID?: string;
  readonly?: boolean;
  selectedWidgetID: string | undefined;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const GridLayout = ({
  key = "grid-layout",
  children,
  content,
  onDragStart: propOnDragStart,
  onDragStop: propOnDragStop,
  onResizeStart: propOnResizeStart,
  onResizeStop: propOnResizeStop,
  isNested = false,
  widgetStore,
  editorStore,
  parentWidgetID,
  readonly = false,
  selectedWidgetID,
}: GridLayoutProps): JSX.Element => {
  const [localCurrentBreakpoint, setLocalCurrentBreakpoint] =
    useState<string>("");

  const currentBreakpoint = isNested
    ? localCurrentBreakpoint ?? ""
    : editorStore?.currentBreakpoint ?? "";

  const [gridBackground, setGridBackground] = useState("");
  const [showGrid, setShowGrid] = useState(false);

  const configProvider = ConfigProvider.getInstance();

  const breakpoints = configProvider.getBreakpointsForAllLayouts(
    isNested ? WidgetHierarchyLocation.NESTED : WidgetHierarchyLocation.ROOT
  );

  const rowHeight = configProvider.getRowHeight(
    isNested ? WidgetHierarchyLocation.NESTED : WidgetHierarchyLocation.ROOT,
    currentBreakpoint
  );

  const cols = configProvider.getColsForAllLayouts(
    isNested ? WidgetHierarchyLocation.NESTED : WidgetHierarchyLocation.ROOT
  );

  const layouts = convertToGridLayout(content, breakpoints);
  const [savedLayouts, setSavedLayouts] = useState(layouts);

  const dynamicLayouts = useMemo(() => {
    return convertDynamicLayouts(selectedWidgetID, savedLayouts, readonly);
  }, [selectedWidgetID, savedLayouts, readonly]);

  const gridBackgroundStyle = {
    background: showGrid ? gridBackground : "none",
    height: "100%",
  } as any;

  if (isNested) {
    gridBackgroundStyle.height = "100%";
  }

  const onBreakpointChange = (newBreakpoint: string) => {
    if (isNested || readonly) {
      setLocalCurrentBreakpoint(newBreakpoint);
    } else {
      editorStore?.setCurrentBreakpoint(newBreakpoint);
    }
  };

  // TODO
  const handleDrop = (_layout: any, layoutItem: any, event: any): void => {
    if (currentBreakpoint == null) {
      return;
    }

    const widgetID = getUniqueID();

    const layoutNEW: Layout = {
      i: widgetID,
      h: 2,
      w: 5,
      x: layoutItem.x,
      y: layoutItem.y,
    };

    const updatedLayoutsForCurrentBreakpoint = [
      ...(savedLayouts[currentBreakpoint] || []),
      layoutNEW,
    ];

    const updatedSavedLayouts = {
      ...savedLayouts,
      [currentBreakpoint]: updatedLayoutsForCurrentBreakpoint,
    };

    const widgetType = event.dataTransfer.getData("text");

    widgetStore?.addWidget({
      currentBreakpoint: currentBreakpoint,
      layout: layoutNEW,
      parentID: parentWidgetID ?? null,
      widgetType,
    });

    setSavedLayouts(updatedSavedLayouts);
  };

  const handleDragStart = (
    layout: any,
    oldItem: any,
    newItem: any,
    placeholder: any,
    event: any,
    element: any
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setShowGrid(true);
    editorStore?.setVisualWidgetOutlineGuide(true);

    if (propOnDragStart)
      propOnDragStart(layout, oldItem, newItem, placeholder, event, element);
  };

  const handleDragStop = (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    event: MouseEvent,
    element: HTMLElement
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setShowGrid(false);
    editorStore?.setVisualWidgetOutlineGuide(false);

    widgetStore?.updateWidgetsLayoutForCurrentBreakpoint(
      layout,
      currentBreakpoint,
      breakpoints
    );

    if (propOnDragStop)
      propOnDragStop(layout, oldItem, newItem, placeholder, event, element);
  };

  const handleResizeStart = (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    event: MouseEvent,
    element: HTMLElement
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setShowGrid(true);
    editorStore?.setVisualWidgetOutlineGuide(true);

    if (propOnResizeStart)
      propOnResizeStart(layout, oldItem, newItem, placeholder, event, element);
  };

  const handleResizeStop = (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    event: MouseEvent,
    element: HTMLElement
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setShowGrid(false);
    editorStore?.setVisualWidgetOutlineGuide(false);

    widgetStore?.updateWidgetsLayoutForCurrentBreakpoint(
      layout,
      currentBreakpoint,
      breakpoints
    );

    if (propOnResizeStop)
      propOnResizeStop(layout, oldItem, newItem, placeholder, event, element);
  };

  useEffect(() => {
    const newGridBackground = generateGridLayoutBackground({
      cols,
      rowHeight,
      currentBreakpoint: currentBreakpoint,
    });
    setGridBackground(newGridBackground);
  }, [currentBreakpoint, cols, rowHeight]);

  return (
    <ResponsiveGridLayout
      key={key}
      className={isNested ? undefined : styles.gridLayout}
      margin={[0, 0]}
      layouts={dynamicLayouts}
      breakpoints={breakpoints}
      breakpoint={
        isNested || readonly ? undefined : editorStore?.currentBreakpoint
      }
      cols={cols}
      rowHeight={rowHeight}
      style={gridBackgroundStyle}
      compactType={"vertical"}
      onBreakpointChange={onBreakpointChange}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      onDrop={handleDrop}
      isDroppable={true}
      isDraggable={selectedWidgetID != null && !readonly}
      onLayoutChange={(_layout, layouts) => {
        setSavedLayouts(layouts);
      }}
    >
      {children}
    </ResponsiveGridLayout>
  );
};

export default inject(
  "viewStore",
  "widgetStore",
  "editorStore"
)(observer(GridLayout));
