export const isDynamicExpression = (value: string): boolean => {
  return /\{\{\s*\w+\.\w+\s*\}\}/.test(value);
};
