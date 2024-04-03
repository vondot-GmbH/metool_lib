export interface ChangeRecord {
  type: "WIDGET" | "RESOURCE" | "QUERY";
  action: "CREATE" | "UPDATE" | "DELETE";
  documentID: string | null;
  data: any;
}
