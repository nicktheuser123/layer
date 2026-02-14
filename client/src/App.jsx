import { useState, useEffect } from 'react';
import DataRetrieval from './components/DataRetrieval';
import FormulaEditor from './components/FormulaEditor';
import OrderInput from './components/OrderInput';
import ResultsTable from './components/ResultsTable';

const FORMULAS_KEY = 'formula-validator-formulas';
const CHECKS_KEY = 'formula-validator-checks';

export default function App() {
  const [formulas, setFormulas] = useState(() => localStorage.getItem(FORMULAS_KEY) || '');
  const [checks, setChecks] = useState(() => localStorage.getItem(CHECKS_KEY) || '');

  useEffect(() => {
    localStorage.setItem(FORMULAS_KEY, formulas);
  }, [formulas]);
  useEffect(() => {
    localStorage.setItem(CHECKS_KEY, checks);
  }, [checks]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSaveBackup() {
    try {
      const res = await fetch('/save-backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formulas, checks })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRun(orderId) {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      let checkConfig = {};
      if (checks.trim()) {
        try {
          checkConfig = JSON.parse(checks);
        } catch {
          setError('Invalid checks JSON');
          setLoading(false);
          return;
        }
      }
      const res = await fetch('/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          formulas,
          checks: checkConfig
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Validation failed');
        return;
      }
      setResults(data);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 900 }}>
      <h1>Bubble Order Formula Validator</h1>
      <DataRetrieval />
      <FormulaEditor value={formulas} onChange={setFormulas} />
      <div style={{ marginBottom: 16 }}>
        <button type="button" onClick={handleSaveBackup}>Save</button>
      </div>
      <OrderInput onRun={handleRun} loading={loading} />
      <div style={{ marginBottom: 16 }}>
        <label>
          Checks (JSON): <code>{"{ \"expected_total\": \"order_total_order_value\" }"}</code>
        </label>
        <textarea
          value={checks}
          onChange={(e) => setChecks(e.target.value)}
          placeholder='{"expected_total": "order_total_order_value"}'
          rows={2}
          style={{ width: '100%', fontFamily: 'monospace', fontSize: 12 }}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {results && <ResultsTable results={results.results} />}
    </div>
  );
}
