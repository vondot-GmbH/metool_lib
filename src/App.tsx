import "./App.css";
import {
  CanvasEditor,
  ContainerWidget,
  CoreResource,
  CoreRestQuerConfig,
  DataSourceType,
  Init,
  TextWidget,
} from "../lib/main";
import { Provider as MobxProvider } from "mobx-react";
import { TableWidget } from "../lib/main";
import Gleap from "Gleap";
import { faHardDrive } from "@fortawesome/free-regular-svg-icons";
import RootStore from "../lib/stores/root.store";

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
          Authorization: `Bearer lalalalallalalalall`,
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

Init({
  coreQueryConfig: coreQueryConfig,
  coreResources: [coreResources],
  widgets: [TableWidget, ContainerWidget, TextWidget],
  layoutConfig: {
    nested: {
      large: {
        cols: 48,
        rowHeight: 30,
        icon: faHardDrive,
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
        icon: faHardDrive,
        title: "Large",
        breakpoint: 1200,
      },
      medium: {
        cols: 12,
        rowHeight: 30,
        icon: faHardDrive,
        title: "Medium",
        breakpoint: 900,
      },
      small: {
        cols: 8,
        rowHeight: 30,
        icon: faHardDrive,
        title: "Small",
        breakpoint: 440,
      },
    },
  },
});

Gleap.initialize("YZ6N1CITLut6MeqEhbITgwBid7oB7nc6");

const rootStore = new RootStore();

function App() {
  return (
    <MobxProvider {...rootStore}>
      <div className="main-container">
        <CanvasEditor
          viewToRender="5f9e9b6b9I6b4c3017f3b3a0"
          // widgets={EXAMPLE_WIDGETS_DATA_RENAMED}
          onSaveChanges={(changes) => {
            console.log("changes: ", JSON.stringify(changes, null, 2));
          }}
        />
      </div>
    </MobxProvider>
  );
}

export default App;
