export interface NavigationParams {
  targetID: string;
  actionType: NavigationActionType;
  params?: Record<string, any>;
}

export enum NavigationActionType {
  VIEW = "navigate_to_view",
  PAGE = "navigate_to_page",
}
