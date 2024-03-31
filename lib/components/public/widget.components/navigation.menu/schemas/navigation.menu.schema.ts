import { CSSStyles } from "../../../../../globals/interfaces/widget.option.interface";

export interface NavigationMenuOptions {
  items: NavigationMenuItem[];
  orientation: "horizontal" | "vertical";
  navigationMenuItemWrapperStyles?: CSSStyles;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  actionType: "navigate_to_view" | "navigate_to_page";
  targetID: string;
  naviationMenuItemStyles?: CSSStyles;
}
