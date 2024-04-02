import { WidgetConfig } from "../../../../globals/interfaces/config.interface";
import NavigationMenuWidgetIcon from "./navigation.svg";
import NavigationMenu from "./navigation.menu.component/navigation.menu.component";
import NavigationMenuWidgetSidebar from "./sidebar.component/navigation.menu.widget.option.sidebar.component";

export const NavigationMenuWidgetConfig: WidgetConfig = {
  name: "navigation menu",
  type: "NAVIGATION_MENU_WIDGET",
  component: NavigationMenu,
  sidebarComponent: NavigationMenuWidgetSidebar,
  icon: NavigationMenuWidgetIcon,
  canHaveChildren: false,
};
