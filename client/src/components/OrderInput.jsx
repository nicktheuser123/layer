import { useState } from 'react';

export default function OrderInput({ onRun, loading }) {
  const [orderId, setOrderId] = useState('');

  return (
    <div style={{ marginBottom: 16 }}>
      <h2>Order</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label>
          Order ID:
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="1234567890"
            disabled={loading}
            style={{ marginLeft: 8, padding: 4 }}
          />
        </label>
        <button onClick={() => onRun(orderId)} disabled={loading || !orderId}>
          {loading ? 'Running...' : 'Run Validation'}
        </button>
      </div>
    </div>
  );
}
