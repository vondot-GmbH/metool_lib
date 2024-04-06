import EditorStore from "./stores/editor.store";
import NavigationStore from "./stores/navigation.store";
import StateStore from "./stores/state.store";
import WidgetStore from "./stores/widget.store";

// public package copmonents
export { default as CanvasEditorPublic } from "./components/public/canvas.editor.component/canvas.editor.component";
export { default as RenderPage } from "./components/public/render.page.component/render.pagge.component";

// widgets
export { TableWidgetConfig as TableWidget } from "./components/public/widget.components/table.widget/table.widget.config";
export { ContainerWidgetConfig as ContainerWidget } from "./components/public/widget.components/container.widget/container.widget.config";
export { TextWidgetConfig as TextWidget } from "./components/public/widget.components/text.widget/text.widget.config";
export { NavigationMenuWidgetConfig as NavigationMenuWidget } from "./components/public/widget.components/navigation.menu/navigation.menu.config";

// page layouts
export { DashboardPageLayoutConfig as DashboardPageLayout } from "./components/public/page.layout.components/dashboard.page.layout/dashboard.page.layout.config";

// init
export { default as InitializeMetool } from "./config/init";

// types
export type {
  GridLayoutConfig,
  WidgetConfig,
  GridLayoutConfig as LayoutConfig,
} from "./globals/interfaces/config.interface";

export type {
  NavigationActionType,
  NavigationParams,
} from "./globals/interfaces/navigation.interface";

export type {
  Resource,
  CoreResource,
} from "./schemas/resource.schemas/resource.schema";

export type {
  Query,
  CoreRestQuerConfig,
} from "./schemas/query.schemas/query.schema";

export { DataSourceType } from "./schemas/resource.schemas/resource.schema";

export type { WidgetStore, NavigationStore, StateStore, EditorStore };
