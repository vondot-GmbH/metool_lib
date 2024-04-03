import { NavigationParams } from "../../../../../globals/interfaces/navigation.interface";
import { CSSStyles } from "../../../../../globals/interfaces/widget.option.interface";

export interface NavigationMenuOptions {
  items: NavigationMenuItem[];
  orientation: "horizontal" | "vertical";
  navigationMenuItemWrapperStyles?: CSSStyles;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  navigationParams: NavigationParams;
  naviationMenuItemStyles?: CSSStyles;
}
