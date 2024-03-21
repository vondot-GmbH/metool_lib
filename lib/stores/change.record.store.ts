import { makeAutoObservable, reaction } from "mobx";
import { ChangeRecord } from "../globals/interfaces/change.record.interface";
import RootStore from "./root.store";
import { debounce } from "lodash";

class ChangeRecordStore {
  private _changeRecords = new Map<string, ChangeRecord>();
  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);

    // Reagiert auf Änderungen in _changeRecords und ruft die debounced Process-Methode auf
    reaction(
      () => this._changeRecords.size, // Reagiert auf die Größe von _changeRecords
      () => {
        this.debouncedProcessChangeRecords();
      }
    );

    // Debounce-Funktion, die processChangeRecords aufruft
    this.debouncedProcessChangeRecords = debounce(
      () => this.processChangeRecords(), // Keine Notwendigkeit, einen leeren Array zu übergeben
      1250
    );
  }

  private debouncedProcessChangeRecords: () => void;

  //! getter

  getChangeRecords(): ChangeRecord[] {
    return Array.from(this._changeRecords.values());
  }

  //! methods

  async processChangeRecords(): Promise<void> {
    const changeRecords = this.getChangeRecords();

    for (const record of changeRecords) {
      switch (record.type) {
        case "WIDGET":
          if (record?.data?.widgetID != null) {
            await this.stores.widgetStore?.processWidgetChange(record);
            this.removeChangeRecord(record?.data?.widgetID);
          }
          break;

        default:
          console.warn("Unbekannter Change Record Typ:", record.type);
      }
    }
  }

  addChangeRecord(widgetID: string, record: ChangeRecord) {
    this._changeRecords.set(widgetID, record);
  }

  clearChangeRecords() {
    this._changeRecords.clear();
  }

  removeChangeRecord(ID: string) {
    this._changeRecords.delete(ID);
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
    const documentID = widgetID;

    // TODO
    if (data?._id != null) {
      delete data._id;
    }
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
