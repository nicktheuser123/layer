/**
 * I02: Money Non-Negative
 * 
 * Validates that all monetary values (prices, fees, discounts, totals) are non-negative.
 * This is a fundamental arithmetic invariant - money cannot be negative.
 */

const { createInvariantResult } = require('../invariantResult');

/**
 * Validates that all monetary values are non-negative.
 * 
 * @param {Object} canonicalOrder - The canonical order object
 * @returns {Object} - Invariant result object
 */
function validateMoneyNonNegative(canonicalOrder) {
  const violations = [];

  // Check item-level monetary values
  for (let i = 0; i < canonicalOrder.items.length; i++) {
    const item = canonicalOrder.items[i];
    const itemMonetaryFields = [
      { name: 'unitPrice', value: item.unitPrice },
      { name: 'serviceFee', value: item.serviceFee },
      { name: 'discount', value: item.discount },
      { name: 'subtotal', value: item.subtotal }
    ];

    for (const field of itemMonetaryFields) {
      if (field.value < 0) {
        violations.push({
          location: `items[${i}].${field.name}`,
          itemId: item.itemId,
          value: field.value
        });
      }
    }
  }

  // Check fee amounts
  for (let i = 0; i < canonicalOrder.fees.components.length; i++) {
    const fee = canonicalOrder.fees.components[i];
    if (fee.amount < 0) {
      violations.push({
        location: `fees.components[${i}].amount`,
        feeId: fee.id,
        value: fee.amount
      });
    }
  }

  // Check declared totals
  const totalFields = ['gross', 'discount', 'final'];
  for (const field of totalFields) {
    const value = canonicalOrder.totals.declared[field];
    if (value < 0) {
      violations.push({
        location: `totals.declared.${field}`,
        value: value
      });
    }
  }

  if (violations.length === 0) {
    return createInvariantResult(
      'I02',
      true,
      '>= 0',
      '>= 0',
      'All monetary values are non-negative'
    );
  }

  const violationDetails = violations
    .map(v => `${v.location}=${v.value}`)
    .join('; ');

  return createInvariantResult(
    'I02',
    false,
    '>= 0',
    violations.length,
    `Found ${violations.length} negative monetary value(s): ${violationDetails}`
  );
}

module.exports = validateMoneyNonNegative;
