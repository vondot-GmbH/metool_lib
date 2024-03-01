export const isValidStateSyntax = (value: string): boolean => {
  return /\{\{\s*\w+\.\w+\s*\}\}/.test(value); // /\{\{(.+?)\}\}/.test(value);
};

export const extractWidgetIdAndStateKey = (value: string): string[] => {
  const pattern = /\{\{(.+?)\}\}/;
  const match = pattern.exec(value);
  return match && match[1] ? match[1].split(".") : [];
};

// returns a set of dependencies for a given options object by recursively searching for state syntax
export const searchForDependencies = (
  options: any,
  dependencies: Set<string>
) => {
  if (typeof options === "object" && options !== null) {
    Object.entries(options).forEach(([, value]) => {
      if (typeof value === "string" && isValidStateSyntax(value)) {
        const [widgetID, stateKey] = extractWidgetIdAndStateKey(value);
        const depKey = generateDependencyKey(widgetID, stateKey);
        dependencies.add(depKey);
      } else if (typeof value === "object") {
        // Recursively search for dependencies in nested objects
        searchForDependencies(value, dependencies);
      }
    });
  }
};

// returns a string key for a given widgetID and stateKey
export const generateDependencyKey = (widgetID: string, stateKey: string) => {
  return `${widgetID}.${stateKey}`;
};

export const extractDependencies = (options: any): Set<string> => {
  const dependencies = new Set<string>();
  searchForDependencies(options, dependencies);
  return dependencies;
};
