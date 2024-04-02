import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import NavigationStore from "../../../../../stores/navigation.store";
import styles from "./navigation.menu.component.module.scss";
import StateStore from "../../../../../stores/state.store";
import { NavigationMenuOptions } from "../schemas/navigation.menu.schema";
import { useEffect } from "react";

interface NavigationMenuWidgetProps {
  widgetID: string;
  widgetStore?: WidgetStore;
  stateStore?: StateStore;
  navigationStore?: NavigationStore;
}

const NavigationMenuWidget = ({
  widgetID,
  widgetStore,
  navigationStore,
  stateStore,
}: NavigationMenuWidgetProps) => {
  const widgetOptions: NavigationMenuOptions =
    widgetStore?.getAllOptionsForWidget(widgetID);

  useEffect(() => {
    const analized = widgetStore?.getAnalyzedWidgetOptions(widgetID);
    if (!analized) return;

    // TODO create a better solution for this
    stateStore?.initializeDynamicOptions(widgetID, analized, () => {}, {});
  }, []);

  // TODO only for testing purposes
  const handleNavigation = (tagetID: string, actionType: string) => {
    if (tagetID || actionType === "navigate_to_view") {
      navigationStore?.navigateToView(tagetID);
    } else if (tagetID || actionType === "navigate_to_page") {
      navigationStore?.navigateToPage(tagetID);
    }
  };

  return (
    <div
      className={`${styles.navigationWidget} ${
        widgetOptions?.orientation === "horizontal"
          ? styles.horizontal
          : styles.vertical
      }`}
      style={{ ...widgetOptions?.navigationMenuItemWrapperStyles }}
    >
      {widgetOptions?.items?.map((item, i) => (
        <button
          key={item.id}
          // TODO Implement the active state
          className={styles.navigationItemActive + " " + styles.navigationItem}
          style={{ ...widgetOptions?.items[i]?.naviationMenuItemStyles }}
          onClick={() => handleNavigation(item?.targetID, item?.actionType)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default inject(
  "widgetStore",
  "stateStore",
  "navigationStore"
)(observer(NavigationMenuWidget));
