/**
 * I07: Fee Category
 * 
 * Validates that all fees have a valid category.
 * Categories must be one of: "revenue", "deduction", "pass_through"
 * 
 * This ensures that fees are properly categorized for accounting purposes.
 */

const { createInvariantResult } = require('../invariantResult');

const VALID_CATEGORIES = ['revenue', 'deduction', 'pass_through'];

/**
 * Validates that all fees have a valid category.
 * 
 * @param {Object} canonicalOrder - The canonical order object
 * @returns {Object} - Invariant result object
 */
function validateFeeCategory(canonicalOrder) {
  const violations = [];

  for (let i = 0; i < canonicalOrder.fees.components.length; i++) {
    const fee = canonicalOrder.fees.components[i];
    if (!VALID_CATEGORIES.includes(fee.category)) {
      violations.push({
        feeIndex: i,
        feeId: fee.id,
        category: fee.category
      });
    }
  }

  if (violations.length === 0) {
    return createInvariantResult(
      'I07',
      true,
      VALID_CATEGORIES.join(' | '),
      'all valid',
      'All fees have valid categories'
    );
  }

  const violationDetails = violations
    .map(v => `fee[${v.feeIndex}] (${v.feeId}): category="${v.category}"`)
    .join('; ');

  return createInvariantResult(
    'I07',
    false,
    VALID_CATEGORIES.join(' | '),
    violations.length,
    `Found ${violations.length} fee(s) with invalid category: ${violationDetails}`
  );
}

module.exports = validateFeeCategory;
