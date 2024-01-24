/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import {
  convertToGridLayout,
  generateGridLayoutBackground,
} from "../../../../globals/helpers/layout.helper";
import {
  LayoutBreakpoint,
  Widget,
} from "../../../../schemas/widget.schemas/widget.schema";
import { useEffect, useState } from "react";
import styles from "./grid.layout.component.module.scss";
import ViewStore from "../../../../stores/view.store";
import { inject, observer } from "mobx-react";

interface GridLayoutProps {
  key: string;
  children: JSX.Element[];
  content: Widget[];
  rowHeight?: number;
  breakpoints: { [key: string]: number };
  cols: { [key in LayoutBreakpoint]: number };
  onDragStart?: ReactGridLayout.ItemCallback | undefined;
  isNested?: boolean;
  onDragStop?: ReactGridLayout.ItemCallback | undefined;
  onResizeStart?: ReactGridLayout.ItemCallback | undefined;
  onResizeStop?: ReactGridLayout.ItemCallback | undefined;
  viewStore?: ViewStore;
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
  viewStore,
}: GridLayoutProps): JSX.Element => {
  const layouts = convertToGridLayout(content);

  const [currentBreakpoint, setCurrentBreakpoint] = useState(""); // TODO set initial breakpoint based on window size
  const [gridBackground, setGridBackground] = useState("");
  const [showGrid, setShowGrid] = useState(false);

  const onBreakpointChange = (newBreakpoint: BreakpointType) => {
    console.log("onBreakpointChange", newBreakpoint);
    console.log();
    setCurrentBreakpoint(newBreakpoint);
  };

  const handleDragStart = (
    layout: any,
    oldItem: any,
    newItem: any,
    placeholder: any,
    event: any,
    element: any
  ) => {
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
    setShowGrid(false);
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
    setShowGrid(false);
    if (propOnResizeStop)
      propOnResizeStop(layout, oldItem, newItem, placeholder, event, element);
  };

  //!

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
      layouts={layouts}
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
    >
      {children}
    </ResponsiveGridLayout>
  );
};

export default inject("viewStore")(observer(GridLayout));
