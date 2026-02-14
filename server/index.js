require('dotenv').config();
const express = require('express');
const validate = require('./routes/validate');
const saveBackup = require('./routes/saveBackup');
const fetchSchemas = require('./routes/fetchSchemas');

const app = express();
app.use(express.json());

app.use('/', validate);
app.use('/', saveBackup);
app.use('/', fetchSchemas);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
