/**
 * Transforms MongoDB objects by converting _id to id
 * @param {Object|Array} data - MongoDB object or array of objects
 * @returns {Object|Array} - Transformed object or array with id instead of _id
 */
export const transformMongoId = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => transformMongoId(item));
  }

  if (data && typeof data === 'object' && data._id) {
    const { _id, ...rest } = data;
    return {
      id: _id.toString(),
      ...rest,
    };
  }

  return data;
};

/**
 * Transforms MongoDB response by converting _id to id recursively
 * This handles nested objects and arrays as well
 * @param {any} data - MongoDB data (object, array, or primitive)
 * @returns {any} - Transformed data with id instead of _id
 */
export const transformMongoData = (data) => {
  if (data == null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformMongoData(item));
  }

  if (typeof data === 'object' && '_id' in data) {
    const { _id, ...rest } = data;
    return {
      id: _id.toString(),
      ...rest,
    };
  }

  return data;
};
