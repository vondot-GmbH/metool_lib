import {
  Widget,
  WidgetHierarchy,
  WidgetHierarchyMap,
} from "../../schemas/widget.schemas/widget.schema";

export const structureWidgetsHierarchy = (
  widgets: Widget[]
): WidgetHierarchyMap => {
  const widgetMap = new Map<string, WidgetHierarchy>();

  // helper function to process widget and its children recursively
  const processWidget = (currentWidget: Widget, parentId: string | null) => {
    // add widget to map if it does not exist
    if (!widgetMap.has(currentWidget.widgetID)) {
      widgetMap.set(currentWidget.widgetID, {
        widget: currentWidget,
        children: [],
        level: parentId ? "NESTED" : "ROOT",
      });
    }

    // add the current widget as a child to its parent
    if (parentId && widgetMap.has(parentId)) {
      const parentHierarchy = widgetMap.get(parentId);
      if (parentHierarchy) {
        parentHierarchy.children.push(currentWidget.widgetID);
      }
    }

    // process all children of the current widget
    for (const widget of widgets) {
      if (widget.parentID === currentWidget.widgetID) {
        processWidget(widget, currentWidget.widgetID);
      }
    }
  };

  // process all widgets without parent (root widgets)
  for (const widget of widgets) {
    if (!widget.parentID) {
      processWidget(widget, null);
    }
  }

  return widgetMap as WidgetHierarchyMap;
};

// filter out all root level widgets from the given structured widgets map
export const getFilteredRootLevelWidgets = (
  structuredWidgets: WidgetHierarchyMap
): WidgetHierarchyMap => {
  const filteredWidgets = new Map<string, WidgetHierarchy>();

  for (const [id, widget] of structuredWidgets) {
    if (widget.level === "ROOT") {
      filteredWidgets.set(id, widget);
    }
  }

  return filteredWidgets;
};

// filter out all given widget ids from the given structured widgets map and return a filtered map
export const getFilteredWidgetMapByWidgetID = (
  widgetIDs: string[],
  widgets: WidgetHierarchyMap
): WidgetHierarchyMap => {
  const filteredWidgets = new Map<string, WidgetHierarchy>();

  for (const [id, widget] of widgets) {
    if (widgetIDs.includes(widget.widget.widgetID)) {
      filteredWidgets.set(id, widget);
    }
  }

  return filteredWidgets;
};
