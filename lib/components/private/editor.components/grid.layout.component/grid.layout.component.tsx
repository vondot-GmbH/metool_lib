/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import {
  convertToGridLayout,
  generateGridLayoutBackground,
} from "../../../../globals/helpers/layout.helper";
import {
  LayoutBreakpoint,
  WidgetHierarchyMap,
} from "../../../../schemas/widget.schemas/widget.schema";
import { useEffect, useState } from "react";
import styles from "./grid.layout.component.module.scss";
import { v4 as UUID } from "uuid";
import ViewStore from "../../../../stores/view.store";
import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../stores/widget.store";

interface GridLayoutProps {
  key: string;
  children: React.ReactNode | React.ReactNode[];
  content: WidgetHierarchyMap;
  rowHeight?: number;
  breakpoints: { [key: string]: number };
  cols: { [key in LayoutBreakpoint]: number };
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
  rowHeight = 50,
  breakpoints,
  cols,
  onDragStart: propOnDragStart,
  onDragStop: propOnDragStop,
  onResizeStart: propOnResizeStart,
  onResizeStop: propOnResizeStop,
  isNested = false,
  widgetStore,
  parentWidgetID,
}: GridLayoutProps): JSX.Element => {
  const layouts = convertToGridLayout(content);
  const [savedLayouts, setSavedLayouts] = useState(layouts);

  const [currentBreakpoint, setCurrentBreakpoint] = useState(""); // TODO set initial breakpoint based on window size
  const [gridBackground, setGridBackground] = useState("");
  const [showGrid, setShowGrid] = useState(false);

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

    console.log("layoutNEW");
    console.log(layoutNEW);

    console.log("savedLayouts");
    console.log(savedLayouts);

    console.log("content: and parent: ", parentWidgetID);
    console.log(content);

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
      currentBreakpoint: currentBreakpoint as LayoutBreakpoint,
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
      currentBreakpoint as LayoutBreakpoint
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
      currentBreakpoint as LayoutBreakpoint
    );

    if (propOnResizeStop)
      propOnResizeStop(layout, oldItem, newItem, placeholder, event, element);
  };

  useEffect(() => {
    const newGridBackground = generateGridLayoutBackground({
      cols,
      rowHeight,
      currentBreakpoint: currentBreakpoint as LayoutBreakpoint, // TODO
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
      style={{ background: showGrid ? gridBackground : "none", height: "100%" }}
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
