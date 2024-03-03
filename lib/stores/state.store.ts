import { makeAutoObservable } from "mobx";
import { PubSubProvider } from "../provider/pub.sub.provider";

export enum StateSelector {
  WIDGETS = "widgets",
  QUERIES = "queries",
}

interface WidgetState {
  [key: string]: any;
}

interface PendingSubscription {
  selector: StateSelector;
  widgetID: string;
  stateKeys: string[];
  callback: (value: any) => void;
}

export class StateStore {
  private globalStates: Map<string, WidgetState> = new Map();
  private pubSub: PubSubProvider = PubSubProvider.getInstance();
  private pendingSubscriptions: PendingSubscription[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  private generateStateKey(
    selector: StateSelector,
    widgetID: string,
    ...keys: string[]
  ): string {
    return `${selector}.${widgetID}.${keys.join(".")}`;
  }

  initializeStates(
    initialStateConfigs: {
      selector: StateSelector;
      widgetID: string;
      initialStates: Record<string, any>;
    }[]
  ) {
    initialStateConfigs.forEach(({ selector, widgetID, initialStates }) => {
      Object.entries(initialStates).forEach(([key, value]) => {
        this.setStateValue(selector, widgetID, key, value);
      });
      this.processPendingSubscriptions(selector, widgetID);
    });
  }

  setStateValue(
    selector: StateSelector,
    widgetID: string,
    key: string,
    value: any
  ) {
    const stateKey = this.generateStateKey(selector, widgetID, key);
    this.globalStates.set(stateKey, value);
    this.pubSub.publish(`stateChange:${stateKey}`, value);
  }

  getWidgetStateValue(
    selector: StateSelector,
    widgetID: string,
    key: string
  ): any {
    const stateKey = this.generateStateKey(selector, widgetID, key);
    return this.globalStates.get(stateKey);
  }

  getAllWidgetStates(
    selector: StateSelector,
    widgetID: string
  ): Record<string, any> {
    const widgetStates: Record<string, any> = {};
    const prefix = `${selector}.${widgetID}.`;

    this.globalStates.forEach((value, key) => {
      if (key.startsWith(prefix)) {
        const stateKey = key.substring(prefix.length);
        widgetStates[stateKey] = value;
      }
    });

    return widgetStates;
  }

  subscribeToStateValue(
    selector: StateSelector,
    widgetID: string,
    keys: string[],
    callback: (value: any) => void
  ) {
    const stateKey = this.generateStateKey(selector, widgetID, ...keys);

    if (this.globalStates.has(stateKey)) {
      this.pubSub.subscribe(`stateChange:${stateKey}`, callback);
    } else {
      this.pendingSubscriptions.push({
        selector,
        widgetID,
        stateKeys: keys,
        callback,
      });
    }
  }

  processPendingSubscriptions(selector: StateSelector, widgetID: string) {
    const prefix = `${selector}.${widgetID}.`;
    const subscriptionsToProcess = this.pendingSubscriptions.filter(
      (subscription) =>
        this.generateStateKey(
          subscription.selector,
          subscription.widgetID,
          ...subscription.stateKeys
        ).startsWith(prefix)
    );

    subscriptionsToProcess.forEach((subscription) => {
      const stateKey = this.generateStateKey(
        subscription.selector,
        subscription.widgetID,
        ...subscription.stateKeys
      );
      this.pubSub.subscribe(`stateChange:${stateKey}`, subscription.callback);
    });

    this.pendingSubscriptions = this.pendingSubscriptions.filter(
      (subscription) => !subscriptionsToProcess.includes(subscription)
    );
  }

  extractDynamicPatterns(value: string) {
    const pattern = /\{\{\s*(\w+)\.(\w+)\.([\w\.]+)\s*\}\}/g;
    let match;
    const dynamicPatterns = [];

    while ((match = pattern.exec(value)) !== null) {
      dynamicPatterns.push({
        selector: match[1],
        widgetID: match[2],
        stateKeys: match[3].split("."),
      });
    }

    return dynamicPatterns;
  }

  replaceDynamicPlaceholder(
    value: string,
    placeholderDetails: {
      selector: string;
      widgetID: string;
      stateKeys: string[];
    },
    newValue: any
  ) {
    const placeholder = `{{${placeholderDetails.selector}.${
      placeholderDetails.widgetID
    }.${placeholderDetails.stateKeys.join(".")}}}`;

    if (value.includes(placeholder)) {
      const replacementValue =
        typeof newValue === "object" && newValue !== null
          ? JSON.stringify(newValue)
          : newValue;

      while (value.includes(placeholder)) {
        value = value.replace(placeholder, replacementValue);
      }
    }

    return value;
  }

  initializeDynamicOptions(
    widgetOptions: Record<string, any>,
    updateCallback: (options: Record<string, any>) => void
  ) {
    const optionsCopy = JSON.parse(JSON.stringify(widgetOptions));

    const iterateOptions = (options: Record<string, any>) => {
      for (const key of Object.keys(options)) {
        if (typeof options[key] === "string") {
          const dynamicPatterns = this.extractDynamicPatterns(options[key]);

          dynamicPatterns.forEach(({ selector, widgetID, stateKeys }) => {
            this.subscribeToStateValue(
              selector as StateSelector,
              widgetID,
              stateKeys,
              (newValue) => {
                const updatedOptions = JSON.parse(JSON.stringify(optionsCopy));
                updatedOptions[key] = this.replaceDynamicPlaceholder(
                  updatedOptions[key],
                  { selector, widgetID, stateKeys },
                  newValue
                );
                updateCallback(updatedOptions);
              }
            );
          });
        } else if (typeof options[key] === "object") {
          iterateOptions(options[key]);
        }
      }
    };

    iterateOptions(optionsCopy);
  }
}

export default StateStore;
