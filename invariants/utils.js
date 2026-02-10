/**
 * Math Utilities for Invariant Validation
 * 
 * Pure arithmetic helpers for financial calculations.
 * These functions handle floating-point precision issues
 * that are common in financial calculations.
 */

/**
 * Rounds a number to a specified number of decimal places.
 * Used to handle floating-point precision issues.
 * 
 * @param {number} value - The number to round
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} - Rounded number
 */
function round(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Checks if two numbers are approximately equal within a tolerance.
 * Used to handle floating-point precision issues in financial calculations.
 * 
 * @param {number} a - First number
 * @param {number} b - Second number
 * @param {number} tolerance - Tolerance for comparison (default: 0.01)
 * @returns {boolean} - True if numbers are approximately equal
 */
function approximatelyEqual(a, b, tolerance = 0.01) {
  return Math.abs(a - b) < tolerance;
}

/**
 * Sums an array of numbers.
 * 
 * @param {number[]} values - Array of numbers to sum
 * @returns {number} - Sum of all values
 */
function sum(values) {
  return values.reduce((acc, val) => acc + val, 0);
}

/**
 * Safely adds two numbers, handling floating-point precision.
 * 
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} - Sum rounded to 2 decimal places
 */
function safeAdd(a, b) {
  return round(a + b, 2);
}

/**
 * Safely subtracts two numbers, handling floating-point precision.
 * 
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} - Difference rounded to 2 decimal places
 */
function safeSubtract(a, b) {
  return round(a - b, 2);
}

module.exports = {
  round,
  approximatelyEqual,
  sum,
  safeAdd,
  safeSubtract
};
