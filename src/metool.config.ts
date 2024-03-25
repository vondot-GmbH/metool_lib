import { CoreResource, CoreRestQuerConfig, DataSourceType } from "../lib/main";

export const coreResources: CoreResource = {
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

export const coreQueryConfig = {
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
    // params: [
    //   {
    //     key: "viewID",
    //     value: "{{viewID}}",
    //   },
    //   {
    //     key: "pageID",
    //     value: "{{pageID}}",
    //   },
    // ],
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

  getViews: {
    _id: "getViews",
    queryID: "getViews",
    title: "Get Views",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/views",
    core: true,
  },

  getViewById: {
    _id: "getViewById",
    queryID: "getViewById",
    title: "Get View by ID",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/views/:viewID",
    core: true,
  },

  deleteView: {
    _id: "deleteView",
    queryID: "deleteView",
    title: "Delete View",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "DELETE",
    url: "/views/:viewID",
    core: true,
  },

  updateView: {
    _id: "updateView",
    queryID: "updateView",
    title: "Update View",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "PUT",
    url: "/views/:viewID",
    core: true,
  },

  createView: {
    _id: "createView",
    queryID: "createView",
    title: "Create View",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "POST",
    url: "/views",
    core: true,
  },

  getPages: {
    _id: "getPages",
    queryID: "getPages",
    title: "Get Pages",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/pages",
    core: true,
  },

  getPageById: {
    _id: "getPageById",
    queryID: "getPageById",
    title: "Get Page by ID",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "GET",
    url: "/pages/:pageID",
    core: true,
  },

  createPage: {
    _id: "createPage",
    queryID: "createPage",
    title: "Create Page",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "POST",
    url: "/pages",
    core: true,
  },

  deletePage: {
    _id: "deletePage",
    queryID: "deletePage",
    title: "Delete Page",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "DELETE",
    url: "/pages/:pageID",
    core: true,
  },

  updatePage: {
    _id: "updatePage",
    queryID: "updatePage",
    title: "Update Page",
    resourceID: "baseResource",
    type: DataSourceType.REST_API,
    method: "PUT",
    url: "/pages/:pageID",
    core: true,
  },
} as CoreRestQuerConfig;
