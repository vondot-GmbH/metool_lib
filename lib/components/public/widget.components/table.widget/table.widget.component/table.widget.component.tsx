import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import StateStore, { StateSelector } from "../../../../../stores/state.store";
import { TableWidgetState } from "../../../../../globals/interfaces/widget.state.interface";
import { useEffect, useState } from "react";
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
  const [usersData, setUsersData] = useState<any[]>([]);

  useEffect(() => {
    const analized = widgetStore?.getAnalyzedWidgetOptions(widgetID);
    if (!analized) return;

    stateStore?.initializeDynamicOptions(
      widgetID,
      analized,
      () => {},
      _getInitialTableWidgetState()
    );
  }, []);

  const data = stateStore?.getWidgetStateValue(
    StateSelector.WIDGETS,
    widgetID,
    "data"
  );

  const tableOptions: TableOptions =
    widgetStore?.getAllOptionsForWidget(widgetID);

  const getDataFromQuery = async () => {
    const data = [
      {
        id: 1,
        name: "John Doe",
        age: 32,
        website: "www.johndoe.com",
      },
      {
        id: 2,
        name: "peter Doe",
        age: 41,
        website: "www.peter.com",
      },
    ];

    setUsersData(data);
  };

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
      stateStore?.setStateValue(
        StateSelector.WIDGETS,
        widgetID,
        "selectedSourceRow",
        selectedData
      );
    } else if (tableOptions?.rowSelectionType === "multiple") {
      stateStore?.setStateValue(
        StateSelector.WIDGETS,
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

const _getInitialTableWidgetState = (): TableWidgetState => {
  const tableState = {
    isLoading: null,
    selectedSourceRow: null,
    selectedDataIndex: null,
    selectedDataIndexes: null,
    selectedSourceRows: null,
  } as TableWidgetState;

  return tableState as TableWidgetState;
};

export default inject("widgetStore", "stateStore")(observer(TableWidget));
