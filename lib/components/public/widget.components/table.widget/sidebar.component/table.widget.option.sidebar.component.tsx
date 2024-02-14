/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
// import styles from "./container.widget.component.module.scss";
import OptionSidebar, {
  ViewProps,
} from "../../../../private/editor.components/option.sidebar.component/option.sidebar.component";
import WidgetStore from "../../../../../stores/widget.store";
import { WidgetConfig } from "../../../../../main";
import MultiFieldDropdownEditor from "../../../../private/general.components/multi.field.dropdown.editor.component/multi.field.dropdown.editor.component";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";

interface TableWidgetOptionSidebarProps {
  widgetStore?: WidgetStore;
  selectedWidgetConfig: WidgetConfig;
}

const TableWidgetOptionSidebar = ({
  selectedWidgetConfig,
}: TableWidgetOptionSidebarProps): JSX.Element => {
  const DetailView = ({
    popView,
    item,
  }: {
    popView: () => void;
    item: any;
  }) => (
    <div>
      <CollapsibleSection title="Meine Einträge">
        <RunningText>
          Hier können Sie die Einträge für die Tabelle verwalten.
        </RunningText>
      </CollapsibleSection>
    </div>
  );

  const MainView = ({ pushView, popView }: ViewProps) => (
    <div>
      <CollapsibleSection title="Meine Einträge">
        <MultiFieldDropdownEditor
          label="Content"
          items={[
            { label: "Eintrag 1" },
            { label: "Eintrag 2" },
            { label: "Eintrag 3" },
          ]}
          renderListItem={(item) => (
            <div
              onClick={() =>
                pushView(
                  () => <DetailView item={item} popView={popView} />,
                  `Detailansicht für ${item.label}`
                )
              }
            >
              <RunningText>{item.label}</RunningText>
            </div>
          )}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Meine Einträge">
        <RunningText>
          Hier können Sie die Einträge für die Tabelle verwalten.
        </RunningText>
      </CollapsibleSection>
    </div>
  );

  return (
    <OptionSidebar
      selectedWidgetConfig={selectedWidgetConfig}
      initialView={MainView}
    />
  );
};

export default inject("widgetStore")(observer(TableWidgetOptionSidebar));
