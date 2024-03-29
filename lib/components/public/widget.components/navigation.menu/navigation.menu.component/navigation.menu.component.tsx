import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import NavigationStore from "../../../../../stores/navigation.store";
import styles from "./navigation.menu.component.module.scss";
import StateStore from "../../../../../stores/state.store";
import { NavigationMenuOptions } from "../schemas/navigation.menu.schema";
import { useEffect } from "react";

interface NavigationWidgetProps {
  widgetID: string;
  widgetStore?: WidgetStore;
  stateStore?: StateStore;
  navigationStore?: NavigationStore;
}

const NavigationWidget = ({
  widgetID,
  widgetStore,
  navigationStore,
  stateStore,
}: NavigationWidgetProps) => {
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
    >
      {widgetOptions?.items?.map((item) => (
        <button
          key={item.id}
          className={styles.navigationItem}
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
)(observer(NavigationWidget));
