import ConfigProvider from "../config/config.provider";
import {
  MixedResourceMap,
  CoreResource,
  Resource,
  MixedResource,
} from "../schemas/resource.schemas/resource.schema";
import { makeAutoObservable } from "mobx";
import ChangeRecordStore from "./change.record.store";
import { ChangeRecord } from "../globals/interfaces/change.record.interface";

class ResourceStore {
  private _resources: MixedResourceMap = new Map();
  private _changeRecordStore: ChangeRecordStore;

  constructor(changeRecordStore: ChangeRecordStore) {
    this._changeRecordStore = changeRecordStore;
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
      if (resource?.coreResource || resource?.key != null) {
        this._resources.set(resource.key, resource);
      }

      if (resource?._id != null && !resource?.coreResource) {
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
      this._changeRecordStore.setResourceRecord(
        "newResource",
        "CREATE",
        resource
      );
    } else if (resource?._id != null) {
      this._changeRecordStore.setResourceRecord(
        resource._id,
        "UPDATE",
        resource
      );
    }

    return this._changeRecordStore.processReleaseChanges();
  }

  addInitialResource(): void {
    this._resources.set("newResource", {
      _id: "newResource",
      title: "New Resource",
    } as any);
  }
}

export default ResourceStore;
