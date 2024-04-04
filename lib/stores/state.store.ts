import { makeAutoObservable } from "mobx";
import { PubSubProvider } from "../providers/pub.sub.provider";
import {
  extractDependenciesAndNonDependencies,
  generateStateKey,
  resolveDependencies,
  resolveNestedStateValue,
  updateOptionAtPath,
} from "../globals/helpers/state.helper";
import { RestQuery } from "../schemas/query.schemas/query.schema";
import { queryExecutor } from "../providers/http/http.rest.query.client";
import RootStore from "./root.store";

export enum StateSelector {
  WIDGETS = "widgets",
  QUERIES = "queries",
  NAVIGATION = "navigation",
}

interface WidgetState {
  [key: string]: any;
}

interface PendingSubscription {
  selector: StateSelector;
  identifierID: string;
  stateKeys: string[];
  callback: (value: any) => void;
}

export interface Dependency {
  field: string;
  selector: string;
  identifierID: string;
  stateKeys: string[];
}

export interface ResolvedDependency {
  dependency: Dependency;
  resolvedDependency: {
    dependency: string;
    resolvedValue: any;
  };
}

export class StateStore {
  private _globalStates: Map<string, WidgetState> = new Map();
  private _pubSub: PubSubProvider = PubSubProvider.getInstance();
  private _pendingSubscriptions: PendingSubscription[] = [];

  private stores: RootStore;

  constructor(rootStore: RootStore) {
    this.stores = rootStore;
    makeAutoObservable(this);
  }

  initializeStates(
    initialStateConfigs: {
      selector: StateSelector;
      identifierID: string;
      initialStates: Record<string, any>;
    }[]
  ) {
    initialStateConfigs.forEach(({ selector, identifierID, initialStates }) => {
      Object.entries(initialStates).forEach(([key, value]) => {
        this.setStateValue(selector, identifierID, key, value);
      });
      this.processPendingSubscriptions(selector, identifierID);
    });
  }

  setStateValue(
    selector: StateSelector,
    identifierID: string,
    key: string,
    value: any
  ) {
    const stateKey = generateStateKey(selector, identifierID, key);
    this._globalStates.set(stateKey, value);
    this._pubSub.publish(`stateChange:${stateKey}`, value);
  }

  getStateValue(
    selector: StateSelector,
    identifierID: string,
    key: string
  ): any {
    const splittedKey = key.split(".");
    return resolveNestedStateValue(this, selector, identifierID, splittedKey);
  }

  getStatesForEntity(
    selector: StateSelector,
    entityID: string
  ): Record<string, any> {
    const states: Record<string, any> = {};
    const prefix = `${selector}.${entityID}.`;

    this._globalStates.forEach((value, key) => {
      if (key.startsWith(prefix)) {
        const stateKey = key.substring(prefix.length);
        states[stateKey] = value;
      }
    });

    return states;
  }

  get globalStates(): Map<string, WidgetState> {
    return this._globalStates;
  }

  getStateSummary(): Array<{
    category: string;
    entities: Array<{ id: string; label?: string }>;
  }> {
    const summary: Array<{
      category: string;
      entities: Array<{ id: string; label?: string }>;
    }> = [];

    // Durchlaufen aller Schlüsselwerte von StateSelector
    Object.keys(StateSelector).forEach((selectorKey) => {
      const selector = StateSelector[selectorKey as keyof typeof StateSelector];

      if (typeof selector === "string") {
        const category = selector;
        const entitiesMap: { [key: string]: { id: string; label?: string } } =
          {};

        // Durchlaufen aller globalen States und Hinzufügen, falls sie zur aktuellen Kategorie gehören
        this._globalStates.forEach((_, key) => {
          const [stateSelector, entityID] = key.split(".");
          if (stateSelector === category) {
            // Vermeiden von Duplikaten durch Verwendung einer Map
            entitiesMap[entityID] = { id: entityID, label: entityID };
          }
        });

        // Konvertieren der Map-Werte zurück in ein Array und Hinzufügen zur Zusammenfassung
        const entities = Object.values(entitiesMap);
        if (entities.length > 0) {
          summary.push({ category, entities });
        }
      }
    });

    return summary;
  }

  subscribeToStateValue(
    selector: StateSelector,
    identifierID: string,
    keys: string[],
    callback: (value: any) => void
  ) {
    const stateKey = generateStateKey(selector, identifierID, ...keys);

    if (this._globalStates.has(stateKey)) {
      this._pubSub.subscribe(`stateChange:${stateKey}`, callback);
    } else {
      this._pendingSubscriptions.push({
        selector,
        identifierID,
        stateKeys: keys,
        callback,
      });
    }
  }

  processPendingSubscriptions(selector: StateSelector, identifierID: string) {
    const prefix = `${selector}.${identifierID}.`;
    const subscriptionsToProcess = this._pendingSubscriptions.filter(
      (subscription) =>
        generateStateKey(
          subscription.selector,
          subscription.identifierID,
          ...subscription.stateKeys
        ).startsWith(prefix)
    );

    subscriptionsToProcess.forEach((subscription) => {
      const stateKey = generateStateKey(
        subscription.selector,
        subscription.identifierID,
        ...subscription.stateKeys
      );
      this._pubSub.subscribe(`stateChange:${stateKey}`, subscription.callback);
    });

    this._pendingSubscriptions = this._pendingSubscriptions.filter(
      (subscription) => !subscriptionsToProcess?.includes(subscription)
    );
  }

  initializeDynamicOptions(
    widgetID: string,
    analyzedOptions: { options: any; dependencies: Dependency[] },
    updateCallback: (options: Record<string, any>) => void,
    additionalStates?: Record<string, any>
  ) {
    const { options, dependencies } = analyzedOptions;

    // loop through the dependencies and subscribe to their state changes
    for (const dependency of dependencies) {
      const {
        field,
        selector,
        identifierID: depWidgetID,
        stateKeys,
      } = dependency;

      // create a subscription to the state change
      this.subscribeToStateValue(
        selector as StateSelector,
        depWidgetID,
        stateKeys,
        (newValue) => {
          const updatedOptions = updateOptionAtPath(
            JSON.parse(JSON.stringify(options)),
            field,
            newValue
          );

          // call the callback with the updated options
          updateCallback(updatedOptions);
        }
      );
    }

    // Init additional states if available
    this.initializeOptionsAsState(widgetID, options, dependencies);

    // Init additional states if available
    if (additionalStates) {
      Object.keys(additionalStates).forEach((key) => {
        this.setStateValue(
          StateSelector.WIDGETS,
          widgetID,
          key,
          additionalStates[key]
        );
      });
    }
  }

  private initializeOptionsAsState(
    widgetID: string,
    options: any,
    dependencies: Dependency[]
  ) {
    const dependencyFields = dependencies.map((dep) => dep.field);

    Object.entries(options).forEach(([key, value]) => {
      if (!dependencyFields.includes(key)) {
        this.setStateValue(StateSelector.WIDGETS, widgetID, key, value);
      }
    });

    dependencies.forEach(
      ({ field, selector, identifierID: depWidgetID, stateKeys }) => {
        this.subscribeToStateValue(
          selector as StateSelector,
          depWidgetID,
          stateKeys,
          (newValue) => {
            this.setStateValue(
              StateSelector.WIDGETS,
              widgetID,
              field,
              newValue
            );
          }
        );
      }
    );
  }

  // TODO
  async executeAndProcessRestQueries(queries: RestQuery[]): Promise<void> {
    for (const query of queries) {
      if (query?.queryID == null) continue;
      this.setStateValue(
        StateSelector.QUERIES,
        query.queryID,
        "isLoading",
        true
      );

      const extractedDep = extractDependenciesAndNonDependencies(query);

      const resolvedDependencies = resolveDependencies(
        extractedDep.dependencies,
        this.stores.stateStore
      );

      const resolvedVariables: Record<string, string> = {};

      for (const { resolvedDependency } of resolvedDependencies) {
        resolvedVariables[resolvedDependency.dependency] =
          resolvedDependency.resolvedValue;
      }

      if (query?.queryID == "getUserByID") console.log(resolvedVariables);

      const response = await queryExecutor.executeRestQuery(
        query,
        resolvedVariables,
        this.stores.resourceStore
      );

      if (response) {
        this.setStateValue(
          StateSelector.QUERIES,
          query.queryID,
          "data",
          response
        );
        this.setStateValue(StateSelector.QUERIES, query.queryID, "status", 200);
      }

      // process pending subscriptions
      this.processPendingSubscriptions(StateSelector.QUERIES, query.queryID);
      this.setStateValue(
        StateSelector.QUERIES,
        query.queryID,
        "isLoading",
        false
      );
    }
  }
}

export default StateStore;
