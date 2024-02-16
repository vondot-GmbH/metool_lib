/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import { WidgetConfig } from "../../../../../main";
import MultiFieldDropdownEditor from "../../../../private/general.components/multi.field.dropdown.editor.component/multi.field.dropdown.editor.component";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import MultiSwitch from "../../../../private/general.components/multi.switch.component/multi.switch.component";
import { faArrowAltCircleDown } from "@fortawesome/free-regular-svg-icons";
import { useSidebar } from "../../../../private/editor.components/option.sidebar.component/option.sidebar.component";

interface TableColumn {
  source: string;
  label: string;
  flex: number;
  algin: "START" | "CENTER" | "END";
}

interface TableWidgetOptionSidebarProps {
  widgetStore?: WidgetStore;
  selectedWidgetConfig: WidgetConfig;
}

const TableWidgetOptionSidebar = ({
  selectedWidgetConfig,
  widgetStore,
}: TableWidgetOptionSidebarProps): JSX.Element => {
  const selectedWidget = widgetStore?.getSelectedWidget();
  const selectedWidgetID = widgetStore?.getSelectedWidget()?.widget.widgetID;
  const columnOptions: TableColumn[] = widgetStore?.getWidgetOption(
    selectedWidgetID ?? "",
    "columns"
  ); // TODO

  const { pushView, views, titles, popView } = useSidebar();

  const handleAddColumn = (): void => {
    const newColumn = {
      source: "newColumn",
      label: "Neue Spalte",
      flex: 1,
      algin: "START",
    };

    const newColumnOptions = [...columnOptions, { ...newColumn }];

    widgetStore?.updateWidgetOption(
      selectedWidgetID ?? "",
      "columns",
      newColumnOptions
    );
  };

  const DetailView = () => (
    <div>
      <CollapsibleSection title="Content">
        <MultiSwitch
          label="Meine Einträge 2"
          initialValue="option 1"
          onChange={(value) => {
            console.log(value);
          }}
          options={[
            {
              icon: faArrowAltCircleDown,
              value: "option 1",
            },
            {
              label: "2",
              value: "option 22",
            },
            {
              label: "3",
              value: "option 322",
            },
            {
              label: "3",
              value: "option 2",
            },
          ]}
        />
      </CollapsibleSection>
    </div>
  );

  return (
    <div>
      <CollapsibleSection title="Content">
        <MultiFieldDropdownEditor
          label="Spalten"
          items={columnOptions}
          renderListItem={(item) => (
            <div
              onClick={() => {
                pushView(<DetailView />, `${item.label}`);
              }}
            >
              <RunningText>{item.label}</RunningText>
            </div>
          )}
          onAdd={handleAddColumn}
        />
      </CollapsibleSection>
    </div>
  );
};

export default inject("widgetStore")(observer(TableWidgetOptionSidebar));
