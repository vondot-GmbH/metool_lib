import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import {
  adjustRowHeight,
  convertDynamicLayouts,
  convertToGridLayout,
  generateGridLayoutBackground,
} from "../../../../globals/helpers/layout.helper";
import {
  WidgetHierarchyLocation,
  WidgetHierarchyMap,
} from "../../../../schemas/widget.schemas/widget.schema";
import { useEffect, useMemo, useRef, useState } from "react";
import ViewStore from "../../../../stores/view.store";
import { inject, observer } from "mobx-react";
import ConfigProvider from "../../../../config/config.provider";
import EditorStore from "../../../../stores/editor.store";
import { getUniqueID } from "../../../../globals/helpers/global.helper";
import LayoutStore from "../../../../stores/layout.store";

interface GridLayoutProps {
  key: string;
  children: React.ReactNode | React.ReactNode[];
  content: WidgetHierarchyMap;

  readonly?: boolean;
  selectedWidgetID: string | undefined;
  layoutAreaID: string;

  viewStore?: ViewStore;
  editorStore?: EditorStore;
  layoutStore?: LayoutStore;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const LayoutAreaGridLayout = ({
  key = "layout-area-grid-layout",
  children,
  content,
  editorStore,
  layoutStore,
  layoutAreaID,
  readonly = false,
  selectedWidgetID,
}: GridLayoutProps): JSX.Element => {
  const configProvider = ConfigProvider.getInstance();
  const layoutAreaGridRef = useRef<HTMLDivElement>(null);
  const currentBreakpoint = editorStore?.currentBreakpoint ?? "";
  const [gridBackground, setGridBackground] = useState("");
  const [showGrid, setShowGrid] = useState(false);

  const breakpoints = configProvider.getBreakpointsForAllLayouts(
    WidgetHierarchyLocation.ROOT
  );

  const predefinedRowHeight = configProvider.getRowHeight(
    WidgetHierarchyLocation.ROOT,
    currentBreakpoint
  );

  const cols = configProvider.getColsForAllLayouts(
    WidgetHierarchyLocation.ROOT
  );

  const layouts = convertToGridLayout(content, breakpoints);
  const [savedLayouts, setSavedLayouts] = useState(layouts);
  const [adjustedRowHeight, setAdjustedRowHeight] =
    useState<number>(predefinedRowHeight);

  const dynamicLayouts = useMemo(() => {
    return convertDynamicLayouts(selectedWidgetID, savedLayouts, readonly);
  }, [selectedWidgetID, savedLayouts, readonly]);

  // set the grid background and adjust the row height based on the layout area height
  useEffect(() => {
    if (layoutAreaGridRef?.current != null && predefinedRowHeight != null) {
      const calcRowHeight = adjustRowHeight(
        layoutAreaGridRef?.current?.offsetHeight,
        predefinedRowHeight
      );

      if (calcRowHeight != null) {
        setAdjustedRowHeight(calcRowHeight);
      }
    }

    const newGridBackground = generateGridLayoutBackground({
      cols,
      rowHeight: adjustedRowHeight,
      currentBreakpoint: currentBreakpoint,
    });
    setGridBackground(newGridBackground);
  }, [currentBreakpoint, cols, adjustedRowHeight, predefinedRowHeight]);

  const onBreakpointChange = (newBreakpoint: string) => {
    editorStore?.setCurrentBreakpoint(newBreakpoint);
  };

  const gridBackgroundStyle = {
    background: showGrid ? gridBackground : "none",
    height: "100%",
  } as any;

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

    layoutStore?.addWidget({
      layoutAreaID: layoutAreaID,
      currentBreakpoint: currentBreakpoint,
      layout: layoutNEW,
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

    layoutStore?.updateWidgetsLayoutForCurrentBreakpoint(
      layout,
      currentBreakpoint,
      breakpoints
    );
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

    layoutStore?.updateWidgetsLayoutForCurrentBreakpoint(
      layout,
      currentBreakpoint,
      breakpoints
    );
  };

  return (
    <div ref={layoutAreaGridRef} style={{ width: "100%", height: "100%" }}>
      <ResponsiveGridLayout
        key={key}
        margin={[0, 0]}
        layouts={dynamicLayouts}
        breakpoints={breakpoints}
        breakpoint={readonly ? undefined : editorStore?.currentBreakpoint}
        cols={cols}
        rowHeight={adjustedRowHeight}
        style={gridBackgroundStyle}
        compactType={"vertical"}
        onBreakpointChange={onBreakpointChange}
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
    </div>
  );
};

export default inject(
  "viewStore",
  "editorStore",
  "layoutStore"
)(observer(LayoutAreaGridLayout));
