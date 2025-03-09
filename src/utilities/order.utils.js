import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import collections from '../data/mongo.js';

/**
 * Generates a random tracking code for orders
 * @returns {string} A random 8-character hexadecimal tracking code in uppercase
 */
export const generateTrackingCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

/**
 * Validates order items by checking their existence, stock availability, and calculating the total price
 * @param {Array} items - Array of order items with itemId and pieces properties
 * @returns {Object} Object containing validation result with properties:
 *   - valid {boolean} - Whether the items are valid
 *   - message {string} - Error message if validation fails
 *   - validatedItems {Array} - Processed items with details if validation succeeds
 *   - total {number} - Total price of all items if validation succeeds
 */
export const validateOrderItems = async (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return { valid: false, message: 'Order must contain at least one item' };
  }

  let total = 0;
  const validatedItems = [];

  for (const orderItem of items) {
    if (!orderItem.item || !orderItem.pieces || orderItem.pieces <= 0) {
      return { valid: false, message: 'Invalid item format in order' };
    }

    try {
      const item = await collections.clothingItems.findOne({ _id: new ObjectId(String(orderItem.item.id)) });

      if (!item) {
        return { valid: false, message: `Item with ID ${orderItem.itemId} not found` };
      }

      if (item.stock < orderItem.pieces) {
        return { valid: false, message: `Not enough stock for item ${item.title}` };
      }

      total += item.price * orderItem.pieces;
      validatedItems.push({
        item: {
          id: item._id,
          code: item.code,
          title: item.title,
          price: item.price,
          size: item.size,
          type: item.type,
          image: item.image,
        },
        pieces: orderItem.pieces,
        subtotal: item.price * orderItem.pieces,
      });
    } catch (error) {
      return { valid: false, message: 'Invalid item ID format' };
    }
  }

  return { valid: true, validatedItems, total };
};
