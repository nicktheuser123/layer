/**
 * Invariant Result Factory
 * 
 * Every invariant validator must return a result object
 * with this exact shape. This ensures consistency across
 * all validators and makes results renderable in React,
 * assertable in Jest, and storable in the backend.
 */

/**
 * Creates a standardized invariant result object.
 * 
 * @param {string} id - The invariant identifier (e.g., "I01")
 * @param {boolean} pass - Whether the invariant passed
 * @param {number|string} expected - The expected value
 * @param {number|string} actual - The actual value
 * @param {string} explanation - Human-readable explanation
 * @returns {Object} - Standardized result object
 */
function createInvariantResult(id, pass, expected, actual, explanation) {
  if (typeof id !== 'string') {
    throw new Error('Invariant result id must be a string');
  }
  if (typeof pass !== 'boolean') {
    throw new Error('Invariant result pass must be a boolean');
  }
  if (typeof explanation !== 'string') {
    throw new Error('Invariant result explanation must be a string');
  }

  return {
    id,
    pass,
    expected,
    actual,
    explanation
  };
}

/**
 * Result Object Shape (Runtime Contract)
 * 
 * {
 *   id: string,              // Invariant identifier (e.g., "I01", "I02")
 *   pass: boolean,           // Whether the invariant passed
 *   expected: number|string, // The expected value
 *   actual: number|string,   // The actual value
 *   explanation: string      // Human-readable explanation
 * }
 */

module.exports = {
  createInvariantResult
};
