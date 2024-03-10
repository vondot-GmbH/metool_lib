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

  intializeResources(resources: Resource[]): void {
    const configProvider = ConfigProvider.getInstance();
    const coreResources = configProvider.getCoreResources();

    // set all provided resources
    this.setResources(resources);

    // set all core resources from the config provider
    this.setResources(coreResources);
  }

  private setResources(resources: Resource[] | CoreResource[]): void {
    resources.forEach((resource: any) => {
      if (resource?.core || resource?._id != null) {
        this._resources.set(resource._id, resource);
      }

      if (resource?._id != null && !resource?.core) {
        this._resources.set(resource._id, resource);
      }
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

  async fetchAndSaveResourcesForQueries(): Promise<void> {
    console.log("fetchAndSaveResourcesForQueries");

    const getResourceByIdQuery = this.stores.queryStore.getQuery(
      CoreRestQueryType.GET_RESOURCES_BY_ID
    );

    const queries = this.stores.queryStore.queries;

    if (queries == null || getResourceByIdQuery == null) {
      return;
    }

    for (const query of queries) {
      const isCoreResource = (query?.resource as any)?.core ?? false;
      const resourceID = query?.resource?._id;

      if (resourceID != null && !isCoreResource) {
        const response = await queryExecutor.executeRestQuery(
          getResourceByIdQuery,
          {
            resourceID: resourceID,
          }
        );

        if (response == null) continue;

        this._resources.set(resourceID, response);
      }
    }
  }
}

export default ResourceStore;
