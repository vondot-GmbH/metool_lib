import "./App.css";
import {
  CanvasEditorPublic,
  ContainerWidget,
  CoreResource,
  CoreRestQuerConfig,
  DataSourceType,
  InitializeMetool,
  TextWidget,
} from "../lib/main";
import { TableWidget } from "../lib/main";
import Gleap from "Gleap";
import {
  faHandPointer,
  faHardDrive,
} from "@fortawesome/free-regular-svg-icons";
import {
  faDisplay,
  faMobileNotch,
  faTabletScreenButton,
} from "@fortawesome/pro-regular-svg-icons";

// only for testing purposes

const coreResources: CoreResource = {
  _id: "baseResource",
  resourceID: "baseResource",
  title: "base Resource",
  type: DataSourceType.REST_API,
  baseUrl: "http://localhost:3001/api/admin",
  core: true,
  defaultHeaders: [
    { key: "Content-Type", value: "application/json" },
    { key: "Accept", value: "application/json" },
  ],
  description: "This is the base resource",
  requestInterceptors: [
    {
      fulfilled: (config) => {
        config.headers = {
          ...config.headers,
          gymo_resource: "65f186afe2bc6bf2f9f5cb9b",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWYxODZhMWUyYmM2YmYyZjlmNWNiN2UiLCJlbWFpbCI6InBldGVyQHZvbmRvdC5hdCIsImlhdCI6MTcxMDY4MzkxOCwiZXhwIjoxNzEwNzcwMzE4fQ.yKezyCTy-lLQI5_ViqZLJFRvqYQMHf3AfmVl1og0EyQ`,
        };
        return config;
      },
    },
  ],
};

const coreQueryConfig = {
  createQuery: {
    _id: "createQuery",
    queryID: "createQuery",
    title: "Create Query",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "POST",
    url: "/queries",
    core: true,
  },
  deleteQuery: {
    _id: "deleteQuery",
    queryID: "deleteQuery",
    resourceID: "baseResource",
    title: "Delete Query",
    type: DataSourceType.REST_API,
    method: "DELETE",
    url: "/queries",
    core: true,
  },
  getQueries: {
    _id: "getQueries",
    queryID: "getQueries",
    title: "Get Queries",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/queries",
    core: true,
  },
  getQueriesById: {
    _id: "getQueriesById",
    queryID: "getQueriesById",
    resourceID: "baseResource",
    title: "Get Query by ID",
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/queries/:queryID",
    core: true,
  },
  updateQuery: {
    _id: "updateQuery",
    queryID: "updateQuery",
    resourceID: "baseResource",
    title: "Update Query",
    type: DataSourceType.REST_API,
    method: "PUT",
    url: "/queries/:queryID",
    core: true,
  },

  getResources: {
    _id: "getResources",
    queryID: "getResources",
    resourceID: "baseResource",
    title: "Get Resources",
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/resources",
    core: true,
  },

  getResourcesById: {
    _id: "getResourcesById",
    queryID: "getResourcesById",
    resourceID: "baseResource",
    title: "Get Resource by ID",
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/resources/:resourceID",
    core: true,
  },

  updateResource: {
    _id: "updateResource",
    queryID: "updateResource",
    resourceID: "baseResource",
    title: "Update Resource",
    type: DataSourceType.REST_API,
    method: "PUT",
    url: "/resources/:resourceID",
    core: true,
  },

  deleteResource: {
    _id: "deleteResource",
    queryID: "deleteResource",
    title: "Delete Resource",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "DELETE",
    url: "/resources",
    core: true,
  },

  createResource: {
    _id: "createResource",
    queryID: "createResource",
    title: "Create Resource",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "POST",
    url: "/resources",
    core: true,
  },

  getWidgets: {
    _id: "getWidgets",
    queryID: "getWidgets",
    title: "Get Widgets",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/widgets",
    core: true,
    params: [
      {
        key: "viewID",
        value: "{{viewID}}",
      },
    ],
  },

  createWidget: {
    _id: "createWidget",
    queryID: "createWidget",
    title: "Create Widget",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "POST",
    url: "/widgets",
    core: true,
  },

  deleteWidget: {
    _id: "deleteWidget",
    queryID: "deleteWidget",
    title: "Delete Widget",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "DELETE",
    url: "/widgets/:widgetID",
    core: true,
  },

  getWidgetsById: {
    _id: "getWidgetsById",
    queryID: "getWidgetsById",
    title: "Get Widget by ID",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/widgets/:widgetID",
    core: true,
  },

  updateWidget: {
    _id: "updateWidget",
    queryID: "updateWidget",
    title: "Update Widget",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "PUT",
    url: "/widgets/:widgetID",
    core: true,
  },
} as CoreRestQuerConfig;

InitializeMetool({
  coreQueryConfig: coreQueryConfig,
  coreResources: [coreResources],
  widgets: [TableWidget, ContainerWidget, TextWidget],
  layoutConfig: {
    nested: {
      large: {
        cols: 48,
        rowHeight: 30,
        icon: faHandPointer,
        title: "Large",
        breakpoint: 1200,
      },
      medium: {
        cols: 24,
        rowHeight: 30,
        icon: faHardDrive,
        title: "Medium",
        breakpoint: 900,
      },
      small: {
        cols: 16,
        rowHeight: 30,
        icon: faHardDrive,
        title: "Small",
        breakpoint: 440,
      },
    },
    root: {
      large: {
        cols: 24,
        rowHeight: 30,
        icon: faDisplay,
        title: "Large",
        breakpoint: 1200,
      },
      medium: {
        cols: 12,
        rowHeight: 30,
        icon: faTabletScreenButton,
        title: "Medium",
        breakpoint: 900,
      },
      small: {
        cols: 8,
        rowHeight: 30,
        icon: faMobileNotch,
        title: "Small",
        breakpoint: 440,
      },
    },
  },
});

Gleap.initialize("YZ6N1CITLut6MeqEhbITgwBid7oB7nc6");

function App() {
  return (
    <div className="main-container">
      <CanvasEditorPublic viewToRender="5f9e9b6b9I6b4c3017f3b3a0" />
    </div>
  );
}

export default App;
