import WidgetStore from "../../../../../../stores/widget.store";
import TextInput from "../../../../../private/general.components/input.components/text.input.component/text.input.component";
import defaultStyles from "../../../../../../styles/index.module.scss";
import CollapsibleSection from "../../../../../private/general.components/collapsible.section.component/collapsible.section.component";
import { NavigationMenuItem } from "../../schemas/navigation.menu.schema";
import CSSPropertyEditor from "../../../../../private/general.components/input.components/css.property.editor.component/css.property.editor.component";
import PageStore from "../../../../../../stores/page.store";
import ViewStore from "../../../../../../stores/view.store";
import { inject, observer } from "mobx-react";
import NavigationConfigurator from "../../../../../private/general.components/input.components/navigation.configurator.component/navigation.configurator.component";

interface NavigationMenuItemDetailViewProps {
  menuItem: NavigationMenuItem;
  widgetStore?: WidgetStore;
  pageStore?: PageStore; // TODO Maby remove unused stores
  viewStore?: ViewStore;
  selectedWidgetID?: string;
}

const NavigationMenuItemDetailView = ({
  menuItem,
  widgetStore,
  selectedWidgetID,
}: NavigationMenuItemDetailViewProps): JSX.Element => {
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

        <NavigationConfigurator
          onNavigationParamsChange={(params) => {
            widgetStore?.updateWidgetOptionArrayItem<NavigationMenuItem>({
              widgetID: selectedWidgetID ?? "",
              optionName: "items",
              identifierField: "id",
              identifierValue: menuItem.id,
              updatedProperties: {
                navigationParams: params,
              },
            });
          }}
          initialParams={menuItem.navigationParams}
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

export default inject(
  "widgetStore",
  "pageStore",
  "viewStore"
)(observer(NavigationMenuItemDetailView));
