import { makeAutoObservable } from "mobx";
import RootStore from "./root.store";
import { CoreRestQueryType } from "../schemas/query.schemas/query.schema";
import { queryExecutor } from "../provider/http/http.rest.query.client";
import { getUniqueID } from "../globals/helpers/global.helper";
import { Page } from "../schemas/page.schemas/page.schema";

class PageStore {
  private _currentSelectedPage: Page | undefined;

  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  //! Setter

  setCurrentSelectedPage = (page: Page): void => {
    this._currentSelectedPage = page;
  };

  //! Getter
  get currentSelectedPage(): Page | undefined {
    return this._currentSelectedPage;
  }

  //! Methods

  createInitialPage(): Page {
    const page = {
      pageID: "new",
      name: "New Page",
    } as Page;

    this.setCurrentSelectedPage(page);

    return page;
  }

  intializePage = async (pageID: string): Promise<void> => {
    return await this.fetchAndSavePageById(pageID);
  };

  async fetchAndSavePageById(pageID: string): Promise<void> {
    const pageQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.GET_PAGE_BY_ID
    );

    if (pageQuery == null || pageID == null) return;

    const response = await queryExecutor.executeRestQuery(
      pageQuery,
      {
        pageID: pageID,
      },
      this.stores.resourceStore
    );

    if (response == null) return;

    this.setCurrentSelectedPage(response);
  }

  async updateAndSavePage(page: Page): Promise<void> {
    const updateQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.UPDATE_PAGE
    );

    if (page == null || updateQuery == null) return;

    const preparedPage = {
      ...updateQuery,
      body: page,
    } as any;

    const response = await queryExecutor.executeRestQuery(
      preparedPage,
      { pageID: page.pageID },
      this.stores.resourceStore
    );

    if (response == null || response?.pageID == null) return;

    this.setCurrentSelectedPage(response);
  }

  async createAndSavePage(page: Page): Promise<void> {
    const createQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.CREATE_PAGE
    );

    const preparedPage = {
      ...createQuery,
      body: {
        ...page,
        pageID: getUniqueID(),
      },
    } as any;

    const response = await queryExecutor.executeRestQuery(
      preparedPage,
      {},
      this.stores.resourceStore
    );

    if (response == null || response?.pageID == null) return;

    this.setCurrentSelectedPage(response);
  }
}

export default PageStore;
