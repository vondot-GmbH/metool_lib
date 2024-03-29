import WidgetStore from "../../../../../stores/widget.store";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import MultiSwitch from "../../../../private/general.components/multi.switch.component/multi.switch.component";
import TextInput from "../../../../private/general.components/outlined.text.input.component/outlined.text.input.component";
import { TableColumn } from "../schemas/table.widget.schema";
import defaultStyles from "../../../../../styles/index.module.scss";

interface DetailViewProps {
  tableColumn: TableColumn;
  widgetStore?: WidgetStore;
  selectedWidgetID?: string;
}

// TODO export below and check inject stores
export const TableWidgetColumnDetailView = ({
  tableColumn,
  widgetStore,
  selectedWidgetID,
}: DetailViewProps): JSX.Element => {
  return (
    <div>
      <CollapsibleSection title="Content">
        <TextInput
          label="Source"
          value={tableColumn.source}
          onValueChange={(value) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
                widgetID: selectedWidgetID ?? "",
                optionName: "columns",
                identifierField: "columnID",
                identifierValue: tableColumn.columnID,
                updatedProperties: {
                  source: value as string,
                },
              });
            }
          }}
        />

        <TextInput
          label="Label"
          value={tableColumn.label}
          className={defaultStyles.mt10}
          onValueChange={(value) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
                widgetID: selectedWidgetID ?? "",
                optionName: "columns",
                identifierField: "columnID",
                identifierValue: tableColumn.columnID,
                updatedProperties: {
                  label: value as string,
                },
              });
            }
          }}
        />

        <MultiSwitch
          label="Resizability"
          initialValue={tableColumn?.resizable?.toString()}
          className={defaultStyles.mt10}
          onChange={(value) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
                widgetID: selectedWidgetID ?? "",
                optionName: "columns",
                identifierField: "columnID",
                identifierValue: tableColumn.columnID,
                updatedProperties: {
                  resizable: value === "true",
                },
              });
            }
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

        <TextInput
          label="Min Width"
          value={tableColumn.minWidth}
          className={defaultStyles.mt10}
          type="number"
          onValueChange={(value) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
                widgetID: selectedWidgetID ?? "",
                optionName: "columns",
                identifierField: "columnID",
                identifierValue: tableColumn.columnID,
                updatedProperties: {
                  minWidth: value as number,
                },
              });
            }
          }}
        />

        <TextInput
          label="Max Width"
          value={tableColumn.maxWidth}
          className={defaultStyles.mt10}
          type="number"
          onValueChange={(value) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
                widgetID: selectedWidgetID ?? "",
                optionName: "columns",
                identifierField: "columnID",
                identifierValue: tableColumn.columnID,
                updatedProperties: {
                  maxWidth: value as number,
                },
              });
            }
          }}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Style">
        <MultiSwitch
          label="Text Align"
          initialValue={tableColumn.textAlign}
          className={defaultStyles.mt10}
          onChange={(value: any) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
                widgetID: selectedWidgetID ?? "",
                optionName: "columns",
                identifierField: "columnID",
                identifierValue: tableColumn.columnID,
                updatedProperties: {
                  textAlign: value,
                },
              });
            }
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
          label="Header Background Color"
          value={tableColumn?.headerBackgroundColor}
          className={defaultStyles.mt10}
          type="color"
          onValueChange={(value) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
                widgetID: selectedWidgetID ?? "",
                optionName: "columns",
                identifierField: "columnID",
                identifierValue: tableColumn.columnID,
                updatedProperties: {
                  headerBackgroundColor: value as string,
                },
              });
            }
          }}
        />

        <TextInput
          label="Row Background Color"
          value={tableColumn?.rowBackgroundColor}
          className={defaultStyles.mt10}
          type="color"
          onValueChange={(value) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
                widgetID: selectedWidgetID ?? "",
                optionName: "columns",
                identifierField: "columnID",
                identifierValue: tableColumn.columnID,
                updatedProperties: {
                  rowBackgroundColor: value as string,
                },
              });
            }
          }}
        />

        <TextInput
          label="Row Text Color"
          value={tableColumn?.rowTextColor}
          className={defaultStyles.mt10}
          type="color"
          onValueChange={(value) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
                widgetID: selectedWidgetID ?? "",
                optionName: "columns",
                identifierField: "columnID",
                identifierValue: tableColumn.columnID,
                updatedProperties: {
                  rowTextColor: value as string,
                },
              });
            }
          }}
        />

        <TextInput
          label="Header Text Color"
          value={tableColumn?.headerTextColor}
          className={defaultStyles.mt10}
          type="color"
          onValueChange={(value) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
                widgetID: selectedWidgetID ?? "",
                optionName: "columns",
                identifierField: "columnID",
                identifierValue: tableColumn.columnID,
                updatedProperties: {
                  headerTextColor: value as string,
                },
              });
            }
          }}
        />
      </CollapsibleSection>
    </div>
  );
};
