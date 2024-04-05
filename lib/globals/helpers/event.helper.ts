import NavigationStore from "../../stores/navigation.store";
import StateStore, { StateSelector } from "../../stores/state.store";
import { WidgetEvent } from "../interfaces/widget.option.interface";
import { ActionType, EventType } from "../enums/widget.enum";
import {
  NavigationActionType,
  NavigationParams,
} from "../interfaces/navigation.interface";
import { extractDynamicPatterns, isValidStateSyntax } from "./state.helper";

export const handleWidgetEvent = (args: {
  widgetOptions: Record<string, any>;
  eventType: EventType;
  navigationStore?: NavigationStore;
  stateStore?: StateStore;
}): void => {
  const { widgetOptions, eventType, navigationStore, stateStore } = args;

  // cehck if events are defined for the widget
  if (widgetOptions?.events == null || widgetOptions?.events?.length === 0) {
    return;
  }

  // loop through all the events and execute them based on the event type
  for (const event of widgetOptions.events) {
    if (event?.eventType === eventType) {
      // handle the event based on the event type
      processWidgetEvent({
        widgetEvent: event,
        navigationStore,
        stateStore,
      });
    }
  }
};

const processWidgetEvent = (args: {
  widgetEvent: WidgetEvent;
  navigationStore?: NavigationStore;
  stateStore?: StateStore;
}): void => {
  const { widgetEvent, navigationStore, stateStore } = args;

  // return if no actions are defined
  if (widgetEvent?.actions == null || widgetEvent?.actions?.length === 0)
    return;

  // loop through all the actions and execute them based on the action type
  for (const action of widgetEvent.actions) {
    switch (action.actionType as ActionType) {
      case ActionType.NAVIGATE: {
        // resolve the navigation params if dynamic patterns are found
        const resolvedParams = resolveNavigationParams(
          action?.payload?.params,
          stateStore
        );

        const navigationParams: NavigationParams = {
          ...action?.payload,
          params: resolvedParams,
        };

        // handle the navigation event
        handleNavigationEvent({
          navigationParams,
          navigationStore,
        });
        break;
      }

      default: {
        break;
      }
    }
  }
};

const handleNavigationEvent = (args: {
  navigationParams: NavigationParams;
  navigationStore?: NavigationStore;
}): void => {
  const { navigationParams, navigationStore } = args;

  // return if no actions type for navigation is defined
  if (navigationParams?.actionType == null) return;

  // handle the navigation based on the action type
  switch (navigationParams?.actionType as NavigationActionType) {
    case NavigationActionType.NAV_TO_PAGE:
    case NavigationActionType.NAV_TO_VIEW: {
      navigationStore?.navigate(navigationParams);
      break;
    }

    case NavigationActionType.NAV_BACK: {
      navigationStore?.goBack();
      break;
    }

    case NavigationActionType.NAV_FORWARD: {
      navigationStore?.goForward();
      break;
    }

    default: {
      break;
    }
  }
};

const resolveNavigationParams = (
  params: Record<string, any>,
  stateStore?: StateStore
): NavigationParams => {
  const resolvedParams: any = {};

  for (const key in params) {
    const value = params[key];

    // check if the value is a string and is a valid state syntax
    if (typeof value === "string" && isValidStateSyntax(value)) {
      const dynamicPatterns = extractDynamicPatterns({
        key,
        value,
      });

      // check if 1 or more dynamic patterns are found an take the first item
      if (dynamicPatterns == null || dynamicPatterns.length === 0) {
        resolvedParams[key] = value;
        continue;
      }

      const { selector, identifierID, stateKeys } = dynamicPatterns[0];

      resolvedParams[key] = stateStore?.getStateValue(
        selector as StateSelector,
        identifierID,
        stateKeys.join(".")
      );
    } else {
      resolvedParams[key] = value;
    }
  }

  return resolvedParams as NavigationParams;
};
