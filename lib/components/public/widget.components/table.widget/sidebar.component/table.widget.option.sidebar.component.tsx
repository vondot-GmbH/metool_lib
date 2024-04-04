import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import MultiFieldDropdownEditor from "../../../../private/general.components/multi.field.dropdown.editor.component/multi.field.dropdown.editor.component";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import { useSidebar } from "../../../../private/editor.components/option.sidebar.component/option.sidebar.component";
import { TableColumn, TableOptions } from "../schemas/table.widget.schema";
import { TableWidgetColumnDetailView } from "./table.widget.column.detail.view.comonent";
import { v4 as UUID } from "uuid";
import MultiSwitch from "../../../../private/general.components/multi.switch.component/multi.switch.component";
import defaultStyles from "../../../../../styles/index.module.scss";
import StateInputEditor from "../../../../private/general.components/state.input.text.component/state.input.text.component";
import EditorStore from "../../../../../stores/editor.store";
import CSSPropertyEditor from "../../../../private/general.components/input.components/css.property.editor.component/css.property.editor.component";
import EventHandlerEditor from "../../../../private/general.components/input.components/event.handler.editor.component/event.handler.editor.component";

interface TableWidgetSidebarProps {
  widgetStore?: WidgetStore;
  editorStore?: EditorStore;
}

const TableWidgetSidebar = ({
  widgetStore,
  editorStore,
}: TableWidgetSidebarProps): JSX.Element => {
  const selectedWidgetID = editorStore?.selectedWidget?.widget.widgetID;
  const options: TableOptions = widgetStore?.getAllOptionsForWidget(
    selectedWidgetID ?? ""
  );

  const { pushView } = useSidebar();

  const handleAddColumn = (): void => {
    const columnOptions: TableColumn[] = options?.columns;

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
          value={options?.data}
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
          items={options?.columns}
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

      <CollapsibleSection title="Interaction">
        <EventHandlerEditor
          initialEvents={options?.events}
          onChange={(events) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "events",
              events
            );
          }}
        />

        <MultiSwitch
          label="Row Selection"
          initialValue={options?.rowSelectionType}
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

      <CollapsibleSection title="Style">
        <CSSPropertyEditor
          label="Header Styles"
          onChange={(properties: Record<string, string>) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "headerStyles",
              properties
            );
          }}
          initialProperties={options?.headerStyles as Record<string, string>}
        />

        <CSSPropertyEditor
          label="Header Cell Styles"
          onChange={(properties: Record<string, string>) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "headerCellStyles",
              properties
            );
          }}
          initialProperties={
            options?.headerCellStyles as Record<string, string>
          }
        />

        <CSSPropertyEditor
          label="Body Row Styles"
          onChange={(properties: Record<string, string>) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "bodyRowStyles",
              properties
            );
          }}
          initialProperties={options?.bodyRowStyles as Record<string, string>}
        />

        <CSSPropertyEditor
          label="Body Cell Styles"
          onChange={(properties: Record<string, string>) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "bodyCellStyles",
              properties
            );
          }}
          initialProperties={options?.bodyCellStyles as Record<string, string>}
        />
      </CollapsibleSection>
    </div>
  );
};

export default inject(
  "widgetStore",
  "editorStore"
)(observer(TableWidgetSidebar));
