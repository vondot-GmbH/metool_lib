export interface NavigationMenuOptions {
  items: NavigationMenuItem[];
  orientation: "horizontal" | "vertical";
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  actionType: "navigate_to_view" | "navigate_to_page";
  targetID: string;
}
