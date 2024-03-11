import ConfigProvider from "../config/config.provider";
import {
  MixedResourceMap,
  CoreResource,
  Resource,
  MixedResource,
} from "../schemas/resource.schemas/resource.schema";
import { makeAutoObservable } from "mobx";
import { CoreRestQueryType } from "../schemas/query.schemas/query.schema";
import { queryExecutor } from "../provider/http/http.rest.query.client";
import RootStore from "./root.store";
import { getUniqueID } from "../globals/helpers/global.helper";

class ResourceStore {
  private _resources: MixedResourceMap = new Map();
  private _currentSelectedResource: Resource | null = null;

  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  //! Setter

  async intializeResources(resources?: Resource[]): Promise<Resource[]> {
    const configProvider = ConfigProvider.getInstance();
    const coreResources = configProvider.getCoreResources();

    // set all provided resources
    if (resources != null) this.setResources(resources);

    // set all core resources from the config provider
    this.setResources(coreResources);

    return this.resources;
  }

  private setResources(resources: Resource[] | CoreResource[]): void {
    resources.forEach((resource: any) => {
      this._resources.set(resource?.resourceID, resource);
    });
  }

  setCurrentSelectedResource(resource: Resource): void {
    this._currentSelectedResource = resource;
  }

  //! Getter

  get resources(): MixedResource[] {
    return Array.from(this._resources.values());
  }

  getResource(resourceID: string): MixedResource | undefined {
    return this._resources.get(resourceID);
  }

  get currentSelectedResource(): Resource | null {
    return this._currentSelectedResource;
  }

  //! Methods

  createInitialResource(): Resource {
    const resource = {
      resourceID: "new",
      title: "New Resource",
    } as Resource;

    this.setCurrentSelectedResource(resource);

    return resource;
  }

  async fetchAllResourcesAndSave(): Promise<void> {
    const query = this.stores.queryStore.getQuery(
      CoreRestQueryType.GET_RESOURCES
    );

    if (query == null) return;

    const response = await queryExecutor.executeRestQuery(
      query,
      {},
      this.stores.resourceStore
    );

    if (response == null) return;

    this.setResources(response);
  }

  async createAndSaveResource(resource: Resource): Promise<void> {
    const createQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.CREATE_RESOURCE
    );

    const preparedQuery = {
      ...createQuery,
      body: {
        ...resource,
        resourceID: getUniqueID(),
      },
    } as any;

    const response = await queryExecutor.executeRestQuery(
      preparedQuery,
      {},
      this.stores.resourceStore
    );

    if (response == null || response?.resourceID == null) return;

    this.setCurrentSelectedResource(response);
    this._resources.set(response?.resourceID, response);
  }

  async updateAndSaveResource(resource: Resource): Promise<void> {
    const updateQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.UPDATE_RESOURCE
    );

    const preparedQuery = {
      ...updateQuery,
      body: resource,
    } as any;

    if (resource == null) return;

    const response = await queryExecutor.executeRestQuery(
      preparedQuery,
      { resourceID: resource.resourceID },
      this.stores.resourceStore
    );

    if (response == null || response?.resourceID == null) return;

    this.setCurrentSelectedResource(response);
    this._resources.set(response?.resourceID, response);
  }
}

export default ResourceStore;
