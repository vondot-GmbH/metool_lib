import {
  Widget,
  WidgetHierarchy,
  WidgetHierarchyLocation,
  WidgetHierarchyMap,
} from "../../schemas/widget.schemas/widget.schema";

export const structureWidgetsHierarchy = (
  widgets: Widget[]
): WidgetHierarchyMap => {
  const widgetMap = new Map<string, WidgetHierarchy>();

  const determineWidgetLocation = (widget: Widget): WidgetHierarchyLocation => {
    if (widget.layoutAreaID && widget.pageID) {
      return WidgetHierarchyLocation.LAYOUT_AREA;
    } else if (widget.parentID) {
      return WidgetHierarchyLocation.NESTED;
    } else {
      return WidgetHierarchyLocation.ROOT;
    }
  };

  // helper function to process widget and its children recursively
  const processWidget = (currentWidget: Widget, parentId: string | null) => {
    const location = determineWidgetLocation(currentWidget);

    const log = location === WidgetHierarchyLocation.LAYOUT_AREA;

    if (log) {
      console.log("location:");
      console.log(JSON.stringify(location));
      console.log(
        "!widgetMap.has(currentWidget.widgetID)",
        !widgetMap.has(currentWidget.widgetID)
      );
      console.log("(widgetID)", currentWidget);
    }
    // add widget to map if it does not exist
    if (!widgetMap.has(currentWidget.widgetID)) {
      if (log) {
        console.log("if block..");
      }
      widgetMap.set(currentWidget.widgetID, {
        widget: currentWidget,
        children: [],
        location,
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

    if (log) {
      console.log("widgetMap:");
      console.log(JSON.stringify(widgetMap));
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
    if (widget.location === WidgetHierarchyLocation.ROOT) {
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
