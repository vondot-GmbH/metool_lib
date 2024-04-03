import { makeAutoObservable } from "mobx";
import RootStore from "./root.store";
import {
  NavigationActionType,
  NavigationParams,
} from "../globals/interfaces/navigation.interface";
import { StateSelector } from "./state.store";

class NavigationStore {
  private stores: RootStore;

  // stores the navigation history
  private _navigationHistory: NavigationParams[] = [];

  // Index to keep track of the current position in the navigation history.
  private _navigationHistoryIndex: number = -1;

  // / Flag to determine if the current navigation is a result of going back or forward.
  private _isNavigatingBackOrForward: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.stores = rootStore;
  }

  // main method to handle navigation. It uses the provided navigation parameters to navigate to a specific view or page.
  navigate = async (navigationParams: NavigationParams): Promise<void> => {
    const targetID = navigationParams.targetID?.trim() ?? null;
    // optionally extracts and trims the view ID, if a view ID is provided
    const viewID = navigationParams.params?.viewID?.trim() ?? null;

    if (targetID == null) return;

    // handle the navigation based on the action type
    if (navigationParams.actionType === NavigationActionType.VIEW) {
      await this.handleNavigateToView(targetID);
    } else if (navigationParams.actionType === NavigationActionType.PAGE) {
      await this.handleNavigateToPage(targetID, viewID);
    }

    // update the current navigation states
    this.initializeCurrentNavigationStates(navigationParams);

    // updates the navigation history unless navigating back or forward.
    if (!this._isNavigatingBackOrForward) {
      this.updateNavigationHistory(navigationParams);
    }

    // resets the back/forward navigation flag.
    this._isNavigatingBackOrForward = false;
  };

  // method to navigate back in the navigation history.
  goBack = async (): Promise<void> => {
    if (this._navigationHistoryIndex > 0) {
      this._isNavigatingBackOrForward = true;
      this._navigationHistoryIndex--;
      const params = this._navigationHistory[this._navigationHistoryIndex];
      await this.navigate(params);
    }
  };

  // method to navigate forward in the navigation history.
  goForward = async (): Promise<void> => {
    if (this._navigationHistoryIndex < this._navigationHistory.length - 1) {
      this._isNavigatingBackOrForward = true;
      this._navigationHistoryIndex++;
      const params = this._navigationHistory[this._navigationHistoryIndex];
      await this.navigate(params);
    }
  };

  private handleNavigateToView = async (viewId: string): Promise<void> => {
    await this.stores.viewStore.intializeView(viewId);
    this.stores.pageStore.setCurrentViewIdToRender(viewId);
  };

  private handleNavigateToPage = async (
    pageId: string,
    viewID?: string
  ): Promise<void> => {
    await this.stores.pageStore.setAndFetchPageToRender(pageId);

    if (viewID != null) {
      await this.stores.viewStore.intializeView(viewID);
      this.stores.pageStore.setCurrentViewIdToRender(viewID);
    } else {
      const defaultViewId =
        this.stores.pageStore.currentPageToRender?.views?.find(
          (view) => view.defaultView
        )?.viewID;
      if (defaultViewId) {
        await this.stores.viewStore.intializeView(defaultViewId);
        this.stores.pageStore.setCurrentViewIdToRender(defaultViewId);
      }
    }
  };

  // method to update the navigation history with new parameters.
  private updateNavigationHistory(navigationParams: NavigationParams): void {
    this._navigationHistory = this._navigationHistory.slice(
      0,
      this._navigationHistoryIndex + 1
    );

    // Adds the new navigation parameters to the history.
    this._navigationHistory.push(navigationParams);

    this._navigationHistoryIndex = this._navigationHistory.length - 1;
  }

  private initializeCurrentNavigationStates = (
    navigationParams: NavigationParams
  ): void => {
    const selector =
      navigationParams.actionType === NavigationActionType.VIEW
        ? StateSelector.VIEWS
        : StateSelector.PAGES;

    const identifierID =
      selector === StateSelector.VIEWS ? "currentView" : "currentPage";

    Object.entries(navigationParams).forEach(([key, value]) => {
      if (key !== "actionType") {
        this.stores.stateStore.setStateValue(
          selector,
          identifierID,
          key,
          value
        );
      }
    });
  };
}

export default NavigationStore;
