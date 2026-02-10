/**
 * I05: Discount Conservation
 * 
 * Validates that the declared discount total equals the sum of all item discounts.
 * 
 * Formula: declared.discount = sum(item.discount for all items)
 * 
 * This ensures that discount totals are conserved - no discount money is created or destroyed.
 */

const { createInvariantResult } = require('../invariantResult');
const { sum, approximatelyEqual } = require('../utils');

/**
 * Validates that the declared discount total equals the sum of all item discounts.
 * 
 * @param {Object} canonicalOrder - The canonical order object
 * @returns {Object} - Invariant result object
 */
function validateDiscountConservation(canonicalOrder) {
  const itemDiscounts = canonicalOrder.items.map(item => item.discount);
  const calculatedDiscount = sum(itemDiscounts);
  const declaredDiscount = canonicalOrder.totals.declared.discount;

  if (approximatelyEqual(calculatedDiscount, declaredDiscount)) {
    return createInvariantResult(
      'I05',
      true,
      calculatedDiscount,
      declaredDiscount,
      `Declared discount (${declaredDiscount}) equals sum of item discounts (${calculatedDiscount})`
    );
  }

  return createInvariantResult(
    'I05',
    false,
    calculatedDiscount,
    declaredDiscount,
    `Discount conservation violated: sum of item discounts (${calculatedDiscount}) does not equal declared discount (${declaredDiscount})`
  );
}

module.exports = validateDiscountConservation;
