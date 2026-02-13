const express = require('express');
const { fetchThing } = require('../services/bubbleClient');
const { mapVariables } = require('../services/variableMapper');
const { evaluateFormulas } = require('../services/formulaEngine');

const router = express.Router();

router.post('/validate', async (req, res) => {
  try {
    const { orderId, formulas, checks } = req.body;

    const appUrl = process.env.BUBBLE_APP_URL;
    const apiKey = process.env.BUBBLE_API_KEY;
    const dataType = process.env.BUBBLE_DATA_TYPE;

    if (!appUrl || !apiKey || !dataType) {
      return res.status(500).json({
        error: 'Missing BUBBLE_APP_URL, BUBBLE_API_KEY, or BUBBLE_DATA_TYPE in .env'
      });
    }
    if (!orderId || !formulas) {
      return res.status(400).json({
        error: 'Missing required fields: orderId, formulas'
      });
    }

    const raw = await fetchThing(appUrl, apiKey, dataType, orderId);
    const variables = mapVariables(raw);
    const { computed, variables: scope } = evaluateFormulas(formulas, variables);

    const checkConfig = Array.isArray(checks)
      ? checks
      : typeof checks === 'object' && checks !== null
        ? Object.entries(checks).map(([label, actualKey]) => ({ computedKey: label, actualKey }))
        : [];

    const results = [];
    for (const c of checkConfig) {
      const computedKey = c.computedKey || c.label;
      const actualKey = c.actualKey || c.actual;
      const expected = scope[computedKey];
      const actual = scope[actualKey];
      const expNum = Number(expected);
      const actNum = Number(actual);
      const diff = typeof expNum === 'number' && typeof actNum === 'number'
        ? Math.round((expNum - actNum) * 100) / 100
        : null;
      const pass = diff !== null && Math.abs(diff) < 0.01;
      results.push({
        label: c.label || computedKey,
        expected: expected,
        actual: actual,
        difference: diff,
        pass
      });
    }

    res.json({
      orderId,
      computed,
      results
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
