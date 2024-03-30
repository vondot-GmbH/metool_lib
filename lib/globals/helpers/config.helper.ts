export const formatThemeVariableLabel = (label: string): string => {
  // Replace underscores with spaces and split the string
  // into words based on capital letters (CamelCase and PascalCase)
  const words = label.replace(/_/g, " ").split(/(?=[A-Z])| /);

  if (words == null) {
    return label;
  }

  // Capitalize the first letter of each word and lowercase the rest
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
