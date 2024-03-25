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
  viewStore?: ViewStore;
  widgetStore?: WidgetStore;
  editorStore?: EditorStore;
  parentWidgetID?: string;
  readonly?: boolean;
  selectedWidgetID: string | undefined;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const LayoutAreaGridLayout = ({
  key = "layout-area-grid-layout",
  children,
  content,
  widgetStore,
  editorStore,
  parentWidgetID,
  readonly = false,
  selectedWidgetID,
}: GridLayoutProps): JSX.Element => {
  const currentBreakpoint = editorStore?.currentBreakpoint ?? "";

  const [gridBackground, setGridBackground] = useState("");
  const [showGrid, setShowGrid] = useState(false);

  const configProvider = ConfigProvider.getInstance();

  const breakpoints = configProvider.getBreakpointsForAllLayouts(
    WidgetHierarchyLocation.ROOT
  );

  const rowHeight = configProvider.getRowHeight(
    WidgetHierarchyLocation.ROOT,
    currentBreakpoint
  );

  const cols = configProvider.getColsForAllLayouts(
    WidgetHierarchyLocation.ROOT
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

  const onBreakpointChange = (newBreakpoint: string) => {
    editorStore?.setCurrentBreakpoint(newBreakpoint);
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

    // widgetStore?.updateWidgetsLayoutForCurrentBreakpoint(
    //   layout,
    //   currentBreakpoint,
    //   breakpoints
    // );
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
      //   className={styles.gridLayout}
      margin={[0, 0]}
      layouts={dynamicLayouts}
      breakpoints={breakpoints}
      breakpoint={readonly ? undefined : editorStore?.currentBreakpoint}
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
)(observer(LayoutAreaGridLayout));
