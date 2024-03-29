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
import SpacingEditor from "../../../../private/general.components/spacing.editor.component/spacing.editor.component";
import defaultStyles from "../../../../../styles/index.module.scss";
import StateInputEditor from "../../../../private/general.components/state.input.text.component/state.input.text.component";
import EditorStore from "../../../../../stores/editor.store";

interface TableWidgetOptionSidebarProps {
  widgetStore?: WidgetStore;
  editorStore?: EditorStore;
}

const TableWidgetOptionSidebar = ({
  widgetStore,
  editorStore,
}: TableWidgetOptionSidebarProps): JSX.Element => {
  const selectedWidgetID = editorStore?.selectedWidget?.widget.widgetID;

  // TODO
  const columnOptions: TableColumn[] = widgetStore?.getWidgetOption(
    selectedWidgetID ?? "",
    "columns"
  );

  const tableOptions: TableOptions = widgetStore?.getAllOptionsForWidget(
    selectedWidgetID ?? ""
  );

  const { pushView } = useSidebar();

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
        <StateInputEditor
          label="Data"
          value={tableOptions?.data}
          className={defaultStyles.mb20}
          onChange={(value: string) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "data",
              value
            );
          }}
        />

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
              <RunningText>{item?.source}</RunningText>
            </div>
          )}
          onAdd={handleAddColumn}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Style">
        <TextInput
          type="color"
          label="Header Background Color"
          value={tableOptions?.headerBackgroundColor}
          className={defaultStyles.mt10}
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
          value={tableOptions?.rowBackgroundColor}
          className={defaultStyles.mt10}
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
          value={tableOptions?.rowHoverColor}
          className={defaultStyles.mt10}
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
          value={tableOptions?.borderBottomColor}
          className={defaultStyles.mt10}
          onValueChange={(value) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "borderBottomColor",
              value
            );
          }}
        />

        <SpacingEditor
          className={defaultStyles.mt10}
          label="Cell Padding"
          types={["padding"]}
          initialValues={{
            padding: {
              top: tableOptions?.tableCellPadding?.top,
              right: tableOptions?.tableCellPadding?.right,
              bottom: tableOptions?.tableCellPadding?.bottom,
              left: tableOptions?.tableCellPadding?.left,
            },
          }}
          onChange={(_mode, values) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "tableCellPadding",
              values
            );
          }}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Interaction">
        <MultiSwitch
          label="Row Selection"
          initialValue={tableOptions?.rowSelectionType}
          className={defaultStyles.mt10}
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

export default inject(
  "widgetStore",
  "editorStore"
)(observer(TableWidgetOptionSidebar));
