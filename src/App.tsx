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
import ViewStore from "../lib/stores/view.store";
import { Provider as MobxProvider } from "mobx-react";
import WidgetStore from "../lib/stores/widget.store";
import { EXAMPLE_WIDGETS_DATA_RENAMED } from "./example.data";
import ChangeRecordStore from "../lib/stores/change.record.store";
import { TableWidget } from "../lib/main";
import Gleap from "Gleap";
import EditorStore from "../lib/stores/editor.store";
import { faHardDrive } from "@fortawesome/free-regular-svg-icons";
import StateStore from "../lib/stores/state.store";
import QueryStore from "../lib/stores/query.store";
import ResourceStore from "../lib/stores/resource.store";

// only for testing purposes

const coreResources: CoreResource = {
  _id: "baseResource",
  title: "base Resource",
  type: DataSourceType.REST_API,
  baseUrl: "http://localhost:3001/api/admin",
  core: true,
  defaultHeaders: [
    { key: "Content-Type", value: "application/json" },
    { key: "Accept", value: "application/json" },
  ],
  description: "This is the base resource",
};

const coreQueryConfig = {
  createQuery: {
    _id: "createQuery",
    title: "Create Query",
    resource: coreResources,
    type: DataSourceType.REST_API,
    method: "POST",
    url: "/queries",
    params: "",
    body: {},
    core: true,
  },
  deleteQuery: {
    _id: "deleteQuery",
    title: "Delete Query",
    resource: coreResources,
    type: DataSourceType.REST_API,
    method: "DELETE",
    url: "/queries",
    params: "",
    core: true,
  },
  getQueries: {
    _id: "getQueries",
    title: "Get Queries",
    resource: coreResources,
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/queries",
    params: "",
    core: true,
  },
  getQueriesById: {
    _id: "getQueriesById",
    title: "Get Query by ID",
    resource: coreResources,
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/queries/:queryID",
    params: "",
    body: {},
    core: true,
  },
  updateQuery: {
    _id: "updateQuery",
    title: "Update Query",
    resource: coreResources,
    type: DataSourceType.REST_API,
    method: "PUT",
    url: "/queries",
    params: "",
    body: {},
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

const viewStore = new ViewStore();
const changeRecordStore = new ChangeRecordStore();

const resourceStore = new ResourceStore(changeRecordStore);
const editorStore = new EditorStore();
const stateStore = new StateStore();
const queryStore = new QueryStore(stateStore);
const widgetStore = new WidgetStore(changeRecordStore, queryStore);

const stores = {
  viewStore,
  widgetStore,
  changeRecordStore,
  editorStore,
  stateStore,
  queryStore,
  resourceStore,
};

function App() {
  return (
    <MobxProvider {...stores}>
      <div className="main-container">
        <CanvasEditor
          // queries={QUERY_DATA} // TODO
          resources={[]}
          widgets={EXAMPLE_WIDGETS_DATA_RENAMED}
          onSaveChanges={(changes) => {
            console.log("changes: ", JSON.stringify(changes, null, 2));
          }}
        />
      </div>
    </MobxProvider>
  );
}

export default App;
