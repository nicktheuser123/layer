import { useState } from 'react';
import FormulaEditor from './components/FormulaEditor';
import OrderInput from './components/OrderInput';
import ResultsTable from './components/ResultsTable';

export default function App() {
  const [formulas, setFormulas] = useState('');
  const [checks, setChecks] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      <FormulaEditor value={formulas} onChange={setFormulas} />
      <OrderInput onRun={handleRun} loading={loading} />
      <div style={{ marginBottom: 16 }}>
        <label>
          Checks (JSON): <code>{"{ \"expected_total\": \"order_Total_Order_Value\" }"}</code>
        </label>
        <textarea
          value={checks}
          onChange={(e) => setChecks(e.target.value)}
          placeholder='{"expected_total": "order_Total_Order_Value"}'
          rows={2}
          style={{ width: '100%', fontFamily: 'monospace', fontSize: 12 }}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {results && <ResultsTable results={results.results} />}
    </div>
  );
}
