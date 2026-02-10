/**
 * I10: No Phantom Money
 * 
 * Validates that there is no "phantom money" - money that appears in calculations
 * but has no source in the order.
 * 
 * This invariant checks that:
 * 1. All item subtotals are accounted for in the gross total (covered by I04)
 * 2. All item discounts are accounted for in the discount total (covered by I05)
 * 3. All fees are properly categorized and their net effect is accounted for (covered by I08, I09)
 * 
 * This is a comprehensive check that ensures money conservation across the entire order.
 * 
 * Since I04, I05, I08, and I09 already check individual conservation laws,
 * this invariant serves as a final sanity check that everything adds up correctly.
 */

const { createInvariantResult } = require('../invariantResult');
const { sum, approximatelyEqual } = require('../utils');

/**
 * Validates that there is no phantom money in the order.
 * 
 * @param {Object} canonicalOrder - The canonical order object
 * @returns {Object} - Invariant result object
 */
function validateNoPhantomMoney(canonicalOrder) {
  // Sum all item subtotals
  const itemSubtotals = sum(canonicalOrder.items.map(item => item.subtotal));
  
  // Sum all item discounts
  const itemDiscounts = sum(canonicalOrder.items.map(item => item.discount));
  
  // Calculate net fee effect
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

  // Calculate what the final should be from first principles
  const calculatedFinalFromItems = itemSubtotals - itemDiscounts + netFeeEffect;
  
  // Get declared values
  const declaredGross = canonicalOrder.totals.declared.gross;
  const declaredDiscount = canonicalOrder.totals.declared.discount;
  const declaredFinal = canonicalOrder.totals.declared.final;

  // Check if everything adds up correctly
  const grossMatches = approximatelyEqual(itemSubtotals, declaredGross);
  const discountMatches = approximatelyEqual(itemDiscounts, declaredDiscount);
  const finalMatches = approximatelyEqual(calculatedFinalFromItems, declaredFinal);

  if (grossMatches && discountMatches && finalMatches) {
    return createInvariantResult(
      'I10',
      true,
      calculatedFinalFromItems,
      declaredFinal,
      'No phantom money detected: all money is accounted for'
    );
  }

  const issues = [];
  if (!grossMatches) {
    issues.push(`gross mismatch: items sum to ${itemSubtotals} but declared ${declaredGross}`);
  }
  if (!discountMatches) {
    issues.push(`discount mismatch: items sum to ${itemDiscounts} but declared ${declaredDiscount}`);
  }
  if (!finalMatches) {
    issues.push(`final mismatch: calculated ${calculatedFinalFromItems} but declared ${declaredFinal}`);
  }

  return createInvariantResult(
    'I10',
    false,
    calculatedFinalFromItems,
    declaredFinal,
    `Phantom money detected: ${issues.join('; ')}`
  );
}

module.exports = validateNoPhantomMoney;
