// components/StatsBar.js
// Session statistics mini-panel

window.StatsBar = function StatsBar({ stats }) {
  const items = [
    { label: 'Total Scanned', value: stats.total,      cls: '' },
    { label: 'Approved',      value: stats.approved,   cls: 'green' },
    { label: 'Suspicious',    value: stats.suspicious, cls: 'yellow' },
    { label: 'Rejected',      value: stats.rejected,   cls: 'red' },
  ];

  return (
    <div className="stats-mini">
      <div className="stats-mini-title">Session Stats</div>
      <div className="stats-mini-grid">
        {items.map((item) => (
          <div key={item.label} className={`stat-mini-box ${item.cls}`}>
            <span className="stat-mini-num">{item.value}</span>
            <span className="stat-mini-lbl">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
