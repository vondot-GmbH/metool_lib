export const isValidStateSyntax = (value: string): boolean => {
  return /\{\{(.+?)\}\}/.test(value);
};

interface WidgetOptions {
  [key: string]: any;
}

interface DependenciesResult {
  dependencies: string[];
  nonDependencies: any;
}

const isDependency = (value: any): boolean =>
  typeof value === "string" && isValidStateSyntax(value);

export const addUnique = (array: string[], item: string) => {
  if (!array.includes(item)) {
    array.push(item);
  }
};

export const extractDependenciesAndNonDependencies = (
  options: any
): DependenciesResult => {
  const dependencies: string[] = [];
  const nonDependencies: WidgetOptions = Array.isArray(options) ? [] : {};

  Object.entries(options).forEach(([key, value]) => {
    if (isDependency(value)) {
      addUnique(dependencies, value as any);
    } else if (typeof value === "object" && value !== null) {
      const { dependencies: childDeps, nonDependencies: childNonDeps } =
        extractDependenciesAndNonDependencies(value);
      childDeps.forEach((dep) => addUnique(dependencies, dep));
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

//! OLD LOGIC

export const extractDependencies = (options: any): string[] => {
  const dependencies: string[] = [];
  const addDependency = (dep: string) => {
    if (!dependencies.includes(dep)) {
      dependencies.push(dep);
    }
  };

  const searchForDependencies = (options: any) => {
    if (typeof options === "object" && options !== null) {
      Object.entries(options).forEach(([, value]) => {
        if (typeof value === "string" && isValidStateSyntax(value)) {
          addDependency(value);
        } else if (typeof value === "object") {
          searchForDependencies(value);
        }
      });
    }
  };

  searchForDependencies(options);
  return dependencies;
};
