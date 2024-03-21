/* eslint-disable @typescript-eslint/no-unused-vars */
import { Layout } from "react-grid-layout";
import {
  WidgetHierarchyMap,
  WidgetLayouts,
  WidgetPositioning,
} from "../../schemas/widget.schemas/widget.schema";
import { PreparedBreakpointConfig } from "../interfaces/config.interface";

// convert widgets to the grid layout format for react-grid-layout
export const convertToGridLayout = (
  widgets: WidgetHierarchyMap,
  breakpoints: { [key: string]: number }
): { [key: string]: Layout[] } => {
  const layouts: { [key: string]: Layout[] } = {};
  const breakpointKeys = Object.keys(breakpoints);

  for (const [_id, value] of widgets) {
    const widgetLayouts: WidgetLayouts = value.widget.positioning;

    breakpointKeys.forEach((bp) => {
      const pos: any = widgetLayouts[bp];

      if (pos) {
        if (!layouts[bp]) {
          layouts[bp] = [];
        }

        layouts[bp].push({
          i: widgetLayouts.i,
          x: pos.x.value,
          y: pos.y.value,
          w: pos.w.value,
          h: pos.h.value,
        });
      }
    });
  }

  return layouts;
};

// convert grid layouts to widget positioning for the store
export const convertLayoutToPositioningForBreakpoint = (
  layout: Layout[],
  currentBreakpoint: string,
  breakpoints: { [key: string]: number }
): Record<string, WidgetLayouts> => {
  const positioningRecord: Record<string, WidgetLayouts> = {};
  const breakpointKeys = Object.keys(breakpoints);

  for (const item of layout) {
    const widgetId = item.i;

    if (!positioningRecord[widgetId]) {
      positioningRecord[widgetId] = { i: widgetId };

      breakpointKeys.forEach((bp) => {
        positioningRecord[widgetId][bp] = undefined;
      });
    }

    const newPositioning: WidgetPositioning = {
      x: { value: item.x, isInfinity: false },
      y: { value: item.y, isInfinity: false },
      w: { value: item.w, isInfinity: false },
      h: { value: item.h, isInfinity: false },
    };

    positioningRecord[widgetId][currentBreakpoint] = newPositioning;
  }

  return positioningRecord;
};

// adding static properties to the layout
// only for display purposes in the editor (not for saving)
export const convertDynamicLayouts = (
  selectedWidgetID: string | undefined,
  layouts: any,
  readonly: boolean
) => {
  const result = {} as any;

  // go through each breakpoint
  for (const breakpoint of Object.keys(layouts)) {
    const layoutsForBreakpoint = layouts[breakpoint];
    result[breakpoint] = [];

    // go through each layout for the current breakpoint and add the adjusted layout to the result
    for (const layout of layoutsForBreakpoint) {
      // if the grid is readonly or the selected widget is not the current widget, set the layout to static
      const isStatic = readonly || (selectedWidgetID !== layout.i && !readonly);

      result[breakpoint].push({
        ...layout,
        static: isStatic,
      });
    }
  }

  return result;
};

// generate grid layout background based on current breakpoint
export const generateGridLayoutBackground = (args: {
  cols: { [key: string]: number };
  rowHeight: number;
  currentBreakpoint: string;
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
