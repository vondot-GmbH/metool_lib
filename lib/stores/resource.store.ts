import {
  Resource,
  ResourceMap,
} from "../schemas/resource.schemas/resource.schema";
import { makeAutoObservable } from "mobx";

class ResourceStore {
  private _resources: ResourceMap = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  //! Setter
  setResources(resources: Resource[]): void {
    resources.forEach((resource) => {
      this._resources.set(resource?.resourceID, resource);
    });
  }

  //! Getter

  get resources(): Resource[] {
    return Array.from(this._resources.values());
  }

  getResource(resourceID: string): Resource | undefined {
    return this._resources.get(resourceID);
  }

  //! Methods

  addResource(resource: Resource): void {
    this._resources.set(resource.resourceID, resource);
  }

  updateResource(resource: Resource): void {
    this._resources.set(resource.resourceID, resource);
  }
}

export default ResourceStore;
