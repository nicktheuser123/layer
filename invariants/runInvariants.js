/**
 * Invariant Runner
 * 
 * Runs all invariant validators on a canonical order and returns
 * a collection of results.
 * 
 * This is the main entry point for running invariants.
 */

const { validateCanonicalOrder } = require('./canonicalOrder');

// Import all validators
const I01_quantity_non_negative = require('./validators/I01_quantity_non_negative');
const I02_money_non_negative = require('./validators/I02_money_non_negative');
const I03_item_subtotal = require('./validators/I03_item_subtotal');
const I04_gross_conservation = require('./validators/I04_gross_conservation');
const I05_discount_conservation = require('./validators/I05_discount_conservation');
const I06_fee_non_negative = require('./validators/I06_fee_non_negative');
const I07_fee_category = require('./validators/I07_fee_category');
const I08_fee_net_effect = require('./validators/I08_fee_net_effect');
const I09_final_total = require('./validators/I09_final_total');
const I10_no_phantom_money = require('./validators/I10_no_phantom_money');

/**
 * Runs all invariant validators on a canonical order.
 * 
 * @param {Object} canonicalOrder - The canonical order to validate
 * @param {Object} options - Optional configuration
 * @param {boolean} options.validateShape - Whether to validate the canonical order shape first (default: true)
 * @returns {Object} - Results object containing all invariant results
 */
function runInvariants(canonicalOrder, options = {}) {
  const { validateShape = true } = options;

  // Validate canonical order shape if requested
  if (validateShape) {
    try {
      validateCanonicalOrder(canonicalOrder);
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        results: []
      };
    }
  }

  // Run all validators
  const results = [
    I01_quantity_non_negative(canonicalOrder),
    I02_money_non_negative(canonicalOrder),
    I03_item_subtotal(canonicalOrder),
    I04_gross_conservation(canonicalOrder),
    I05_discount_conservation(canonicalOrder),
    I06_fee_non_negative(canonicalOrder),
    I07_fee_category(canonicalOrder),
    I08_fee_net_effect(canonicalOrder),
    I09_final_total(canonicalOrder),
    I10_no_phantom_money(canonicalOrder)
  ];

  // Check if all invariants passed
  const allPassed = results.every(result => result.pass);

  return {
    valid: allPassed,
    results: results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.pass).length,
      failed: results.filter(r => !r.pass).length
    }
  };
}

/**
 * Runs a specific invariant validator by ID.
 * 
 * @param {string} invariantId - The invariant ID (e.g., "I01", "I02")
 * @param {Object} canonicalOrder - The canonical order to validate
 * @returns {Object} - The invariant result
 */
function runInvariant(invariantId, canonicalOrder) {
  const validators = {
    'I01': I01_quantity_non_negative,
    'I02': I02_money_non_negative,
    'I03': I03_item_subtotal,
    'I04': I04_gross_conservation,
    'I05': I05_discount_conservation,
    'I06': I06_fee_non_negative,
    'I07': I07_fee_category,
    'I08': I08_fee_net_effect,
    'I09': I09_final_total,
    'I10': I10_no_phantom_money
  };

  const validator = validators[invariantId];
  if (!validator) {
    throw new Error(`Unknown invariant ID: ${invariantId}`);
  }

  return validator(canonicalOrder);
}

module.exports = {
  runInvariants,
  runInvariant
};
