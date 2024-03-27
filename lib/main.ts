// public package copmonents
export { default as CanvasEditorPublic } from "./components/public/canvas.editor.component/canvas.editor.component";
export { default as RenderPage } from "./components/public/render.page.component/render.pagge.component";

// widgets
export { TableWidgetConfig as TableWidget } from "./components/public/widget.components/table.widget/table.widget.config";
export { ContainerWidgetConfig as ContainerWidget } from "./components/public/widget.components/container.widget/container.widget.config";
export { TextWidgetConfig as TextWidget } from "./components/public/widget.components/text.widget/text.widget.config";

// page layouts
export { DashboardPageLayoutConfig as DashboardPageLayout } from "./components/public/page.layout.components/dashboard.page.layout/dashboard.page.layout.config";

// init
export { default as InitializeMetool } from "./config/init";

// types
export type {
  WidgetConfig,
  GridLayoutConfig as LayoutConfig,
} from "./globals/interfaces/config.interface";

export type {
  Resource,
  CoreResource,
} from "./schemas/resource.schemas/resource.schema";
export type {
  Query,
  CoreRestQuerConfig,
} from "./schemas/query.schemas/query.schema";

export { DataSourceType } from "./schemas/resource.schemas/resource.schema";

// TODO check if this is needed
export { default as MetoolStoreProvider } from "./components/private/store.provider.component/store.provider.component";
