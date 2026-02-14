const express = require('express');
const { fetchMeta } = require('../services/bubbleClient');

function fieldToVarName(display) {
  const safeKey = String(display).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
  return `order_${safeKey}`;
}

function normalizeTypeKey(name) {
  return String(name).trim().replace(/\s+/g, '_').toLowerCase();
}

const router = express.Router();

router.post('/fetch-schemas', async (req, res) => {
  try {
    const { domain, datatypes } = req.body;
    const apiKey = process.env.BUBBLE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Missing BUBBLE_API_KEY in .env'
      });
    }
    if (!domain || typeof domain !== 'string' || !domain.trim()) {
      return res.status(400).json({ error: 'domain is required' });
    }
    if (!Array.isArray(datatypes) || datatypes.length === 0) {
      return res.status(400).json({ error: 'datatypes must be a non-empty array' });
    }

    const meta = await fetchMeta(domain.trim(), apiKey);
    const types = meta?.types || {};

    const results = {};
    for (const dt of datatypes) {
      const name = String(dt).trim();
      if (!name) continue;

      const normKey = normalizeTypeKey(name);
      const typeDef = types[normKey] || types[name];

      if (!typeDef || !Array.isArray(typeDef.fields)) {
        results[name] = [];
        continue;
      }

      results[name] = typeDef.fields.map((f) => {
        const display = f.display || f.id || '';
        return {
          original: display,
          mapped: fieldToVarName(display),
          type: f.type
        };
      });
    }

    res.json({ schemas: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
