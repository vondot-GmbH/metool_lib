/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import StateStore from "../../../../../stores/state.store";
import { TableWidgetState } from "../../../../../globals/interfaces/widget.state.interface";
import { useEffect } from "react";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import Table from "../../../../private/general.components/table.component/data.table.component";
import { TableOptions, TableColumn } from "../schemas/table.widget.schema";

interface TableWidgetProps {
  widgetID: string;
  widgetStore?: WidgetStore;
  stateStore?: StateStore;
}

const TableWidget: React.FC<TableWidgetProps> = ({
  widgetID,
  widgetStore,
  stateStore,
}): JSX.Element => {
  useEffect(() => {
    stateStore?.initializeWidgetStates(widgetID, _getInitialTableWidgetState());
  }, []);

  const tableOptions: TableOptions =
    widgetStore?.getAllOptionsForWidget(widgetID);

  // TODO - remove this hardcoded data
  const usersData = [
    { id: "1", name: "Alice", age: 30, email: "alice@example.com" },
    { id: "2", name: "Bob", age: 24, email: "bob@example.com" },
    { id: "3", name: "Charlie", age: 28, email: "charlie@example.com" },
  ];

  const prepareColumns = (tableOptions: TableOptions): TableColumn[] => {
    return tableOptions?.columns?.map((column) => ({
      ...column,
      headerBackgroundColor:
        column?.headerBackgroundColor || tableOptions.headerBackgroundColor,
      rowBackgroundColor:
        column.rowBackgroundColor || tableOptions.rowBackgroundColor,
      borderBottomColor:
        column.borderBottomColor || tableOptions.borderBottomColor,
      render: (value: any) => <RunningText>{value}</RunningText>,
    }));
  };

  return (
    <Table
      columns={(prepareColumns(tableOptions) as any[]) || []}
      data={usersData}
      rowKey="id"
      noDataText="No data available"
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
