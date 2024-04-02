import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import MultiFieldDropdownEditor from "../../../../private/general.components/multi.field.dropdown.editor.component/multi.field.dropdown.editor.component";
import { v4 as UUID } from "uuid";
import { useSidebar } from "../../../../private/editor.components/option.sidebar.component/option.sidebar.component";
import EditorStore from "../../../../../stores/editor.store";
import NavigationMenuItemDetailView from "./navigation.menu.item.detail.view.component";
import RunningText from "../../../../private/general.components/text.components/running.text.component/running.text.component";
import MultiSwitch from "../../../../private/general.components/multi.switch.component/multi.switch.component";
import {
  NavigationMenuItem,
  NavigationMenuOptions,
} from "../schemas/navigation.menu.schema";
import CSSPropertyEditor from "../../../../private/general.components/input.components/css.property.editor.component/css.property.editor.component";

interface NavigationMenuWidgetSidebarProps {
  widgetStore?: WidgetStore;
  editorStore?: EditorStore;
}

const orientationOptions = [
  {
    label: "Horizontal",
    value: "horizontal",
  },
  {
    label: "Vertical",
    value: "vertical",
  },
];

const NavigationMenuWidgetSidebar = ({
  widgetStore,
  editorStore,
}: NavigationMenuWidgetSidebarProps): JSX.Element => {
  const selectedWidgetID = editorStore?.selectedWidget?.widget.widgetID;
  const options: NavigationMenuOptions = widgetStore?.getAllOptionsForWidget(
    selectedWidgetID ?? ""
  );

  const { pushView } = useSidebar();

  const handleAddNavigationItem = (): void => {
    const navigationItems: NavigationMenuItem[] = options?.items;

    const newItem: NavigationMenuItem = {
      id: UUID(),
      label: "New Item",
      targetID: "",
      actionType: "navigate_to_view",
    };

    const newItems = [...(navigationItems || []), newItem];
    widgetStore?.updateWidgetOption(selectedWidgetID ?? "", "items", newItems);
  };

  return (
    <div>
      <CollapsibleSection title="Content">
        <MultiFieldDropdownEditor
          label="Items"
          items={options?.items}
          renderListItem={(item: NavigationMenuItem) => (
            <div
              onClick={() =>
                pushView(
                  <NavigationMenuItemDetailView
                    menuItem={item}
                    selectedWidgetID={selectedWidgetID}
                    widgetStore={widgetStore}
                  />,
                  `Detail: ${item.label}`
                )
              }
            >
              <RunningText> {item.label}</RunningText>
            </div>
          )}
          onAdd={handleAddNavigationItem}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Style">
        <MultiSwitch
          label="Orientation"
          initialValue={widgetStore?.getWidgetOption(
            selectedWidgetID ?? "",
            "orientation"
          )}
          onChange={(value: any) => {
            if (value != null) {
              widgetStore?.updateWidgetOption(
                selectedWidgetID ?? "",
                "orientation",
                value
              );
            }
          }}
          options={orientationOptions}
        />

        <CSSPropertyEditor
          label="Menu Wrapper Styles"
          onChange={(properties: Record<string, string>) => {
            widgetStore?.updateWidgetOption(
              selectedWidgetID ?? "",
              "navigationMenuItemWrapperStyles",
              properties
            );
          }}
          initialProperties={
            options?.navigationMenuItemWrapperStyles as Record<string, string>
          }
        />
      </CollapsibleSection>
    </div>
  );
};

export default inject(
  "widgetStore",
  "editorStore"
)(observer(NavigationMenuWidgetSidebar));
