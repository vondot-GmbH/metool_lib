import { Widget } from "../widget.schemas/widget.schema";

export interface View_old {
  name: string;
  widgets: Widget[];
}

export interface View {
  _id?: string;
  name: string;
}
