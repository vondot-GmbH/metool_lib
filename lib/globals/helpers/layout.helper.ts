/* eslint-disable @typescript-eslint/no-unused-vars */
import { Layout } from "react-grid-layout";
import {
  LayoutBreakpoint,
  WidgetHierarchyMap,
  WidgetLayouts,
  WidgetPositioning,
} from "../../schemas/widget.schemas/widget.schema";

// convertToGridLayout converts the widget layout to a react-grid-layout layout
export const convertToGridLayout = (
  widgets: WidgetHierarchyMap
): { [key: string]: Layout[] } => {
  const layouts: { [key in LayoutBreakpoint]?: Layout[] } = {};

  // loop through all widgets
  for (const [id, value] of widgets) {
    const widgetLayouts: WidgetLayouts = value.widget.positioning;

    // loop through all breakpoints of widget layout
    for (const bp of ["xs", "md", "xl"] as LayoutBreakpoint[]) {
      const pos: WidgetPositioning | undefined = widgetLayouts[bp];

      if (pos) {
        // if breakpoint does not exist, create it
        if (!layouts[bp]) {
          layouts[bp] = [];
        }

        // add position to breakpoint
        layouts[bp]!.push({
          i: widgetLayouts.i,
          x: pos.x.value,
          y: pos.y.value,
          w: pos.w.value,
          h: pos.h.value,
        });
      }
    }
  }

  return layouts as { [key: string]: Layout[] };
};

export const generateGridLayoutBackground = (args: {
  cols: { [key in LayoutBreakpoint]: number };
  rowHeight: number;
  currentBreakpoint: LayoutBreakpoint;
}) => {
  const { cols, rowHeight, currentBreakpoint } = args;

  // calculate column width based on current breakpoint
  const columnWidth = `calc(100% / ${cols[currentBreakpoint]})`;

  // generate vertical and horizontal lines for grid
  const verticalLines = `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 2px)`;
  const horizontalLines = `linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 2px)`;

  // return grid background value
  return `${verticalLines} 0 0 / ${columnWidth} 100%, ${horizontalLines} 0 0 / 100% ${rowHeight}px`;
};
