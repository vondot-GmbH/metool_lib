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

const TableWidget = ({
  widgetID,
  widgetStore,
  stateStore,
}: TableWidgetProps): JSX.Element => {
  useEffect(() => {
    stateStore?.initializeWidgetStates(
      widgetID,
      _getInitialTableWidgetState(tableOptions?.rowSelectionType)
    );
  }, [widgetID]);

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
      headerBackgroundColor: column?.headerBackgroundColor,
      rowBackgroundColor: column.rowBackgroundColor,
      borderBottomColor: tableOptions.borderBottomColor,
      render: (value: any) => <RunningText>{value}</RunningText>,
    }));
  };

  const handleSelectionDataChange = (selectedData: any) => {
    if (tableOptions?.rowSelectionType === "single") {
      stateStore?.setWidgetStateValue(
        widgetID,
        "selectedSourceRow",
        selectedData
      );
    } else if (tableOptions?.rowSelectionType === "multiple") {
      stateStore?.setWidgetStateValue(
        widgetID,
        "selectedSourceRows",
        selectedData
      );
    }
  };

  return (
    <Table
      key={widgetID}
      columns={(prepareColumns(tableOptions) as any[]) || []}
      data={usersData}
      rowKey="id"
      noDataText="No data available"
      defaultBorderBottomColor={tableOptions?.borderBottomColor}
      defaultHeaderBackgroundColor={tableOptions?.headerBackgroundColor}
      defaultRowBackgroundColor={tableOptions?.rowBackgroundColor}
      rowHoverColor={tableOptions?.rowHoverColor}
      rowSelectionType={tableOptions?.rowSelectionType}
      rowSelectionBackgroundColor={tableOptions?.rowSelectionBackgroundColor}
      tableCellPadding={tableOptions?.tableCellPadding}
      onSelectionDataChange={(selectedData) => {
        handleSelectionDataChange(selectedData);
      }}
      onSelectionIndexChange={(selectedIndexes) => {
        // console.log("selectedIndexes");
        // console.log(selectedIndexes);
      }}
    />
  );
};

const _getInitialTableWidgetState = (
  rowSelectionType: "single" | "multiple" | "none"
): TableWidgetState => {
  const tableState = {
    disabled: null,
    hidden: null,
    isLoading: null,
  } as TableWidgetState;

  if (rowSelectionType === "single") {
    tableState.selectedSourceRow = null;
    tableState.selectedDataIndex = null;
  } else if (rowSelectionType === "multiple") {
    tableState.selectedDataIndexes = null;
    tableState.selectedSourceRows = null;
  }

  return tableState as TableWidgetState;
};

export default inject("widgetStore", "stateStore")(observer(TableWidget));
