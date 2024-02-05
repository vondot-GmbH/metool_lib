import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import {
  convertToGridLayout,
  generateGridLayoutBackground,
} from "../../../../globals/helpers/layout.helper";
import { WidgetHierarchyMap } from "../../../../schemas/widget.schemas/widget.schema";
import { useEffect, useState } from "react";
import styles from "./grid.layout.component.module.scss";
import { v4 as UUID } from "uuid";
import ViewStore from "../../../../stores/view.store";
import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../stores/widget.store";
import ConfigProvider from "../../../../config/config.provider";

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
  parentWidgetID?: string;
}

const ResponsiveGridLayout = WidthProvider(Responsive);
type BreakpointType = string;

const GridLayout = ({
  key,
  children,
  content,
  onDragStart: propOnDragStart,
  onDragStop: propOnDragStop,
  onResizeStart: propOnResizeStart,
  onResizeStop: propOnResizeStop,
  isNested = false,
  widgetStore,
  parentWidgetID,
}: GridLayoutProps): JSX.Element => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState(""); // TODO set initial breakpoint based on window size
  const [gridBackground, setGridBackground] = useState("");
  const [showGrid, setShowGrid] = useState(false);

  const configProvider = ConfigProvider.getInstance();

  const breakpoints = configProvider.getBreakpointsForAllLayouts(
    isNested ? "nested" : "root"
  );

  const rowHeight = configProvider.getRowHeight(
    isNested ? "nested" : "root",
    currentBreakpoint
  );

  const cols = configProvider.getColsForAllLayouts(
    isNested ? "nested" : "root"
  );

  const layouts = convertToGridLayout(content, breakpoints);
  const [savedLayouts, setSavedLayouts] = useState(layouts);

  const gridBackgroundStyle = {
    background: showGrid ? gridBackground : "none",
  } as any;

  if (isNested) {
    gridBackgroundStyle.height = "100%";
  }

  const onBreakpointChange = (newBreakpoint: BreakpointType) => {
    setCurrentBreakpoint(newBreakpoint);
  };

  // TODO
  const handleDrop = (layout: any, layoutItem: any, event: any): void => {
    if (currentBreakpoint == null) {
      return;
    }

    const widgetID = UUID();

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
      layouts={savedLayouts}
      breakpoints={breakpoints}
      cols={cols}
      rowHeight={rowHeight}
      style={gridBackgroundStyle}
      onBreakpointChange={onBreakpointChange}
      compactType={null}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      onDrop={handleDrop}
      isDroppable={true}
      onLayoutChange={(_layout, layouts) => {
        setSavedLayouts(layouts);
      }}
    >
      {children}
    </ResponsiveGridLayout>
  );
};

export default inject("viewStore", "widgetStore")(observer(GridLayout));
