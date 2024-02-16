/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import MultiFieldDropdownEditor from "../../../../private/general.components/multi.field.dropdown.editor.component/multi.field.dropdown.editor.component";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import MultiSwitch from "../../../../private/general.components/multi.switch.component/multi.switch.component";
import { useSidebar } from "../../../../private/editor.components/option.sidebar.component/option.sidebar.component";
import TextInput from "../../../../private/general.components/outlined.text.input.component/outlined.text.input.component";

interface TableColumn {
  source: string;
  label: string;
  flex: number;
  algin: "START" | "CENTER" | "END";
}

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
      source: "email",
      label: "Neue Spalte",
      flex: 1,
      algin: "START",
    };

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

  const DetailView = ({
    tableColumn,
  }: {
    tableColumn: TableColumn;
  }): JSX.Element => (
    <div>
      <CollapsibleSection title="Content">
        <MultiSwitch
          label="Algin"
          initialValue={tableColumn.algin}
          onChange={(value) => {
            if (columnOptions) {
              const newColumnOptions = columnOptions.map((column) => {
                if (column.source === tableColumn.source) {
                  return {
                    ...column,
                    algin: value,
                  };
                }
                return column;
              });

              widgetStore?.updateWidgetOption(
                selectedWidgetID ?? "",
                "columns",
                newColumnOptions
              );
            }
          }}
          options={[
            {
              label: "Left",
              value: "LEFT",
            },
            {
              label: "Center",
              value: "CENTER",
            },
            {
              label: "Right",
              value: "RIGHT",
            },
          ]}
        />

        <TextInput
          label="Label"
          value={tableColumn.label}
          onValueChange={(value) => {
            if (columnOptions) {
              const newColumnOptions = columnOptions.map((column) => {
                if (column.source === tableColumn.source) {
                  return {
                    ...column,
                    label: value,
                  };
                }
                return column;
              });

              widgetStore?.updateWidgetOption(
                selectedWidgetID ?? "",
                "columns",
                newColumnOptions
              );
            }
          }}
        />
      </CollapsibleSection>
    </div>
  );

  return (
    <div>
      <CollapsibleSection title="Content">
        <MultiFieldDropdownEditor
          label="Columns"
          items={columnOptions}
          renderListItem={(item: TableColumn) => (
            <div
              onClick={() => {
                pushView(<DetailView tableColumn={item} />, `${item.label}`);
              }}
            >
              <RunningText>{item.label}</RunningText>
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
