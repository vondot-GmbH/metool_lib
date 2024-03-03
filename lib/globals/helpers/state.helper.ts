export const isValidStateSyntax = (value: string): boolean => {
  return /\{\{(.+?)\}\}/.test(value);
};

// returns a set of dependencies for a given options object by recursively searching for state syntax
export const searchForDependencies = (
  options: any,
  dependencies: Set<string>
) => {
  if (typeof options === "object" && options !== null) {
    Object.entries(options).forEach(([, value]) => {
      if (typeof value === "string" && isValidStateSyntax(value)) {
        dependencies.add(value);
      } else if (typeof value === "object") {
        // Recursively search for dependencies in nested objects
        searchForDependencies(value, dependencies);
      }
    });
  }
};

export const extractDependencies = (options: any): Set<string> => {
  const dependencies = new Set<string>();
  searchForDependencies(options, dependencies);
  return dependencies;
};
