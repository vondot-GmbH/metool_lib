import { View } from "../lib/schemas/view.schemas/view.schema";
import { Widget } from "../lib/schemas/widget.schemas/widget.schema";

export const EXAMPLE_VIEW: View = {
  _id: "5f9e9b6b9I6b4c3017f3b3a0",
  name: "Customer View",
};

export const EXAMPLE_WIDGETS_DATA_NEW: Widget[] = [
  {
    _id: "5f9e9b6b9c6b4c0017f3b3a1",
    widgetID: "customerTableWrapper",
    widgetType: "WIDGET_WRAPPER",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    positioning: {
      i: "customerTableWrapper",
      xs: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 4,
          isInfinity: false,
        },
        h: {
          value: 3,
          isInfinity: false,
        },
      },
      md: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 8,
          isInfinity: false,
        },
        h: {
          value: 3,
          isInfinity: false,
        },
      },
      xl: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 12,
          isInfinity: false,
        },
        h: {
          value: 2,
          isInfinity: false,
        },
      },
    },
  },

  {
    _id: "5f9e9b6b9c6b4c0017f3b3b5",
    widgetID: "customerDataTableNested",
    widgetType: "DATA_TABLE",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    positioning: {
      i: "customerDataTableNested",
      xs: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 4,
          isInfinity: false,
        },
        h: {
          value: 3,
          isInfinity: false,
        },
      },
      md: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 8,
          isInfinity: false,
        },
        h: {
          value: 3,
          isInfinity: false,
        },
      },
      xl: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 12,
          isInfinity: false,
        },
        h: {
          value: 2,
          isInfinity: false,
        },
      },
    },
    parentID: "customerTableWrapper",
  },

  {
    _id: "5f9e9b6b9c6b4c0017f3b399",
    widgetID: "customerDataTableNested2",
    widgetType: "DATA_TABLE",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    parentID: "customerTableWrapper",
    positioning: {
      i: "customerDataTableNested2",
      xs: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 4,
          isInfinity: false,
        },
        h: {
          value: 3,
          isInfinity: false,
        },
      },
      md: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 8,
          isInfinity: false,
        },
        h: {
          value: 3,
          isInfinity: false,
        },
      },
      xl: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 12,
          isInfinity: false,
        },
        h: {
          value: 2,
          isInfinity: false,
        },
      },
    },
  },

  {
    _id: "5f9e9b6b9crb4c0017f3b399",
    widgetID: "customerDataTableNestedInNested",
    widgetType: "DATA_TABLE",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    parentID: "customerDataTableNested2",
    positioning: {
      i: "customerDataTableNestedInNested",
      xs: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 4,
          isInfinity: false,
        },
        h: {
          value: 3,
          isInfinity: false,
        },
      },
      md: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 8,
          isInfinity: false,
        },
        h: {
          value: 3,
          isInfinity: false,
        },
      },
      xl: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 12,
          isInfinity: false,
        },
        h: {
          value: 2,
          isInfinity: false,
        },
      },
    },
  },

  {
    _id: "5f9e9b6b9c6b4c0017ffb399",
    widgetID: "customerDataTableRoot",
    widgetType: "DATA_TABLE",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    positioning: {
      i: "customerDataTableRoot",
      xs: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 4,
          isInfinity: false,
        },
        h: {
          value: 3,
          isInfinity: false,
        },
      },
      md: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 8,
          isInfinity: false,
        },
        h: {
          value: 3,
          isInfinity: false,
        },
      },
      xl: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 12,
          isInfinity: false,
        },
        h: {
          value: 2,
          isInfinity: false,
        },
      },
    },
  },
];

export const EXAMPLE_DATA_EXPORTED: Widget[] = [
  {
    _id: "5f9e9b6b9c6b4c0017f3b3a1",
    widgetID: "customerTableWrapper",
    widgetType: "WIDGET_WRAPPER",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    positioning: {
      i: "customerTableWrapper",
      xs: {
        x: { value: 0, isInfinity: false },
        y: { value: 1, isInfinity: false },
        w: { value: 7, isInfinity: false },
        h: { value: 7, isInfinity: false },
      },
      md: {
        x: { value: 0, isInfinity: false },
        y: { value: 0, isInfinity: false },
        w: { value: 8, isInfinity: false },
        h: { value: 3, isInfinity: false },
      },
      xl: {
        x: { value: 0, isInfinity: false },
        y: { value: 0, isInfinity: false },
        w: { value: 12, isInfinity: false },
        h: { value: 2, isInfinity: false },
      },
    },
  },
  {
    _id: "5f9e9b6b9c6b4c0017f3b3b5",
    widgetID: "customerDataTableNested",
    widgetType: "DATA_TABLE",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    positioning: {
      i: "customerDataTableNested",
      xs: {
        x: { value: 0, isInfinity: false },
        y: { value: 0, isInfinity: false },
        w: { value: 4, isInfinity: false },
        h: { value: 3, isInfinity: false },
      },
      md: {
        x: { value: 0, isInfinity: false },
        y: { value: 1, isInfinity: false },
        w: { value: 12, isInfinity: false },
        h: { value: 10, isInfinity: false },
      },
      xl: {
        x: { value: 0, isInfinity: false },
        y: { value: 0, isInfinity: false },
        w: { value: 12, isInfinity: false },
        h: { value: 2, isInfinity: false },
      },
    },
    parentID: "customerTableWrapper",
  },
  {
    _id: "5f9e9b6b9c6b4c0017f3b399",
    widgetID: "customerDataTableNested2",
    widgetType: "DATA_TABLE",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    parentID: "customerTableWrapper",
    positioning: {
      i: "customerDataTableNested2",
      xs: {
        x: { value: 0, isInfinity: false },
        y: { value: 0, isInfinity: false },
        w: { value: 4, isInfinity: false },
        h: { value: 3, isInfinity: false },
      },
      md: {
        x: { value: 15, isInfinity: false },
        y: { value: 1, isInfinity: false },
        w: { value: 8, isInfinity: false },
        h: { value: 10, isInfinity: false },
      },
      xl: {
        x: { value: 0, isInfinity: false },
        y: { value: 0, isInfinity: false },
        w: { value: 12, isInfinity: false },
        h: { value: 2, isInfinity: false },
      },
    },
  },
  {
    _id: "5f9e9b6b9crb4c0017f3b399",
    widgetID: "customerDataTableNestedInNested",
    widgetType: "DATA_TABLE",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    parentID: "customerDataTableNested2",
    positioning: {
      i: "customerDataTableNestedInNested",
      xs: {
        x: { value: 4, isInfinity: false },
        y: { value: 1, isInfinity: false },
        w: { value: 8, isInfinity: false },
        h: { value: 7, isInfinity: false },
      },
      md: {
        x: { value: 0, isInfinity: false },
        y: { value: 0, isInfinity: false },
        w: { value: 8, isInfinity: false },
        h: { value: 3, isInfinity: false },
      },
      xl: {
        x: { value: 0, isInfinity: false },
        y: { value: 0, isInfinity: false },
        w: { value: 12, isInfinity: false },
        h: { value: 2, isInfinity: false },
      },
    },
  },
  {
    _id: "5f9e9b6b9c6b4c0017ffb399",
    widgetID: "customerDataTableRoot",
    widgetType: "DATA_TABLE",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    positioning: {
      i: "customerDataTableRoot",
      xs: {
        x: { value: 0, isInfinity: false },
        y: { value: 9, isInfinity: false },
        w: { value: 7, isInfinity: false },
        h: { value: 12, isInfinity: false },
      },
      md: {
        x: { value: 0, isInfinity: false },
        y: { value: 0, isInfinity: false },
        w: { value: 8, isInfinity: false },
        h: { value: 3, isInfinity: false },
      },
      xl: {
        x: { value: 0, isInfinity: false },
        y: { value: 0, isInfinity: false },
        w: { value: 12, isInfinity: false },
        h: { value: 2, isInfinity: false },
      },
    },
  },
];
