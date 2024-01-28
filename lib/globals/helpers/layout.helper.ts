/* eslint-disable @typescript-eslint/no-unused-vars */
import { Layout, Layouts } from "react-grid-layout";
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

export const convertLayoutToPositioningForBreakpoint = (
  layout: Layout[],
  currentBreakpoint: LayoutBreakpoint
): Record<string, WidgetLayouts> => {
  const positioningRecord: Record<string, WidgetLayouts> = {};

  // go through all layout elements
  for (const item of layout) {
    const widgetId = item.i;

    // init positioning record for this widget if it does not exist
    if (!positioningRecord[widgetId]) {
      positioningRecord[widgetId] = {
        i: widgetId,
        xs: undefined,
        md: undefined,
        xl: undefined, // TODO make this dynamic
      };
    }

    // update the positioning record with the new values for the current breakpoint
    const newPositioning: WidgetPositioning = {
      x: { value: item.x, isInfinity: false },
      y: { value: item.y, isInfinity: false },
      w: { value: item.w, isInfinity: false },
      h: { value: item.h, isInfinity: false },
    };

    // update the positioning record with the new values
    positioningRecord[widgetId][currentBreakpoint] = newPositioning;
  }

  return positioningRecord;
};

export const convertLayoutToPositioning = (
  allLayouts: Layouts
): Record<string, WidgetLayouts> => {
  const positioningRecord: Record<string, WidgetLayouts> = {};

  // go through all breakpoints in the layout
  for (const breakpointKey in allLayouts) {
    // if breakpoint does not exist, skip it
    if (!(breakpointKey in allLayouts)) continue;

    const breakpoint = breakpointKey as LayoutBreakpoint;
    const layouts = allLayouts[breakpoint];

    // go through all layouts elements in the breakpoint
    for (const item of layouts) {
      // init positioning record for this widget if it does not exist
      if (!positioningRecord[item.i]) {
        positioningRecord[item.i] = {
          i: item.i,
          xs: undefined, // TODO make this dynamic
          md: undefined,
          xl: undefined,
        };

        // initialize all breakpoints dynamically
        for (const bpKey in allLayouts) {
          // if breakpoint does not exist, skip it
          if (!(bpKey in allLayouts)) continue;

          const bp = bpKey as LayoutBreakpoint;
          positioningRecord[item.i][bp] = undefined;
        }
      }

      // update the positioning record with the new values
      positioningRecord[item.i][breakpoint] = {
        x: { value: item.x, isInfinity: false },
        y: { value: item.y, isInfinity: false },
        w: { value: item.w, isInfinity: false },
        h: { value: item.h, isInfinity: false },
      };
    }
  }

  return positioningRecord;
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
