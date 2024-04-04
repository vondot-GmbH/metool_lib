import StateStore, {
  Dependency,
  ResolvedDependency,
  StateSelector,
} from "../../stores/state.store";

export const generateStateKey = (
  selector: StateSelector,
  identifierID: string,
  ...keys: string[]
): string => {
  return `${selector}.${identifierID}.${keys.join(".")}`;
};

export const isValidStateSyntax = (value: string): boolean => {
  if (value?.includes("{{") && value?.includes("}}")) {
    return true;
  }
  return false;
};

interface WidgetOptions {
  [key: string]: any;
}

interface DependenciesResult {
  dependencies: Dependency[];
  nonDependencies: any;
}

export const extractDynamicPatterns = (args: {
  key: string;
  value: string;
}): Dependency[] => {
  const pattern = /\{\{\s*(\w+)\.(\w+)\.([\w\.]+)\s*\}\}/g;
  let match;
  const dynamicPatterns: Dependency[] = [];

  while ((match = pattern.exec(args.value)) !== null) {
    dynamicPatterns.push({
      field: args.key,
      selector: match[1],
      identifierID: match[2],
      stateKeys: match[3].split("."),
    });
  }

  return dynamicPatterns;
};

const isDependency = (value: any): boolean =>
  typeof value === "string" && isValidStateSyntax(value);

export const addDependency = (
  dependencies: Dependency[],
  value: string,
  path: string[]
) => {
  const extractedDependencies = extractDynamicPatterns({
    key: path.join("."),
    value,
  });
  dependencies.push(...extractedDependencies);
};

export const extractDependenciesAndNonDependencies = (
  object: any,
  path: string[] = []
): DependenciesResult => {
  if (object == null) {
    return { dependencies: [], nonDependencies: {} };
  }

  const dependencies: Dependency[] = [];
  const nonDependencies: WidgetOptions = Array.isArray(object) ? [] : {};

  Object.entries(object).forEach(([key, value]) => {
    const currentPath = [...path, key];
    if (isDependency(value)) {
      addDependency(dependencies, value as any, currentPath);
    } else if (typeof value === "object" && value !== null) {
      const { dependencies: childDeps, nonDependencies: childNonDeps } =
        extractDependenciesAndNonDependencies(value, currentPath);
      dependencies.push(...childDeps);
      if (
        Object.keys(childNonDeps).length > 0 ||
        (Array.isArray(childNonDeps) && childNonDeps.length > 0)
      ) {
        nonDependencies[key] = childNonDeps;
      }
    } else {
      nonDependencies[key] = value;
    }
  });

  return { dependencies, nonDependencies };
};

export const updateOptionAtPath = (
  options: any,
  path: string,
  newValue: any
): any => {
  const segments = path.split(".");
  let current = options;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    if (!(segment in current)) {
      current[segment] = {};
    }
    current = current[segment];
  }

  current[segments[segments.length - 1]] = newValue;
  return options;
};

export const resolveDependencies = (
  dependencies: Dependency[],
  stateStore: StateStore
): ResolvedDependency[] => {
  return dependencies
    .map((dependency) => {
      const { selector, identifierID, stateKeys } = dependency;
      const placeholder = `${selector}.${identifierID}.${stateKeys.join(".")}`;

      const resolvedValue = resolveNestedStateValue(
        stateStore,
        selector as StateSelector,
        identifierID,
        stateKeys
      );

      return {
        dependency,
        resolvedDependency: {
          dependency: placeholder,
          resolvedValue,
        },
      };
    })
    .filter(
      (resolvedDependency) =>
        resolvedDependency.resolvedDependency.resolvedValue !== undefined
    );
};
export function resolveNestedStateValue(
  stateStore: StateStore,
  selector: StateSelector,
  identifierID: string,
  stateKeys: string[]
): any {
  let resolvedValue = stateStore.globalStates.get(
    generateStateKey(selector, identifierID, stateKeys[0])
  );

  if (stateKeys.length > 1 && typeof resolvedValue === "object") {
    for (let i = 1; i < stateKeys.length; i++) {
      resolvedValue = resolvedValue[stateKeys[i]];
      if (resolvedValue === undefined) {
        break;
      }
    }
  }

  return resolvedValue;
}
