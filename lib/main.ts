export { default as RenderView } from "./components/private/editor.components/render.components/render.view.component/render.view.conponent";
export { default as CanvasEditor } from "./components/public/canvas.editor.component/canvas.editor.component";

// widgets
export { TableWidgetConfig as TableWidget } from "./components/public/widget.components/table.widget/table.widget.config";
export { ContainerWidgetConfig as ContainerWidget } from "./components/public/widget.components/container.widget/container.widget.config";
export { TextWidgetConfig as TextWidget } from "./components/public/widget.components/text.widget/text.widget.config";

// config
export { default as Init } from "./config/init";

// types
export type {
  WidgetConfig,
  LayoutConfig,
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
