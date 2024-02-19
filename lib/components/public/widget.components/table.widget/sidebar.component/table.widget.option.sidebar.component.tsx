/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import MultiFieldDropdownEditor from "../../../../private/general.components/multi.field.dropdown.editor.component/multi.field.dropdown.editor.component";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import { useSidebar } from "../../../../private/editor.components/option.sidebar.component/option.sidebar.component";
import { TableColumn, TableOptions } from "../schemas/table.widget.schema";
import { TableWidgetColumnDetailView } from "./table.widget.column.detail.view.comonent";
import TextInput from "../../../../private/general.components/outlined.text.input.component/outlined.text.input.component";
import { v4 as UUID } from "uuid";
import MultiSwitch from "../../../../private/general.components/multi.switch.component/multi.switch.component";

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

  const tableOptions: TableOptions = widgetStore?.getAllOptionsForWidget(
    selectedWidgetID ?? ""
  );

  const { pushView, popView } = useSidebar();

  const handleAddColumn = (): void => {
    const newColumn = {
      columnID: UUID(),
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

      <CollapsibleSection title="Style">
        <TextInput
          type="color"
          label="Header Background Color"
          value={tableOptions.headerBackgroundColor}
          onValueChange={(value) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "headerBackgroundColor",
              value
            );
          }}
        />

        <TextInput
          type="color"
          label="Row Background Color"
          value={tableOptions.rowBackgroundColor}
          onValueChange={(value) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "rowBackgroundColor",
              value
            );
          }}
        />

        <TextInput
          type="color"
          label="Row Hover Color"
          value={tableOptions.rowHoverColor}
          onValueChange={(value) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "rowHoverColor",
              value
            );
          }}
        />

        <TextInput
          type="color"
          label="Border Color"
          value={tableOptions.borderBottomColor}
          onValueChange={(value) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "borderBottomColor",
              value
            );
          }}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Interaction">
        <MultiSwitch
          label="Row Selection"
          initialValue={tableOptions.rowSelectionType}
          onChange={(value) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "rowSelectionType",
              value
            );
          }}
          options={[
            {
              label: "Single",
              value: "single",
            },
            {
              label: "Multiple",
              value: "multiple",
            },
            {
              label: "None",
              value: "none",
            },
          ]}
        />
      </CollapsibleSection>
    </div>
  );
};

export default inject("widgetStore")(observer(TableWidgetOptionSidebar));
