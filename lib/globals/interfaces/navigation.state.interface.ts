import { Page } from "../../schemas/page.schemas/page.schema";
import { View } from "../../schemas/view.schemas/view.schema";

export interface BaseNavigationState {
  // isLoading: boolean;  // TODO
  targetID: string | null;
  params?: Record<string, any>;
}

export interface CurrentPageState extends BaseNavigationState {
  details: Page;
}

export interface CurrentViewState extends BaseNavigationState {
  details: View;
}
