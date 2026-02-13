const { create, all } = require('mathjs');

const math = create(all, { number: 'number' });
math.import(
  {
    sum: (...args) => {
      const arr = args[0];
      if (Array.isArray(arr)) return arr.reduce((a, b) => Number(a) + Number(b), 0);
      return args.reduce((a, b) => Number(a) + Number(b), 0);
    },
    round: (x, p) => {
      const prec = p == null ? 2 : Number(p);
      const mult = Math.pow(10, prec);
      return Math.round(Number(x) * mult) / mult;
    }
  },
  { override: true }
);

/**
 * Parse and evaluate formula lines.
 * Variables can reference previous computed values.
 * Returns { computed: { name: value, ... }, variables: scope }
 */
function evaluateFormulas(formulaText, variables) {
  const scope = { ...variables };
  const lines = formulaText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  for (const line of lines) {
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const name = line.slice(0, eq).trim().replace(/\s+/g, '_');
    const expr = line.slice(eq + 1).trim();
    const val = math.evaluate(expr, scope);
    scope[name] = typeof val === 'number' ? val : val;
  }

  const inputKeys = new Set(Object.keys(variables));
  const computed = {};
  for (const [k, v] of Object.entries(scope)) {
    if (!inputKeys.has(k)) computed[k] = v;
  }
  return { computed, variables: scope };
}
module.exports = { evaluateFormulas };
