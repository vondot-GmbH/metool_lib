/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import StateStore from "../../../../../stores/state.store";
import { TableWidgetState } from "../../../../../globals/interfaces/widget.state.interface";
import { useEffect } from "react";
import Column from "../../../../private/general.components/column.component/column.component";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import Table from "../../../../private/general.components/table.component/data.table.component";

interface TableWidgetProps {
  widgetID: string;
  widgetStore?: WidgetStore;
  stateStore?: StateStore;
}

const TableWidget: React.FC<TableWidgetProps> = ({
  widgetID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  widgetStore,
  stateStore,
}): JSX.Element => {
  useEffect(() => {
    stateStore?.initializeWidgetStates(widgetID, _getInitialTableWidgetState());
  }, []);

  const columnOptions: any[] = widgetStore?.getWidgetOption(
    widgetID ?? "",
    "columns"
  );

  const usersData = [
    { id: "1", name: "Alice", age: 30, email: "alice@example.com" },
    { id: "2", name: "Bob", age: 24, email: "bob@example.com" },
    { id: "3", name: "Charlie", age: 28, email: "charlie@example.com" },
  ];

  const columns =
    columnOptions != null
      ? columnOptions.map((col) => ({
          flex: col.flex,
          child: <RunningText>{col.label}</RunningText>,
        }))
      : [{ flex: 1, child: <RunningText>No Data</RunningText> }]; // Standardspalte, wenn keine Spaltenoptionen vorhanden sind

  // Funktion, um die Datenzeilen zu bauen
  const dataTableItemBuilder = (user: any) => ({
    key: user.id ?? "no-data",
    children:
      columnOptions != null
        ? columnOptions.map((col) => ({
            child: (
              <Column>
                <RunningText>{user[col.source]}</RunningText>
              </Column>
            ),
          }))
        : [{ child: <RunningText>No Data</RunningText> }], // Standardzelle, wenn keine Daten vorhanden sind
  });

  return (
    <Table
      columns={[
        {
          label: "Name",
          dataIndex: "name",
          resizable: true,
          render: (name: string) => (
            <RunningText>{name} 1 mmmmmmmmammasmsfdmfmmasmsafmsm</RunningText>
          ),
        },
        {
          label: "Age",
          dataIndex: "age",
          resizable: true,
          render: (age: number) => <RunningText>{age} 1</RunningText>,
        },
        {
          label: "Email",
          dataIndex: "email",
          resizable: true,
          render: (email: string) => <RunningText>{email} 2</RunningText>,
        },
      ]}
      data={[
        {
          id: "1",
          name: "Alice",
          age: 30,
          email: "test@test.at",
        },
        {
          id: "2",
          name: "Bob",
          age: 24,
          email: "test@test.com",
        },
      ]}
      rowKey="id"

      // data={usersData}
      // columns={columns}
      // dataTableItemBuilder={dataTableItemBuilder}
      // onClick={(user) => console.log(`Clicked on user: ${user.name}`)}
    />
  );
};

const _getInitialTableWidgetState = (): TableWidgetState => {
  return {
    disabled: null,
    hidden: null,
    isLoading: null,
    selectedItem: null,
  } as TableWidgetState;
};

export default inject("widgetStore", "stateStore")(observer(TableWidget));
