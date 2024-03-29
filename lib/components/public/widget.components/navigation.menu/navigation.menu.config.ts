import { WidgetConfig } from "../../../../globals/interfaces/config.interface";
import NavigationMenuWidgetIcon from "./navigation.svg";
import navigationMenuComponent from "./navigation.menu.component/navigation.menu.component";
import navigationMenuWidgetOptionSidebar from "./sidebar.component/navigation.menu.widget.option.sidebar.component";

export const NavigationMenuWidgetConfig: WidgetConfig = {
  name: "Navigation Menu",
  type: "NAVIGATION_MENU_WIDGET",
  component: navigationMenuComponent,
  sidebarComponent: navigationMenuWidgetOptionSidebar,
  icon: NavigationMenuWidgetIcon,
  canHaveChildren: false,
};
