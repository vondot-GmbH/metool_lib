import { makeAutoObservable } from "mobx";
import { PubSubProvider } from "../provider/pub.sub.provider";

interface WidgetState {
  [key: string]: any;
}

interface PendingSubscription {
  stateKey: string;
  callback: (value: any) => void; // Callback function to execute when state changes
}

export class StateStore {
  private widgetStates: Map<string, WidgetState> = new Map();
  private pubSub: PubSubProvider = PubSubProvider.getInstance();
  private pendingSubscriptions: PendingSubscription[] = []; // List of subscriptions waiting for widget initialization

  constructor() {
    makeAutoObservable(this);
  }

  // Initialize states for a widget with given ID and a set of initial state values
  initializeWidgetStates(widgetID: string, initialStates: Record<string, any>) {
    for (const [key, value] of Object.entries(initialStates)) {
      this.setWidgetStateValue(widgetID, key, value);
    }
    // Process any subscriptions that were pending this widget's initialization
    this.processPendingSubscriptions(widgetID);
  }

  // Sets a specific state value for a widget and publishes the change to subscribers
  setWidgetStateValue(widgetID: string, key: string, value: any) {
    const stateKey = this.generateStateKey(widgetID, key);
    this.widgetStates.set(stateKey, value);
    this.pubSub.publish(`widgetStateChange:${stateKey}`, value);
  }

  // Retrieves a specific state value for a widget
  getWidgetStateValue(widgetID: string, key: string): any {
    const stateKey = this.generateStateKey(widgetID, key);
    return this.widgetStates.get(stateKey);
  }

  // Retrieves all state values for a widget as a key-value pair
  getAllWidgetStates(widgetID: string | undefined): Record<string, any> {
    if (!widgetID) {
      return {};
    }

    const widgetStates: Record<string, any> = {};

    this.widgetStates.forEach((value, key) => {
      // check if the state key is for the given widget
      if (key.startsWith(`${widgetID}.`)) {
        // ectract the state key from the composite key
        const stateKey = key.split(".")[1];
        widgetStates[stateKey] = value;
      }
    });

    return widgetStates;
  }

  // Subscribes a callback to changes in a specific widget state value
  subscribeToWidgetStateValue(
    widgetID: string,
    key: string,
    callback: (value: any) => void
  ) {
    const stateKey = this.generateStateKey(widgetID, key);

    if (this.widgetStates.has(stateKey)) {
      this.pubSub.subscribe(`widgetStateChange:${stateKey}`, callback);
    } else {
      // If the state is not yet initialized, add the subscription to pending subscriptions
      this.pendingSubscriptions.push({ stateKey, callback });
    }
  }

  // Processes pending subscriptions for a specific widget after its initialization
  processPendingSubscriptions(widgetID: string) {
    const subscriptionsToProcess = this.pendingSubscriptions.filter(
      (subscription) => subscription.stateKey.startsWith(widgetID + ".")
    );

    for (const subscription of subscriptionsToProcess) {
      this.pubSub.subscribe(
        `widgetStateChange:${subscription.stateKey}`,
        subscription.callback
      );
    }

    // Remove processed subscriptions from the list of pending subscriptions
    this.pendingSubscriptions = this.pendingSubscriptions.filter(
      (subscription) => !subscriptionsToProcess.includes(subscription)
    );
  }

  // Generates a composite key for storing individual widget state values
  private generateStateKey(widgetID: string, key: string): string {
    return `${widgetID}.${key}`;
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

          for (const { targetWidgetID, stateKey } of dynamicPatterns) {
            this.subscribeToWidgetStateValue(
              targetWidgetID,
              stateKey,
              (newValue) => {
                const updatedOptions = JSON.parse(JSON.stringify(optionsCopy));
                updatedOptions[key] = this.replaceDynamicPlaceholder(
                  updatedOptions[key],
                  targetWidgetID,
                  stateKey,
                  newValue
                );
                updateCallback(updatedOptions);
              }
            );
          }
        } else if (typeof options[key] === "object") {
          iterateOptions(options[key]);
        }
      }
    };

    iterateOptions(optionsCopy);
  }

  extractDynamicPatterns(value: string) {
    const pattern = /\{\{\s*(\w+)\.(\w+)\s*\}\}/g;
    let match;
    const dynamicPatterns = [];

    while ((match = pattern.exec(value)) !== null) {
      dynamicPatterns.push({
        targetWidgetID: match[1],
        stateKey: match[2],
      });
    }

    return dynamicPatterns;
  }

  replaceDynamicPlaceholder(
    value: string,
    targetWidgetID: string,
    stateKey: string,
    newValue: any
  ) {
    const placeholder = `{{${targetWidgetID}.${stateKey}}}`;

    if (value.includes(placeholder)) {
      let replacementValue;

      if (typeof newValue === "object" && newValue !== null) {
        replacementValue = JSON.stringify(newValue);
      } else {
        replacementValue = newValue;
      }

      while (value.includes(placeholder)) {
        value = value.replace(placeholder, replacementValue);
      }
    }

    return value;
  }
}

export default StateStore;
