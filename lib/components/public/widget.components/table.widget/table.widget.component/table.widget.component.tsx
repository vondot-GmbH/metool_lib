import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import StateStore, { StateSelector } from "../../../../../stores/state.store";
import { TableWidgetState } from "../../../../../globals/interfaces/widget.state.interface";
import { useEffect, useState } from "react";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import Table, {
  TableColumn,
} from "../../../../private/general.components/list.components/table.component/data.table.component";
import {
  TableOptions,
  TableColumnOptions,
} from "../schemas/table.widget.schema";
import NavigationStore from "../../../../../stores/navigation.store";
import { handleWidgetEvent } from "../../../../../globals/helpers/event.helper";
import { EventType } from "../../../../../globals/enums/widget.enum";
import Image from "../../../../private/general.components/image.component/image.component";

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
  navigationStore,
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

  const renderColumn = (columnOptions: TableColumnOptions, value: any) => {
    switch (columnOptions.format) {
      case "string":
        return <RunningText>{value}</RunningText>;
      case "image":
        return <Image size="M" imageUrl={value} />;
      default:
        return <RunningText>{value}</RunningText>;
    }
  };

  const prepareColumns = (tableOptions: TableOptions): TableColumn<any>[] => {
    return tableOptions?.columns?.map(
      (column) =>
        ({
          ...column,
          columnStyles: column.columnStyles,
          render: (value: any) => renderColumn(column, value),
        } as TableColumn<any>)
    );
  };

  const handleSelectionDataChange = (selectedData: any[]) => {
    if (tableOptions?.rowSelectionType === "single") {
      stateStore?.setStateValue(
        StateSelector.WIDGETS,
        widgetID,
        "selectedSourceRow",
        selectedData[0] || null
      );

      handleWidgetEvent({
        widgetOptions: tableOptions,
        eventType: EventType.ON_CLICK_ROW,
        navigationStore,
        stateStore,
      });
    } else if (tableOptions?.rowSelectionType === "multiple") {
      // TODO hanle that if the state logic is refactored (handle array of selected rows)
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
      rowKey="_id" // TODO MAKE IT DYNAMIC
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
