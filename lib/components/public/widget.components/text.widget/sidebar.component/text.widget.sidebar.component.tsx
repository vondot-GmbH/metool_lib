import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import StateInputEditor from "../../../../private/general.components/state.input.text.component/state.input.text.component";
import defaultStyles from "../../../../../styles/index.module.scss";

interface TextWidgetOptionSidebarProps {
  widgetStore?: WidgetStore;
}

const TextWidgetOptionSidebar = ({
  widgetStore,
}: TextWidgetOptionSidebarProps): JSX.Element => {
  const selectedWidgetID = widgetStore?.getSelectedWidget()?.widget.widgetID;

  // TODO
  const data: string = widgetStore?.getWidgetOption(
    selectedWidgetID ?? "",
    "data"
  );

  return (
    <div>
      <CollapsibleSection title="Content">
        <StateInputEditor
          label="Data"
          value={data}
          className={defaultStyles.mb10}
          onChange={(value: string) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "data",
              value
            );
          }}
        />
      </CollapsibleSection>
    </div>
  );
};

export default inject("widgetStore")(observer(TextWidgetOptionSidebar));
