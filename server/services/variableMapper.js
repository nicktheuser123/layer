/**
 * Flatten Bubble JSON for formula use.
 * Prefix root fields with order_, keep arrays intact.
 */
function mapVariables(data) {
  if (!data || typeof data !== 'object') return {};
  const out = {};
  for (const [key, val] of Object.entries(data)) {
    const safeKey = key.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const varName = `order_${safeKey}`;
    out[varName] = val;
  }
  return out;
}

module.exports = { mapVariables };
