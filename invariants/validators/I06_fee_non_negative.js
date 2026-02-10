/**
 * I06: Fee Non-Negative
 * 
 * Validates that all fee amounts are non-negative.
 * This is a fundamental arithmetic invariant - fees cannot be negative.
 * 
 * Note: This is separate from I02 (Money Non-Negative) because fees
 * have special categorization requirements and are worth checking separately.
 */

const { createInvariantResult } = require('../invariantResult');

/**
 * Validates that all fee amounts are non-negative.
 * 
 * @param {Object} canonicalOrder - The canonical order object
 * @returns {Object} - Invariant result object
 */
function validateFeeNonNegative(canonicalOrder) {
  const violations = [];

  for (let i = 0; i < canonicalOrder.fees.components.length; i++) {
    const fee = canonicalOrder.fees.components[i];
    if (fee.amount < 0) {
      violations.push({
        feeIndex: i,
        feeId: fee.id,
        category: fee.category,
        amount: fee.amount
      });
    }
  }

  if (violations.length === 0) {
    return createInvariantResult(
      'I06',
      true,
      '>= 0',
      '>= 0',
      'All fee amounts are non-negative'
    );
  }

  const violationDetails = violations
    .map(v => `fee[${v.feeIndex}] (${v.feeId}, ${v.category}): amount=${v.amount}`)
    .join('; ');

  return createInvariantResult(
    'I06',
    false,
    '>= 0',
    violations.length,
    `Found ${violations.length} fee(s) with negative amount: ${violationDetails}`
  );
}

module.exports = validateFeeNonNegative;
