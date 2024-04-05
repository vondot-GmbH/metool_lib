import {
  CSSStyles,
  WidgetEvent,
} from "../../../../../globals/interfaces/widget.option.interface";

export interface NavigationMenuOptions {
  items: NavigationMenuItem[];
  orientation: "horizontal" | "vertical";
  navigationMenuItemWrapperStyles?: CSSStyles;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  events?: WidgetEvent[];
  naviationMenuItemStyles?: CSSStyles;
}
