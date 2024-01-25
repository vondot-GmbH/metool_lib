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
      i: "293190ac-9768-40cd-8116-a1934be0fa56",
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
      i: "293190ac-9768-40cd-8116-a3944be0f8dasdf88",
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
      i: "293190ac-9768-40cd-8116-a3944be0f888",
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
      i: "293d190ac-d9768-40cdd-8116-a39d44be0f888",
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
      i: "293d190ac-d9768-40cdd-8116-da39d44be0df888",
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
