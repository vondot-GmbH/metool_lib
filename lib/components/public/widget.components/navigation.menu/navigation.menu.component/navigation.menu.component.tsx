import { inject, observer } from "mobx-react";
import WidgetStore from "../../../../../stores/widget.store";
import NavigationStore from "../../../../../stores/navigation.store";
import styles from "./navigation.menu.component.module.scss";
import StateStore, { StateSelector } from "../../../../../stores/state.store";
import {
  NavigationMenuItem,
  NavigationMenuOptions,
} from "../schemas/navigation.menu.schema";
import { useEffect } from "react";
import { handleWidgetEvent } from "../../../../../globals/helpers/event.helper";
import { EventType } from "../../../../../globals/enums/widget.enum";
import classNames from "classnames";

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

  const navigationWidgetClassNames = classNames(styles.navigationWidget, {
    [styles.horizontal]: widgetOptions?.orientation === "horizontal",
    [styles.vertical]: widgetOptions?.orientation === "vertical",
  });

  // TODO hardcoded for FIBO
  const getItemClassNames = (item: NavigationMenuItem) => {
    return classNames(styles.navigationItem, {
      [styles.navigationItemActive]: isViewActive(item),
    });
  };

  const currentViewID = stateStore?.getStateValue(
    StateSelector.NAVIGATION,
    "currentView",
    "targetID"
  );

  useEffect(() => {
    const analized = widgetStore?.getAnalyzedWidgetOptions(widgetID);
    if (!analized) return;

    // TODO create a better solution for this
    stateStore?.initializeDynamicOptions(widgetID, analized, () => {}, {});
  }, []);

  const handleOnClick = (item: NavigationMenuItem) => {
    handleWidgetEvent({
      widgetOptions: item,
      eventType: EventType.ON_CLICK_ITEM,
      navigationStore,
      stateStore,
    });
  };

  const isViewActive = (item: NavigationMenuItem) => {
    const eventTargetID = item.events?.find(
      (event) => event.eventType === EventType.ON_CLICK_ITEM
    )?.actions[0].payload?.targetID;

    return eventTargetID === currentViewID;
  };

  return (
    <div
      className={navigationWidgetClassNames}
      style={{ ...widgetOptions?.navigationMenuItemWrapperStyles }}
    >
      {widgetOptions?.items?.map((item, i) => (
        <button
          key={item.id}
          // TODO Implement the active state
          className={getItemClassNames(item)}
          style={{ ...widgetOptions?.items[i]?.naviationMenuItemStyles }}
          onClick={() => handleOnClick(item)}
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
