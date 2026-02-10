/**
 * I04: Gross Conservation
 * 
 * Validates that the declared gross total equals the sum of all item subtotals
 * (before discounts and fees are applied at the order level).
 * 
 * Formula: declared.gross = sum(item.subtotal for all items)
 * 
 * This ensures that the gross total is conserved - no money is created or destroyed.
 */

const { createInvariantResult } = require('../invariantResult');
const { sum, approximatelyEqual } = require('../utils');

/**
 * Validates that the declared gross total equals the sum of all item subtotals.
 * 
 * @param {Object} canonicalOrder - The canonical order object
 * @returns {Object} - Invariant result object
 */
function validateGrossConservation(canonicalOrder) {
  const itemSubtotals = canonicalOrder.items.map(item => item.subtotal);
  const calculatedGross = sum(itemSubtotals);
  const declaredGross = canonicalOrder.totals.declared.gross;

  if (approximatelyEqual(calculatedGross, declaredGross)) {
    return createInvariantResult(
      'I04',
      true,
      calculatedGross,
      declaredGross,
      `Declared gross (${declaredGross}) equals sum of item subtotals (${calculatedGross})`
    );
  }

  return createInvariantResult(
    'I04',
    false,
    calculatedGross,
    declaredGross,
    `Gross conservation violated: sum of item subtotals (${calculatedGross}) does not equal declared gross (${declaredGross})`
  );
}

module.exports = validateGrossConservation;
