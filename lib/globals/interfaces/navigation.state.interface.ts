export interface BaseNavigationState {
  // isLoading: boolean;  // TODO
  params?: Record<string, any>;
}

export interface CurrentPageState extends BaseNavigationState {
  pageID: string | null;
}

export interface CurrentViewState extends BaseNavigationState {
  viewID: string | null;
}
