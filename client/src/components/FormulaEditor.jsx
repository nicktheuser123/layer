const PLACEHOLDER = `gross = order_gross_amount
discount = order_discount_amount
stripe_fee = gross * 0.029 + 0.3
expected_total = gross - discount + stripe_fee`;

export default function FormulaEditor({ value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2>Formulas</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={10}
        style={{ width: '100%', fontFamily: 'monospace', fontSize: 12, padding: 8 }}
      />
    </div>
  );
}
