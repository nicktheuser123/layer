const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const BACKUP_FILE = path.join(__dirname, '../../formulas-backup.txt');

router.post('/save-backup', (req, res) => {
  try {
    const { formulas = '', checks = '' } = req.body;
    const content = `# Formulas\n${formulas}\n\n# Checks (JSON)\n${checks}`;
    fs.writeFileSync(BACKUP_FILE, content, 'utf8');
    res.json({ ok: true, path: BACKUP_FILE });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
