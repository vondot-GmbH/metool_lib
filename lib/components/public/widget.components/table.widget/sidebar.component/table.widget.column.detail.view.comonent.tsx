import WidgetStore from "../../../../../stores/widget.store";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import TextInput from "../../../../private/general.components/input.components/text.input.component/text.input.component";
import { TableColumn } from "../schemas/table.widget.schema";
import defaultStyles from "../../../../../styles/index.module.scss";
import CSSPropertyEditor from "../../../../private/general.components/input.components/css.property.editor.component/css.property.editor.component";

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
      </CollapsibleSection>

      <CollapsibleSection title="Style">
        <CSSPropertyEditor
          label="Column Styles"
          onChange={(properties: Record<string, string>) => {
            widgetStore?.updateWidgetOptionArrayItem<TableColumn>({
              widgetID: selectedWidgetID ?? "",
              optionName: "columns",
              identifierField: "columnID",
              identifierValue: tableColumn.columnID,
              updatedProperties: {
                columnStyles: properties,
              },
            });
          }}
          initialProperties={tableColumn.columnStyles as Record<string, string>}
        />
      </CollapsibleSection>
    </div>
  );
};
