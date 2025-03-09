/**
 * Cleans a search parameter object by removing keys with undefined, null, or empty string values.
 * @param params The object to clean
 * @returns A new object with invalid values removed
 */
export function cleanSearchParams<T extends Record<string, unknown>>(params?: T): Partial<T> {
  if (!params) return {};

  return Object.entries(params).reduce((acc, [key, value]) => {
    // Skip undefined, null, or empty string values
    if (value === undefined || value === null || value === '') {
      return acc;
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {} as Partial<T>);
}
