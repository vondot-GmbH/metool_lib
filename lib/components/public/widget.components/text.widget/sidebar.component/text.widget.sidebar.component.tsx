import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import TextInput from "../../../../private/general.components/outlined.text.input.component/outlined.text.input.component";
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
        <TextInput
          label="Data"
          value={data}
          className={defaultStyles.mt10}
          onValueChange={(value) => {
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
