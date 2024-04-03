export interface NavigationParams {
  targetID: string;
  actionType: NavigationActionType;
  params?: Record<string, any>;
}

export enum NavigationActionType {
  NAV_TO_VIEW = "NAV_TO_VIEW",
  NAV_TO_PAGE = "NAV_TO_PAGE",
}
