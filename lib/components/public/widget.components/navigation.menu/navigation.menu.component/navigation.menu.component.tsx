import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import NavigationStore from "../../../../../stores/navigation.store";
import styles from "./navigation.menu.component.module.scss";
import StateStore from "../../../../../stores/state.store";

export interface NavigationMenuItem {
  id: string;
  label: string;
  actionType: "navigate_to_view" | "navigate_to_page";
  targetID: string;
}

interface NavigationWidgetOptions {
  items: NavigationMenuItem[];
  orientation: "vertical" | "horizontal";
}

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
}: NavigationWidgetProps) => {
  const widgetOptions: NavigationWidgetOptions =
    widgetStore?.getAllOptionsForWidget(widgetID);

  const handleNavigation = (targetViewID: string, actionType: string) => {
    // TODO only for testing purposes
    if (targetViewID || actionType === "navigate_to_view") {
      navigationStore?.navigateToView(targetViewID);
    }
  };

  return (
    <div
      className={`${styles.navigationWidget} ${
        widgetOptions.orientation === "horizontal"
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
