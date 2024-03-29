import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import StateStore, { StateSelector } from "../../../../../stores/state.store";
import { TableWidgetState } from "../../../../../globals/interfaces/widget.state.interface";
import { useEffect, useState } from "react";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import Table from "../../../../private/general.components/table.component/data.table.component";
import { TableOptions, TableColumn } from "../schemas/table.widget.schema";
import NavigationStore from "../../../../../stores/navigation.store";
import TableWidgetLoadingComponent from "../table.widget.loading.component/table.widget.loading.component";

interface TableWidgetProps {
  widgetID: string;
  widgetStore?: WidgetStore;
  stateStore?: StateStore;
  navigationStore?: NavigationStore;
}

const TableWidget = ({
  widgetID,
  widgetStore,
  stateStore,
}: TableWidgetProps): JSX.Element => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const tableOptions: TableOptions =
    widgetStore?.getAllOptionsForWidget(widgetID);

  useEffect(() => {
    const analized = widgetStore?.getAnalyzedWidgetOptions(widgetID);
    if (!analized) return;

    stateStore?.initializeDynamicOptions(
      widgetID,
      analized,
      (options) => {
        setIsLoading(options?.isLoading);
        console.log("options?.isLoading");
        console.log(options?.isLoading);
        setData(options?.data);
      },
      _getInitialTableWidgetState()
    );
  }, []);

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

  if (isLoading) {
    return <TableWidgetLoadingComponent count={5} />;
  }

  return (
    <Table
      key={widgetID}
      columns={(prepareColumns(tableOptions) as any[]) || []}
      data={data || []}
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
      onSelectionIndexChange={() => {
        // TODO: Implement this
        // console.log("selectedIndexes");
        // console.log(selectedIndexes);
      }}
    />
  );
};

// TODO move this
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

export default inject(
  "widgetStore",
  "stateStore",
  "navigationStore"
)(observer(TableWidget));
