import { makeAutoObservable } from "mobx";
import RootStore from "./root.store";
import { CoreRestQueryType } from "../schemas/query.schemas/query.schema";
import { queryExecutor } from "../provider/http/http.rest.query.client";
import { getUniqueID } from "../globals/helpers/global.helper";
import { Page } from "../schemas/page.schemas/page.schema";

class PageStore {
  private _currentPageToRender: Page | undefined;
  private _currentViewToRenderID: string | undefined;

  private _pages: Map<string, Page> = new Map();

  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  //! Setter

  setAndFetchPageToRender = async (pageID: string): Promise<void> => {
    const page = await this.fetchAndSavePageById(pageID);

    if (!page) return;

    // find the default view of the page and set it as the current view to render
    const defaultViewId =
      page.views.find((view) => view.defaultView)?.viewID ||
      page.views[0]?.viewID;
    this.setCurrentViewIdToRender(defaultViewId);

    const viewIDs = page.views.map((view) => view.viewID);
    await this.stores.viewStore.fetchAndSaveViews(viewIDs);

    if (!page) return;
  };

  setCurrentPageToRender = (page: Page): void => {
    this._currentPageToRender = page;
  };

  setPages = (pages: Page[]): void => {
    pages.forEach((page) => {
      if (page.pageID == null) return;
      this._pages.set(page.pageID, page);
    });
  };

  setCurrentViewIdToRender = (viewID: string) => {
    this.stores.editorStore.setSelectWidget(undefined);
    this._currentViewToRenderID = viewID;
  };

  get currentViewIdToRender(): string | undefined {
    return this._currentViewToRenderID;
  }

  //! Getter
  get currentPageToRender(): Page | undefined {
    return this._currentPageToRender;
  }

  get pages(): Page[] {
    return Array.from(this._pages.values());
  }

  getPage(pageID: string): Page | undefined {
    return this._pages.get(pageID);
  }
  //! Methods

  createInitialPage(): Page {
    const page = {
      pageID: "new",
      name: "New Page",
    } as Page;

    this.setCurrentPageToRender(page);

    return page;
  }

  async fetchAndSavePageById(pageID: string): Promise<Page | undefined> {
    let page = this._pages.get(pageID);

    if (page == null) {
      const pageQuery = this.stores.queryStore.getQuery(
        CoreRestQueryType.GET_PAGE_BY_ID
      );

      if (pageQuery == null || pageID == null) return;

      page = await queryExecutor.executeRestQuery(
        pageQuery,
        {
          pageID: pageID,
        },
        this.stores.resourceStore
      );

      if (page == null) return;
    }

    this.setCurrentPageToRender(page);

    return page;
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

    this.setCurrentPageToRender(response);
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

    this.setCurrentPageToRender(response);
  }

  async fetchAllPagesAndSave(): Promise<void> {
    const pageQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.GET_PAGES
    );

    if (pageQuery == null) return;

    const response = await queryExecutor.executeRestQuery(
      pageQuery,
      {},
      this.stores.resourceStore
    );

    if (response == null) return;

    this.setPages(response);
  }

  async addViewToCurrentPageAndSave(viewID: string): Promise<void> {
    const view = this.stores.viewStore.getView(viewID);
    const page = this._currentPageToRender;

    if (view == null || page == null) return;

    const defaultView = page.views.find((view) => view.defaultView);

    const updatedPage = {
      ...page,
      views: [
        ...page.views,
        {
          viewID: view.viewID,
          defaultView: defaultView == null ? true : false,
        },
      ],
    } as Page;

    this.updateAndSavePage(updatedPage);
  }
}

export default PageStore;
