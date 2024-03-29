import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import MultiFieldDropdownEditor from "../../../../private/general.components/multi.field.dropdown.editor.component/multi.field.dropdown.editor.component";
import { v4 as UUID } from "uuid";
import { useSidebar } from "../../../../private/editor.components/option.sidebar.component/option.sidebar.component";
import EditorStore from "../../../../../stores/editor.store";
import NavigationMenuItemDetailView from "./navigation.menu.item.detail.view.component";
import SelectDropDown from "../../../../private/general.components/select.dropdown.component/select.dropdown.component";

interface NavigationWidgetOptionSidebarProps {
  widgetStore?: WidgetStore;
  editorStore?: EditorStore;
}

// TODO find a place for all widget option interfaces (for all widgets)
export interface NavigationMenuItem {
  id: string;
  label: string;
  actionType: "navigate_to_view" | "navigate_to_page";
  targetID: string;
}

const orientationOptions = [
  {
    label: "horizontal",
    value: "horizontal",
  },
  {
    label: "vertical",
    value: "vertical",
  },
];

const NavigationWidgetOptionSidebar = ({
  widgetStore,
  editorStore,
}: NavigationWidgetOptionSidebarProps): JSX.Element => {
  const selectedWidgetID = editorStore?.selectedWidget?.widget.widgetID;
  const navigationItems: NavigationMenuItem[] = widgetStore?.getWidgetOption(
    selectedWidgetID ?? "",
    "items"
  );

  const { pushView } = useSidebar();

  const handleAddNavigationItem = (): void => {
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
          items={navigationItems}
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
              {item.label}
            </div>
          )}
          onAdd={handleAddNavigationItem}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Style">
        <SelectDropDown
          label="Orientation"
          selectedItem={orientationOptions?.find(
            (option) =>
              option.value ===
              widgetStore?.getWidgetOption(
                selectedWidgetID ?? "",
                "orientation"
              )
          )}
          items={orientationOptions ?? []}
          onChange={(item) => {
            if (item?.value != null) {
              widgetStore?.updateWidgetOption(
                selectedWidgetID ?? "",
                "orientation",
                item?.value
              );
            }
          }}
        />
      </CollapsibleSection>
    </div>
  );
};

export default inject(
  "widgetStore",
  "editorStore"
)(observer(NavigationWidgetOptionSidebar));
