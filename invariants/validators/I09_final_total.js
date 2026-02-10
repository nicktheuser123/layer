/**
 * I09: Final Total
 * 
 * Validates that the declared final total matches the calculated final total.
 * 
 * Formula: final = gross - discount + (revenue_fees - deduction_fees)
 * 
 * Note: pass_through fees are not included as they don't affect the final amount.
 * 
 * This is a pure arithmetic invariant - the declared final must equal the calculated final.
 */

const { createInvariantResult } = require('../invariantResult');
const { sum, approximatelyEqual } = require('../utils');

/**
 * Validates that the declared final total matches the calculated final total.
 * 
 * @param {Object} canonicalOrder - The canonical order object
 * @returns {Object} - Invariant result object
 */
function validateFinalTotal(canonicalOrder) {
  const gross = canonicalOrder.totals.declared.gross;
  const discount = canonicalOrder.totals.declared.discount;

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

  // Calculate expected final: gross - discount + netFeeEffect
  const calculatedFinal = gross - discount + netFeeEffect;
  const declaredFinal = canonicalOrder.totals.declared.final;

  if (approximatelyEqual(calculatedFinal, declaredFinal)) {
    return createInvariantResult(
      'I09',
      true,
      calculatedFinal,
      declaredFinal,
      `Declared final (${declaredFinal}) equals calculated final (${calculatedFinal})`
    );
  }

  return createInvariantResult(
    'I09',
    false,
    calculatedFinal,
    declaredFinal,
    `Final total violation: calculated final (${calculatedFinal}) does not equal declared final (${declaredFinal}). Gross: ${gross}, Discount: ${discount}, Net fee effect: ${netFeeEffect}`
  );
}

module.exports = validateFinalTotal;
