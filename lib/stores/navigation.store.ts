import { makeAutoObservable } from "mobx";
import RootStore from "./root.store";

class NavigationStore {
  private stores: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.stores = rootStore;
  }

  navigateToView = async (viewId: string): Promise<void> => {
    await this.stores.viewStore.intializeView(viewId);
    this.stores.pageStore.setCurrentViewIdToRender(viewId);
  };

  navigateToPage = async (pageId: string, viewId?: string): Promise<void> => {
    await this.stores.pageStore.setAndFetchPageToRender(pageId);
    if (viewId) {
      await this.stores.viewStore.intializeView(viewId);
      this.stores.pageStore.setCurrentViewIdToRender(viewId);
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
}

export default NavigationStore;
