import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import EditorStore from "../../../../../stores/editor.store";
import { ContainerOptions } from "../schemas/container.widget.schema";
import CSSPropertyEditor from "../../../../private/general.components/input.components/css.property.editor.component/css.property.editor.component";

interface ContainerWidgetSidebarProps {
  widgetStore?: WidgetStore;
  editorStore?: EditorStore;
}

const ContainerWidgetSidebar = ({
  widgetStore,
  editorStore,
}: ContainerWidgetSidebarProps): JSX.Element => {
  const selectedWidgetID = editorStore?.selectedWidget?.widget.widgetID;

  const containerOptions: ContainerOptions =
    widgetStore?.getAllOptionsForWidget(selectedWidgetID ?? "");

  return (
    <div>
      <CollapsibleSection title="Style">
        <CSSPropertyEditor
          label="Container Styles"
          onChange={(properties: Record<string, string>) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "containerStyles",
              properties
            );
          }}
          initialProperties={
            containerOptions?.containerStyles as Record<string, string>
          }
        />
      </CollapsibleSection>
    </div>
  );
};

export default inject(
  "widgetStore",
  "editorStore"
)(observer(ContainerWidgetSidebar));
