/**
 * I03: Item Subtotal
 * 
 * Validates that each item's declared subtotal matches the calculated subtotal.
 * 
 * Formula: subtotal = (unitPrice * quantity) + serviceFee - discount
 * 
 * This is a pure arithmetic invariant - the declared subtotal must equal
 * the calculated subtotal.
 */

const { createInvariantResult } = require('../invariantResult');
const { approximatelyEqual } = require('../utils');

/**
 * Validates that each item's declared subtotal matches the calculated subtotal.
 * 
 * @param {Object} canonicalOrder - The canonical order object
 * @returns {Object} - Invariant result object
 */
function validateItemSubtotal(canonicalOrder) {
  const violations = [];

  for (let i = 0; i < canonicalOrder.items.length; i++) {
    const item = canonicalOrder.items[i];
    
    // Calculate expected subtotal: (unitPrice * quantity) + serviceFee - discount
    const calculatedSubtotal = (item.unitPrice * item.quantity) + item.serviceFee - item.discount;
    const declaredSubtotal = item.subtotal;

    if (!approximatelyEqual(calculatedSubtotal, declaredSubtotal)) {
      violations.push({
        itemIndex: i,
        itemId: item.itemId,
        calculated: calculatedSubtotal,
        declared: declaredSubtotal
      });
    }
  }

  if (violations.length === 0) {
    return createInvariantResult(
      'I03',
      true,
      'calculated',
      'declared',
      'All item subtotals match calculated values'
    );
  }

  const violationDetails = violations
    .map(v => `item[${v.itemIndex}] (${v.itemId}): calculated=${v.calculated}, declared=${v.declared}`)
    .join('; ');

  return createInvariantResult(
    'I03',
    false,
    'calculated',
    'declared',
    `Found ${violations.length} item(s) with mismatched subtotals: ${violationDetails}`
  );
}

module.exports = validateItemSubtotal;
