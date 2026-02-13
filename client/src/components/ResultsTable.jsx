export default function ResultsTable({ results }) {
  if (!results || !results.length) return null;
  return (
    <div>
      <h2>Results</h2>
      <table border={1} cellPadding={8} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Check Name</th>
            <th>Expected</th>
            <th>Actual</th>
            <th>Difference</th>
            <th>Pass/Fail</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.label}</td>
              <td>{String(r.expected)}</td>
              <td>{String(r.actual)}</td>
              <td>{r.difference != null ? r.difference : '-'}</td>
              <td style={{ color: r.pass ? 'green' : 'red', fontWeight: 'bold' }}>
                {r.pass ? 'Pass' : 'Fail'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
