/**
 * I08: Fee Net Effect
 * 
 * Validates that the net effect of fees matches the difference between
 * gross and final totals (accounting for discounts).
 * 
 * Formula: 
 *   revenue_fees - deduction_fees = (gross - discount - final)
 * 
 * This ensures that fees correctly account for the difference between
 * the gross amount (after discounts) and the final amount.
 * 
 * Note: pass_through fees are not included in this calculation as they
 * don't affect the net amount.
 */

const { createInvariantResult } = require('../invariantResult');
const { sum, approximatelyEqual } = require('../utils');

/**
 * Validates that the net effect of fees matches the difference between gross and final totals.
 * 
 * @param {Object} canonicalOrder - The canonical order object
 * @returns {Object} - Invariant result object
 */
function validateFeeNetEffect(canonicalOrder) {
  // Calculate net fee effect: revenue - deduction (pass_through excluded)
  const revenueFees = sum(
    canonicalOrder.fees.components
      .filter(fee => fee.category === 'revenue')
      .map(fee => fee.amount)
  );

  const deductionFees = sum(
    canonicalOrder.fees.components
      .filter(fee => fee.category === 'deduction')
      .map(fee => fee.amount)
  );

  const netFeeEffect = revenueFees - deductionFees;

  // Calculate expected difference: gross - discount - final
  const gross = canonicalOrder.totals.declared.gross;
  const discount = canonicalOrder.totals.declared.discount;
  const final = canonicalOrder.totals.declared.final;
  const expectedDifference = gross - discount - final;

  if (approximatelyEqual(netFeeEffect, expectedDifference)) {
    return createInvariantResult(
      'I08',
      true,
      expectedDifference,
      netFeeEffect,
      `Fee net effect (${netFeeEffect}) matches expected difference (${expectedDifference})`
    );
  }

  return createInvariantResult(
    'I08',
    false,
    expectedDifference,
    netFeeEffect,
    `Fee net effect violation: net fee effect (${netFeeEffect}) does not match expected difference (${expectedDifference}). Revenue fees: ${revenueFees}, Deduction fees: ${deductionFees}`
  );
}

module.exports = validateFeeNetEffect;
