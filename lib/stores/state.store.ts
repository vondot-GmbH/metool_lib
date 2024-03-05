import { makeAutoObservable, values } from "mobx";
import { PubSubProvider } from "../provider/pub.sub.provider";
import { updateOptionAtPath } from "../globals/helpers/state.helper";
import { RestQuery } from "../schemas/query.schemas/query.schema";
import { queryExecutor } from "../provider/http/http.rest.query.client";

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

export interface Dependency {
  field: string;
  selector: string;
  widgetID: string;
  stateKeys: string[];
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

  getStatesForEntity(
    selector: StateSelector,
    entityID: string
  ): Record<string, any> {
    const states: Record<string, any> = {};
    const prefix = `${selector}.${entityID}.`;

    this.globalStates.forEach((value, key) => {
      if (key.startsWith(prefix)) {
        const stateKey = key.substring(prefix.length);
        states[stateKey] = value;
      }
    });

    return states;
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
        this.globalStates.forEach((_, key) => {
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

    // Durchlaufe jede Abhängigkeit
    for (const dependency of dependencies) {
      const { field, selector, widgetID: depWidgetID, stateKeys } = dependency;

      // Abonnement für die Zustandsänderung erstellen
      this.subscribeToStateValue(
        selector as StateSelector,
        depWidgetID,
        stateKeys,
        (newValue) => {
          // Aktualisiere die Option basierend auf dem Feldpfad
          const updatedOptions = updateOptionAtPath(
            JSON.parse(JSON.stringify(options)), // Tiefenkopie, um Referenzen zu vermeiden
            field,
            newValue
          );

          // Rufe das Update-Callback mit den aktualisierten Optionen auf
          updateCallback(updatedOptions);
        }
      );
    }

    // Initialisiere statische und aufgelöste dynamische Optionen als State
    this.initializeOptionsAsState(widgetID, options, dependencies);

    // Initialisiere zusätzliche States, falls vorhanden
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

    console.log("all states logged::::");
    console.log(JSON.stringify(this.globalStates));
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
      ({ field, selector, widgetID: depWidgetID, stateKeys }) => {
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
      if (query?._id == null) continue;

      console.log("executeAndProcessRestQueries: ", JSON.stringify(query));

      const response = await queryExecutor.executeRestQuery(query, {});

      console.log("response-------", response);

      console.log("query._id", query._id);

      if (response) {
        this.setStateValue(StateSelector.QUERIES, query._id, "data", response);
        this.setStateValue(StateSelector.QUERIES, query._id, "status", 200);
      }
    }
  }
}

export default StateStore;
