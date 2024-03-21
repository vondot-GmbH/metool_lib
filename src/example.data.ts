import { Widget } from "../lib/schemas/widget.schemas/widget.schema";

export const EXAMPLE_WIDGETS_DATA_RENAMED: Widget[] = [
  {
    _id: "5f9e9b6b9c6b4c0017ffb399",
    widgetID: "customerDataTableRoot",
    widgetType: "DATA_TABLE",
    viewID: "5f9e9b6b9I6b4c3017f3b3a0",
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
      data: "{{queries.getUsers.data}}",
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
          source: "username",
          label: "Username",
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
        {
          columnID: "5f9e994b9c6b4c00diffb399",
          source: "website",
          label: "website",
          textAlign: "left",
          resizable: false,
        },
      ],
      headerBackgroundColor: "#cfcfcf",
      rowHoverColor: "#cfcfcf",
      borderBottomColor: "#cfcfcf",
      rowBackgroundColor: "transparent",
      rowSelectionBackgroundColor: "#f7fafa",
      rowSelectionType: "single",
      tableCellPadding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
    },
  },

  {
    _id: "5f9e9b6b9c6b4c0017ffb399",
    widgetID: "textWidget1",
    widgetType: "TEXT_WIDGET",
    viewID: "5f9e9b6b9I6b4c3017f3b3a0",
    positioning: {
      i: "textWidget1",
      small: {
        x: {
          value: 1,
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
          value: 2,
          isInfinity: false,
        },
      },
      medium: {
        x: {
          value: 2,
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
          value: 2,
          isInfinity: false,
        },
      },
      large: {
        x: {
          value: 2,
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
          value: 2,
          isInfinity: false,
        },
      },
    },
    options: {
      textAlignment: "center",
      testOption: "test",
      data: "{{widgets.customerDataTableRoot.selectedSourceRow}}",
    },
  },
];
