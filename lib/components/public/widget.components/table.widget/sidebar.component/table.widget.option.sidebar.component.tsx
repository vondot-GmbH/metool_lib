/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import MultiFieldDropdownEditor from "../../../../private/general.components/multi.field.dropdown.editor.component/multi.field.dropdown.editor.component";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import { useSidebar } from "../../../../private/editor.components/option.sidebar.component/option.sidebar.component";
import { TableColumn } from "../schemas/table.widget.schema";
import { TableWidgetColumnDetailView } from "./table.widget.column.detail.view.comonent";

interface TableWidgetOptionSidebarProps {
  widgetStore?: WidgetStore;
}

const TableWidgetOptionSidebar = ({
  widgetStore,
}: TableWidgetOptionSidebarProps): JSX.Element => {
  const selectedWidgetID = widgetStore?.getSelectedWidget()?.widget.widgetID;

  // TODO
  const columnOptions: TableColumn[] = widgetStore?.getWidgetOption(
    selectedWidgetID ?? "",
    "columns"
  );

  const { pushView, popView } = useSidebar();

  const handleAddColumn = (): void => {
    const newColumn = {
      source: "neue Spalte",
      label: "Neue Spalte",
      textAlign: "left",
      format: "string",
      maxWidth: 200,
      minWidth: 100,
      resizable: true,
    } as TableColumn;

    let newColumnOptions = [newColumn];

    if (columnOptions) {
      newColumnOptions = [...columnOptions, newColumn];
    }

    console.log(newColumnOptions);

    widgetStore?.updateWidgetOption(
      selectedWidgetID ?? "",
      "columns",
      newColumnOptions
    );
  };

  return (
    <div>
      <CollapsibleSection title="Content">
        <MultiFieldDropdownEditor
          label="Columns"
          items={columnOptions}
          renderListItem={(item: TableColumn) => (
            <div
              onClick={() => {
                pushView(
                  <TableWidgetColumnDetailView
                    tableColumn={item}
                    selectedWidgetID={selectedWidgetID}
                    widgetStore={widgetStore}
                  />,
                  `${item.source}`
                );
              }}
            >
              <RunningText>{item.source}</RunningText>
            </div>
          )}
          onAdd={handleAddColumn}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Interaction">
        Interaction...
      </CollapsibleSection>
    </div>
  );
};

export default inject("widgetStore")(observer(TableWidgetOptionSidebar));
