import { Widget } from "../lib/schemas/widget.schemas/widget.schema";

export const EXAMPLE_WIDGETS_DATA_RENAMED: Widget[] = [
  {
    _id: "5f9e9b6b9c6b4c0017f3b3a1",
    widgetID: "customerTableWrapper",
    widgetType: "CONTAINER_WIDGET",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    positioning: {
      i: "customerTableWrapper",
      small: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 12,
          isInfinity: false,
        },
        w: {
          value: 8,
          isInfinity: false,
        },
        h: {
          value: 27,
          isInfinity: false,
        },
      },
      medium: {
        x: {
          value: 1,
          isInfinity: false,
        },
        y: {
          value: 27,
          isInfinity: false,
        },
        w: {
          value: 10,
          isInfinity: false,
        },
        h: {
          value: 31,
          isInfinity: false,
        },
      },
      large: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 19,
          isInfinity: false,
        },
        w: {
          value: 24,
          isInfinity: false,
        },
        h: {
          value: 25,
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
      small: {
        x: {
          value: 1,
          isInfinity: false,
        },
        y: {
          value: 12,
          isInfinity: false,
        },
        w: {
          value: 14,
          isInfinity: false,
        },
        h: {
          value: 13,
          isInfinity: false,
        },
      },
      medium: {
        x: {
          value: 0,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 14,
          isInfinity: false,
        },
        h: {
          value: 17,
          isInfinity: false,
        },
      },
      large: {
        x: {
          value: 1,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 46,
          isInfinity: false,
        },
        h: {
          value: 9,
          isInfinity: false,
        },
      },
    },
    parentID: "customerTableWrapper",
  },

  {
    _id: "5f9e9b6b9c6b4c0017f3b399",
    widgetID: "customerDataTableNested2",
    widgetType: "TableWidget",
    view: "5f9e9b6b9I6b4c3017f3b3a0",
    parentID: "customerTableWrapper",
    positioning: {
      i: "customerDataTableNested2",
      small: {
        x: {
          value: 1,
          isInfinity: false,
        },
        y: {
          value: 25,
          isInfinity: false,
        },
        w: {
          value: 14,
          isInfinity: false,
        },
        h: {
          value: 12,
          isInfinity: false,
        },
      },
      medium: {
        x: {
          value: 15,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 9,
          isInfinity: false,
        },
        h: {
          value: 17,
          isInfinity: false,
        },
      },
      large: {
        x: {
          value: 1,
          isInfinity: false,
        },
        y: {
          value: 9,
          isInfinity: false,
        },
        w: {
          value: 46,
          isInfinity: false,
        },
        h: {
          value: 14,
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
      small: {
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
          value: 12,
          isInfinity: false,
        },
      },
      medium: {
        x: {
          value: 1,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 10,
          isInfinity: false,
        },
        h: {
          value: 27,
          isInfinity: false,
        },
      },
      large: {
        x: {
          value: 1,
          isInfinity: false,
        },
        y: {
          value: 0,
          isInfinity: false,
        },
        w: {
          value: 22,
          isInfinity: false,
        },
        h: {
          value: 19,
          isInfinity: false,
        },
      },
    },
  },
];
