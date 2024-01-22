import { Widget } from "../widget.schemas/widget.schema";

export interface View {
  name: string;
  widgets: Widget[];
}
