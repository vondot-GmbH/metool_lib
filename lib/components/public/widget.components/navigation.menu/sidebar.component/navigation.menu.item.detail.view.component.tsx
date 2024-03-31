import WidgetStore from "../../../../../stores/widget.store";
import TextInput from "../../../../private/general.components/outlined.text.input.component/outlined.text.input.component";
import defaultStyles from "../../../../../styles/index.module.scss";
import CollapsibleSection from "../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import SelectDropDown from "../../../../private/general.components/input.components/select.dropdown.component/select.dropdown.component";
import { NavigationMenuItem } from "../schemas/navigation.menu.schema";
import CSSPropertyEditor from "../../../../private/general.components/input.components/css.property.editor.component/css.property.editor.component";

interface NavigationMenuItemDetailViewProps {
  menuItem: NavigationMenuItem;
  widgetStore?: WidgetStore;
  selectedWidgetID?: string;
}

const NavigationMenuItemDetailView = ({
  menuItem,
  widgetStore,
  selectedWidgetID,
}: NavigationMenuItemDetailViewProps): JSX.Element => {
  const actionTypeOptions = [
    {
      value: "navigate_to_view",
      label: "Navigate to view",
    },
    {
      value: "navigate_to_page",
      label: "Navigate to page",
    },
  ];

  return (
    <div>
      <CollapsibleSection title="Content">
        <TextInput
          label="Label"
          value={menuItem?.label}
          className={defaultStyles.mb10}
          onValueChange={(value) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<NavigationMenuItem>({
                widgetID: selectedWidgetID ?? "",
                optionName: "items",
                identifierField: "id",
                identifierValue: menuItem.id,
                updatedProperties: {
                  label: value as string,
                },
              });
            }
          }}
        />

        <SelectDropDown
          key={menuItem?.actionType}
          label="Action Type"
          selectedItem={menuItem.actionType}
          items={actionTypeOptions ?? []}
          className={defaultStyles.mb20}
          onChange={(item) => {
            if (item?.value != null) {
              widgetStore?.updateWidgetOptionArrayItem<NavigationMenuItem>({
                widgetID: selectedWidgetID ?? "",
                optionName: "items",
                identifierField: "id",
                identifierValue: menuItem.id,
                updatedProperties: {
                  actionType: item.value as any,
                },
              });
            }
          }}
        />

        <TextInput
          label="Target View ID"
          value={menuItem?.targetID}
          className={defaultStyles.mb20}
          onValueChange={(value) => {
            if (value != null) {
              widgetStore?.updateWidgetOptionArrayItem<NavigationMenuItem>({
                widgetID: selectedWidgetID ?? "",
                optionName: "items",
                identifierField: "id",
                identifierValue: menuItem.id,
                updatedProperties: {
                  targetID: value as string,
                },
              });
            }
          }}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Style">
        <CSSPropertyEditor
          label="Menu Item Styles"
          onChange={(properties: Record<string, string>) => {
            widgetStore?.updateWidgetOptionArrayItem<NavigationMenuItem>({
              widgetID: selectedWidgetID ?? "",
              optionName: "items",
              identifierField: "id",
              identifierValue: menuItem.id,
              updatedProperties: {
                naviationMenuItemStyles: properties,
              },
            });
          }}
          initialProperties={
            menuItem.naviationMenuItemStyles as Record<string, string>
          }
        />
      </CollapsibleSection>
    </div>
  );
};

export default NavigationMenuItemDetailView;
