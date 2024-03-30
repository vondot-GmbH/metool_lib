import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import StateStore, { StateSelector } from "../../../../../stores/state.store";
import { TableWidgetState } from "../../../../../globals/interfaces/widget.state.interface";
import { useEffect, useState } from "react";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import Table, {
  TableColumn,
} from "../../../../private/general.components/table.component/data.table.component";
import { TableOptions } from "../schemas/table.widget.schema";
import NavigationStore from "../../../../../stores/navigation.store";

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
        setData(options?.data);
      },
      _getInitialTableWidgetState()
    );
  }, []);

  const prepareColumns = (tableOptions: TableOptions): TableColumn<any>[] => {
    return tableOptions?.columns?.map(
      (column) =>
        ({
          ...column,
          columnStyles: column.columnStyles,
          render: (value: any) => <RunningText>{value}</RunningText>,
        } as TableColumn<any>)
    );
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
      isLoading={isLoading}
      key={widgetID}
      columns={(prepareColumns(tableOptions) as any[]) || []}
      data={data || []}
      rowKey="id"
      headerStyles={tableOptions?.headerStyles}
      bodyCellStyles={tableOptions?.bodyCellStyles}
      bodyRowStyles={tableOptions?.bodyRowStyles}
      headerCellStyles={tableOptions?.headerCellStyles}
      noDataText="No data available"
      rowSelectionType={tableOptions?.rowSelectionType}
      onSelectionDataChange={(selectedData) => {
        handleSelectionDataChange(selectedData);
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
