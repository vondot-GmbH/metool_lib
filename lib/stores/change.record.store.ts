import { makeAutoObservable } from "mobx";
import { ChangeRecord } from "../globals/interfaces/change.record.interface";

class ChangeRecordStore {
  private _changeRecords = new Map<string, ChangeRecord>();

  constructor() {
    makeAutoObservable(this);
  }

  //! getter

  getChangeRecords(): ChangeRecord[] {
    return Array.from(this._changeRecords.values());
  }

  //! methods

  addChangeRecord(widgetID: string, record: ChangeRecord) {
    this._changeRecords.set(widgetID, record);
  }

  clearChangeRecords() {
    this._changeRecords.clear();
  }

  processReleaseChanges() {
    const changeRecords = this.getChangeRecords();
    this.clearChangeRecords();
    return changeRecords;
  }

  updateExistingChangeRecordData(widgetID: string, data: any): void {
    const existingRecord = this._changeRecords.get(widgetID);

    if (existingRecord) {
      existingRecord.data = data;
    }
  }

  setChangeWidgetRecord(
    widgetID: string,
    action: "CREATE" | "UPDATE" | "DELETE",
    data: any
  ): void {
    const existingRecord = this._changeRecords.get(widgetID);
    const documentID = data?._id != null ? data._id : null;

    // cehck if the record already exists and if it does, check if the action is the same
    // prevent overwriting a create record with an update record
    if (
      existingRecord &&
      existingRecord.action === "CREATE" &&
      action === "UPDATE"
    ) {
      // if the action is the same, only update the data
      this.updateExistingChangeRecordData(widgetID, data);
      return;
    }

    // if a widget has a create record and then is deleted, only remove the create record instead of adding a delete record
    if (
      existingRecord &&
      existingRecord.action === "CREATE" &&
      action === "DELETE"
    ) {
      this._changeRecords.delete(widgetID);
      return;
    }

    const changeRecord: ChangeRecord = {
      type: "WIDGET",
      action: action,
      documentID,
      data: data,
    };

    this.addChangeRecord(widgetID, changeRecord);
  }

  setResourceRecord(
    resourceID: string,
    action: "CREATE" | "UPDATE" | "DELETE",
    data: any
  ): void {
    const documentID = resourceID === "newResource" ? null : resourceID;

    const changeRecord: ChangeRecord = {
      type: "RESOURCE",
      action: action,
      documentID,
      data: data,
    };

    this.addChangeRecord(resourceID, changeRecord);
  }
}

export default ChangeRecordStore;
