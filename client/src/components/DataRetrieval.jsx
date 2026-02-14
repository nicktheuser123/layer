import { useState } from 'react';

const DATATYPES_KEY = 'formula-validator-datatypes';
const DOMAIN_KEY = 'formula-validator-domain';

export default function DataRetrieval() {
  const [domain, setDomain] = useState(() => localStorage.getItem(DOMAIN_KEY) || '');
  const [datatypesText, setDatatypesText] = useState(
    () => localStorage.getItem(DATATYPES_KEY) || 'GP_Order'
  );
  const [schemas, setSchemas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  function persistDatatypes(val) {
    setDatatypesText(val);
    localStorage.setItem(DATATYPES_KEY, val);
  }
  function persistDomain(val) {
    setDomain(val);
    localStorage.setItem(DOMAIN_KEY, val);
  }

  async function handleFetch() {
    const domainTrim = domain.trim();
    if (!domainTrim) {
      setError('Domain is required');
      return;
    }
    const list = datatypesText
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!list.length) {
      setError('Add at least one data type');
      return;
    }
    setLoading(true);
    setError(null);
    setSchemas(null);
    try {
      const res = await fetch('/fetch-schemas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainTrim, datatypes: list })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fetch failed');
      setSchemas(data.schemas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setError('Copy failed');
    }
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <h2>Data Retrieval</h2>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>
          Domain (Bubble app URL):
        </label>
        <input
          type="text"
          value={domain}
          onChange={(e) => persistDomain(e.target.value)}
          placeholder="https://yourapp.bubbleapps.io"
          style={{ width: '100%', maxWidth: 400, padding: 6 }}
        />
      </div>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
        Data types (one per line or comma-separated), e.g. GP_Order
      </p>
      <textarea
        value={datatypesText}
        onChange={(e) => persistDatatypes(e.target.value)}
        placeholder="GP_Order"
        rows={3}
        style={{
          width: '100%',
          fontFamily: 'monospace',
          fontSize: 12,
          padding: 8,
          marginBottom: 8
        }}
      />
      <button type="button" onClick={handleFetch} disabled={loading} style={{ marginBottom: 16 }}>
        {loading ? 'Fetching...' : 'Fetch schemas'}
      </button>
      {error && <p style={{ color: 'red', marginBottom: 8 }}>{error}</p>}
      {schemas && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {Object.entries(schemas).map(([dataType, fields]) => (
            <div
              key={dataType}
              style={{
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 16,
                minWidth: 240,
                background: '#fafafa'
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>{dataType}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {fields.map(({ original, mapped }) => (
                  <button
                    key={mapped}
                    type="button"
                    onClick={() => copyToClipboard(mapped)}
                    title={`${original} → ${mapped} (click to copy)`}
                    style={{
                      textAlign: 'left',
                      padding: '6px 8px',
                      fontSize: 12,
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      border: '1px solid #eee',
                      borderRadius: 4,
                      background: copied === mapped ? '#e0ffe0' : '#fff'
                    }}
                  >
                    {mapped}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
