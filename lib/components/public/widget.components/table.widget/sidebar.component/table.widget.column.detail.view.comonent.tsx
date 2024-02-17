import WidgetStore from "../../../../../stores/widget.store";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import MultiSwitch from "../../../../private/general.components/multi.switch.component/multi.switch.component";
import TextInput from "../../../../private/general.components/outlined.text.input.component/outlined.text.input.component";
import { TableColumn } from "../schemas/table.widget.schema";

interface DetailViewProps {
  tableColumn: TableColumn;
  widgetStore?: WidgetStore;
  selectedWidgetID?: string;
}

export const TableWidgetColumnDetailView = ({
  tableColumn,
  widgetStore,
  selectedWidgetID,
}: DetailViewProps): JSX.Element => (
  <div>
    <CollapsibleSection title="Content">
      <TextInput
        label="Source"
        value={tableColumn.source}
        onValueChange={(value) => {
          widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
            widgetID: selectedWidgetID ?? "",
            optionName: "columns",
            finder: (column: TableColumn) =>
              column.columnID === tableColumn.columnID,
            updater: (column: TableColumn) => ({
              ...column,
              source: value,
            }),
          });
        }}
      />
      <MultiSwitch
        label="Text Align"
        initialValue={tableColumn.textAlign}
        onChange={(value) => {
          widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
            widgetID: selectedWidgetID ?? "",
            optionName: "columns",
            finder: (column: TableColumn) =>
              column.columnID === tableColumn.columnID,
            updater: (column: TableColumn) => ({
              ...column,
              textAlign: value as any,
            }),
          });
        }}
        options={[
          {
            label: "Left",
            value: "left",
          },
          {
            label: "Center",
            value: "center",
          },
          {
            label: "Right",
            value: "right",
          },
        ]}
      />
      <TextInput
        label="Label"
        value={tableColumn.label}
        onValueChange={(value) => {
          widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
            widgetID: selectedWidgetID ?? "",
            optionName: "label",
            finder: (column: TableColumn) =>
              column.columnID === tableColumn.columnID,
            updater: (column: TableColumn) => ({
              ...column,
              label: value,
            }),
          });
        }}
      />
      // TODO this doesn't work
      <MultiSwitch
        label="Resizability"
        initialValue={tableColumn?.resizable?.toString()}
        onChange={(value) => {
          // TODO improve method
          widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
            widgetID: selectedWidgetID ?? "",
            optionName: "resizable",
            finder: (column: TableColumn) =>
              column.columnID === tableColumn.columnID,
            updater: (column: TableColumn) => ({
              ...column,
              resizable: value.toString() === "true",
            }),
          });
        }}
        options={[
          {
            label: "True",
            value: "true",
          },
          {
            label: "False",
            value: "false",
          },
        ]}
      />
    </CollapsibleSection>
  </div>
);
