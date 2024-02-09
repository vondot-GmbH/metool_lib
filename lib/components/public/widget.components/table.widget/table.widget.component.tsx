/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../stores/widget.store";
import StateStore from "../../../../stores/state.store";
import { TableWidgetState } from "../../../../globals/interfaces/widget.state.interface";
import { useEffect } from "react";
import ListDataTable from "../../../private/general.components/table.component/data.table.component";
import Column from "../../../private/general.components/column.component/column.component";
import RunningText from "../../../private/general.components/text.components/running.text.component/running.text.component";

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

  const usersData = [
    { id: "1", name: "Alice", age: 30, email: "alice@example.com" },
    { id: "2", name: "Bob", age: 24, email: "bob@example.com" },
    { id: "3", name: "Charlie", age: 28, email: "charlie@example.com" },
  ];

  // Spaltendefinitionen
  const columns = [
    { flex: 1, child: <RunningText>name</RunningText> },
    { flex: 1, child: <RunningText>Alter</RunningText> },
    { flex: 2, child: <RunningText>Email</RunningText> },
  ];

  // Komponente für die Anzeige der Datenzeile
  const dataTableItemBuilder = (user: any, index: any) => ({
    key: user.id,
    children: [
      {
        child: (
          <Column>
            <RunningText>{user.name}</RunningText>
          </Column>
        ),
      },
      {
        child: (
          <Column>
            <RunningText>{user.age}</RunningText>
          </Column>
        ),
      },
      {
        child: (
          <Column>
            <RunningText>{user.email}</RunningText>
          </Column>
        ),
      },
    ],
  });

  return (
    <ListDataTable
      data={usersData}
      columns={columns}
      dataTableItemBuilder={dataTableItemBuilder}
      onClick={(user) => alert(`Clicked on user: ${user.name}`)}
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
