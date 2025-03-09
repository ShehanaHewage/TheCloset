/**
 * Converts a snake_case string to camelCase
 * @param {string} str - The snake_case string to convert
 * @return {string} The camelCase version of the input string
 */
export function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Transforms all keys in an object from snake_case to camelCase
 * @param {Object} obj - The object whose keys need to be transformed
 * @return {Object} A new object with all keys transformed to camelCase
 */
export function transformKeysToCamel(obj) {
  // Return as is if not an object or if it's null/array
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  // Create a new object to avoid mutating the original
  const camelCaseObj = {};

  // Process each key in the object
  Object.keys(obj).forEach((key) => {
    const camelKey = snakeToCamel(key);

    // Recursively transform nested objects
    camelCaseObj[camelKey] =
      typeof obj[key] === 'object' && obj[key] !== null ? transformKeysToCamel(obj[key]) : obj[key];
  });

  return camelCaseObj;
}

/**
 * Removes specified keys from an object
 * @param {Object} obj - The object to remove keys from
 * @param {...string} keys - The keys to remove from the object
 * @return {Object} A new object without the specified keys
 */
export function removeKeys(obj, ...keys) {
  // Return as is if not an object or if it's null/array
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  // Create a new object to avoid mutating the original
  const result = { ...obj };

  // Remove each specified key
  keys.forEach((key) => {
    delete result[key];
  });

  return result;
}
