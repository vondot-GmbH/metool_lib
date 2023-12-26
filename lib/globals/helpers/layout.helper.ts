import { Layout } from "react-grid-layout";
import {
  LayoutBreakpoint,
  Widget,
  WidgetLayouts,
  WidgetPositioning,
} from "../../schemas/widget.schemas/widget.schema";

// convertToGridLayout converts the widget layout to a react-grid-layout layout
export const convertToGridLayout = (
  widgets: Widget[]
): { [key: string]: Layout[] } => {
  const layouts: { [key in LayoutBreakpoint]?: Layout[] } = {};

  // loop through all widgets
  for (const widget of widgets) {
    const widgetLayouts: WidgetLayouts = widget.positioning;

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
