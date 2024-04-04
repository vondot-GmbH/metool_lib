import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import defaultStyles from "../../../../../styles/index.module.scss";
import EditorStore from "../../../../../stores/editor.store";
import StateInput from "../../../../private/general.components/input.components/state.input.component/state.input.component";

interface TextWidgetOptionSidebarProps {
  widgetStore?: WidgetStore;
  editorStore?: EditorStore;
}

const TextWidgetOptionSidebar = ({
  widgetStore,
  editorStore,
}: TextWidgetOptionSidebarProps): JSX.Element => {
  const selectedWidgetID = editorStore?.selectedWidget?.widget.widgetID;
  // TODO is there a other way to get the selectedWidgetID maby dont need to pass it to the update function

  const data: string = widgetStore?.getWidgetOption(
    selectedWidgetID ?? "",
    "data"
  );

  return (
    <div>
      <CollapsibleSection title="Content">
        <StateInput
          label="Data"
          value={data ?? ""}
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

export default inject(
  "widgetStore",
  "editorStore"
)(observer(TextWidgetOptionSidebar));
