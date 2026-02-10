/**
 * I01: Quantity Non-Negative
 * 
 * Validates that all item quantities are non-negative.
 * This is a fundamental arithmetic invariant - quantities cannot be negative.
 */

const { createInvariantResult } = require('../invariantResult');

/**
 * Validates that all item quantities are non-negative.
 * 
 * @param {Object} canonicalOrder - The canonical order object
 * @returns {Object} - Invariant result object
 */
function validateQuantityNonNegative(canonicalOrder) {
  const violations = [];

  for (let i = 0; i < canonicalOrder.items.length; i++) {
    const item = canonicalOrder.items[i];
    if (item.quantity < 0) {
      violations.push({
        itemIndex: i,
        itemId: item.itemId,
        quantity: item.quantity
      });
    }
  }

  if (violations.length === 0) {
    return createInvariantResult(
      'I01',
      true,
      0,
      0,
      'All item quantities are non-negative'
    );
  }

  const violationDetails = violations
    .map(v => `item[${v.itemIndex}] (${v.itemId}): quantity=${v.quantity}`)
    .join('; ');

  return createInvariantResult(
    'I01',
    false,
    '>= 0',
    violations.length,
    `Found ${violations.length} item(s) with negative quantity: ${violationDetails}`
  );
}

module.exports = validateQuantityNonNegative;
