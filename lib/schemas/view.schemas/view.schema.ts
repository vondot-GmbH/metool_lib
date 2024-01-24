import { Widget_OLD } from "../widget.schemas/widget.schema";

export interface View_old {
  name: string;
  widgets: Widget_OLD[];
}

export interface View {
  _id?: string;
  name: string;
}
