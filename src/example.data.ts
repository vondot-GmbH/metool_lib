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
    options: {
      columns: [
        {
          columnID: "5f9e9b6b9c6b4c0017f3b399",
          source: "id",
          label: "#",
          textAlign: "center",
          resizable: false,
        },
        {
          columnID: "5f9e9b6b9c6b4c00diffb399",
          source: "name",
          label: "Name",
          textAlign: "left",
          resizable: false,
        },
        {
          columnID: "5f9e9b6b9c994c00diffb399",
          source: "age",
          label: "Age",
          textAlign: "left",
          resizable: false,
        },
        {
          columnID: "5f9e994b9c6b4c00diffb399",
          source: "email",
          label: "email",
          textAlign: "left",
          resizable: false,
        },
      ],
      headerBackgroundColor: "#cfcfcf",
      rowHoverColor: "#cfcfcf",
      borderBottomColor: "#cfcfcf",
      rowBackgroundColor: "transparent",
    },
  },

  {
    _id: "5f9e9b6b9c6b4c0017f3b399",
    widgetID: "customerDataTableNested2",
    widgetType: "DATA_TABLE",
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
          value: 1,
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
    options: {
      columns: [
        {
          columnID: "5f9e9b6b9c6b4c0017f3b399",
          source: "id",
          label: "#",
          textAlign: "center",
          resizable: false,
        },
        {
          columnID: "5f9e9b6b9c6b4c00diffb399",
          source: "name",
          label: "Name",
          textAlign: "left",
          resizable: false,
        },
        {
          columnID: "5f9e994b9c6b4c00diffb399",
          source: "email",
          label: "email",
          textAlign: "left",
          resizable: false,
        },
      ],
      headerBackgroundColor: "#cfcfcf",
      rowHoverColor: "#cfcfcf",
      borderBottomColor: "#cfcfcf",
      rowBackgroundColor: "transparent",
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
    options: {
      columns: [
        {
          columnID: "5f9e9b6b9c6b4c0017f3b399",
          source: "id",
          label: "#",
          textAlign: "center",
          resizable: false,
        },
        {
          columnID: "5f9e9b6b9c6b4c00diffb399",
          source: "name",
          label: "Name",
          textAlign: "left",
          resizable: false,
        },
        {
          columnID: "5f9e9b6b9c994c00diffb399",
          source: "age",
          label: "Age",
          textAlign: "left",
          resizable: false,
        },
        {
          columnID: "5f9e994b9c6b4c00diffb399",
          source: "email",
          label: "email",
          textAlign: "left",
          resizable: false,
        },
      ],
      headerBackgroundColor: "#cfcfcf",
      rowHoverColor: "#cfcfcf",
      borderBottomColor: "#cfcfcf",
      rowBackgroundColor: "transparent",
    },
  },
];
