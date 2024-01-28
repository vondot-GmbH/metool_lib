/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ChangeRecord {
  type: "WIDGET";
  action: "CREATE" | "UPDATE" | "DELETE";
  documentID: string | null;
  data: any;
}
