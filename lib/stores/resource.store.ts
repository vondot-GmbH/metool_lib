import ConfigProvider from "../config/config.provider";
import {
  MixedResourceMap,
  CoreResource,
  Resource,
  MixedResource,
} from "../schemas/resource.schemas/resource.schema";
import { makeAutoObservable } from "mobx";
import { ChangeRecord } from "../globals/interfaces/change.record.interface";
import { CoreRestQueryType } from "../schemas/query.schemas/query.schema";
import { queryExecutor } from "../provider/http/http.rest.query.client";
import RootStore from "./root.store";

class ResourceStore {
  private _resources: MixedResourceMap = new Map();
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

  //! Getter

  get resources(): MixedResource[] {
    return Array.from(this._resources.values());
  }

  getResource(resourceID: string): MixedResource | undefined {
    return this._resources.get(resourceID);
  }

  //! Methods

  saveResourceChangesAndProcess(resource: Resource): ChangeRecord[] {
    if (resource?._id == null || resource?._id === "newResource") {
      this.stores.changeRecordStore.setResourceRecord(
        "newResource",
        "CREATE",
        resource
      );
    } else if (resource?._id != null) {
      this.stores.changeRecordStore.setResourceRecord(
        resource._id,
        "UPDATE",
        resource
      );
    }

    return this.stores.changeRecordStore.processReleaseChanges();
  }

  addInitialResource(): void {
    this._resources.set("newResource", {
      _id: "newResource",
      title: "New Resource",
    } as any);
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
}

export default ResourceStore;
