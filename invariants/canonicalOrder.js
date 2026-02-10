/**
 * Canonical Order Model - Runtime Contract
 * 
 * This is the ONLY shape that invariant validators operate on.
 * All platform-specific data must be transformed into this shape
 * before invariants are run.
 * 
 * This module provides:
 * - Documentation of the canonical shape
 * - Runtime validation helpers
 * - Shape checking utilities
 */

/**
 * Validates that an object matches the CanonicalOrder shape.
 * Throws descriptive errors if validation fails.
 * 
 * @param {any} order - The order object to validate
 * @returns {boolean} - true if valid, throws if invalid
 * @throws {Error} - If the order doesn't match the canonical shape
 */
function validateCanonicalOrder(order) {
  if (!order || typeof order !== 'object') {
    throw new Error('CanonicalOrder must be an object');
  }

  // Validate items array
  if (!Array.isArray(order.items)) {
    throw new Error('CanonicalOrder.items must be an array');
  }

  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    if (!item || typeof item !== 'object') {
      throw new Error(`CanonicalOrder.items[${i}] must be an object`);
    }

    const requiredItemFields = ['itemId', 'type', 'quantity', 'unitPrice', 'serviceFee', 'discount', 'subtotal'];
    for (const field of requiredItemFields) {
      if (!(field in item)) {
        throw new Error(`CanonicalOrder.items[${i}].${field} is required`);
      }
    }

    if (typeof item.itemId !== 'string') {
      throw new Error(`CanonicalOrder.items[${i}].itemId must be a string`);
    }
    if (typeof item.type !== 'string') {
      throw new Error(`CanonicalOrder.items[${i}].type must be a string`);
    }
    if (typeof item.quantity !== 'number') {
      throw new Error(`CanonicalOrder.items[${i}].quantity must be a number`);
    }
    if (typeof item.unitPrice !== 'number') {
      throw new Error(`CanonicalOrder.items[${i}].unitPrice must be a number`);
    }
    if (typeof item.serviceFee !== 'number') {
      throw new Error(`CanonicalOrder.items[${i}].serviceFee must be a number`);
    }
    if (typeof item.discount !== 'number') {
      throw new Error(`CanonicalOrder.items[${i}].discount must be a number`);
    }
    if (typeof item.subtotal !== 'number') {
      throw new Error(`CanonicalOrder.items[${i}].subtotal must be a number`);
    }
  }

  // Validate fees
  if (!order.fees || typeof order.fees !== 'object') {
    throw new Error('CanonicalOrder.fees must be an object');
  }
  if (!Array.isArray(order.fees.components)) {
    throw new Error('CanonicalOrder.fees.components must be an array');
  }

  for (let i = 0; i < order.fees.components.length; i++) {
    const fee = order.fees.components[i];
    if (!fee || typeof fee !== 'object') {
      throw new Error(`CanonicalOrder.fees.components[${i}] must be an object`);
    }

    if (typeof fee.id !== 'string') {
      throw new Error(`CanonicalOrder.fees.components[${i}].id must be a string`);
    }
    if (!['revenue', 'deduction', 'pass_through'].includes(fee.category)) {
      throw new Error(`CanonicalOrder.fees.components[${i}].category must be one of: revenue, deduction, pass_through`);
    }
    if (typeof fee.amount !== 'number') {
      throw new Error(`CanonicalOrder.fees.components[${i}].amount must be a number`);
    }
  }

  // Validate totals
  if (!order.totals || typeof order.totals !== 'object') {
    throw new Error('CanonicalOrder.totals must be an object');
  }
  if (!order.totals.declared || typeof order.totals.declared !== 'object') {
    throw new Error('CanonicalOrder.totals.declared must be an object');
  }

  const requiredTotalFields = ['gross', 'discount', 'final'];
  for (const field of requiredTotalFields) {
    if (!(field in order.totals.declared)) {
      throw new Error(`CanonicalOrder.totals.declared.${field} is required`);
    }
    if (typeof order.totals.declared[field] !== 'number') {
      throw new Error(`CanonicalOrder.totals.declared.${field} must be a number`);
    }
  }

  // Validate meta (optional)
  if (order.meta !== undefined) {
    if (typeof order.meta !== 'object' || order.meta === null) {
      throw new Error('CanonicalOrder.meta must be an object or undefined');
    }
    if (order.meta.currency !== undefined && typeof order.meta.currency !== 'string') {
      throw new Error('CanonicalOrder.meta.currency must be a string or undefined');
    }
  }

  return true;
}

/**
 * Canonical Order Shape Documentation
 * 
 * {
 *   items: [
 *     {
 *       itemId: string,           // Unique identifier for the item
 *       type: string,              // Item type (e.g., "product", "service")
 *       quantity: number,          // Quantity of items
 *       unitPrice: number,         // Price per unit
 *       serviceFee: number,        // Service fee for this item
 *       discount: number,          // Discount amount for this item
 *       subtotal: number           // Declared subtotal for this item
 *     }
 *   ],
 *   fees: {
 *     components: [
 *       {
 *         id: string,             // Unique identifier for the fee
 *         category: "revenue" | "deduction" | "pass_through",
 *         amount: number           // Fee amount
 *       }
 *     ]
 *   },
 *   totals: {
 *     declared: {
 *       gross: number,             // Declared gross total
 *       discount: number,          // Declared total discount
 *       final: number              // Declared final total
 *     }
 *   },
 *   meta: {
 *     currency?: string           // Optional currency code
 *   }
 * }
 */

module.exports = {
  validateCanonicalOrder
};
