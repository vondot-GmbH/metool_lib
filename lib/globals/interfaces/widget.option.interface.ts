import { ActionType, EventType } from "../enums/widget.enum";

export interface CSSStyles {
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  textAlign?: "left" | "center" | "right";
  borderRadius?: string;
  border?: string;
  minWidth?: string;
  maxWidth?: string;
  gap?: string;
}

export interface WidgetEvent {
  eventType: EventType;
  actions: EventAction[];
}

export interface EventAction {
  actionType: ActionType;
  payload: any;
}
