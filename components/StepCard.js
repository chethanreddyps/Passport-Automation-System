// components/StepCard.js
// Reusable step card for the processing pipeline

window.StepCard = function StepCard({ num, from, to, title, desc, status, statusLabel, variant, delay }) {
  const statusClass = {
    done:       'status-done',
    processing: 'status-processing',
    alert:      'status-alert',
    stopped:    'status-stopped',
  }[status] || 'status-done';

  const defaultLabels = {
    done:       'Done',
    processing: 'Processing',
    alert:      'Alert',
    stopped:    'Stopped',
  };

  return (
    <div
      className={`step-card ${variant || ''}`}
      style={{ animationDelay: `${delay || 0}ms` }}
    >
      <div className="step-num-badge">{String(num).padStart(2, '0')}</div>
      <div className="step-content">
        <div className="step-route">
          <span>{from}</span>
          <span className="arrow">→</span>
          <span>{to}</span>
        </div>
        <div className="step-title">{title}</div>
        {desc && <div className="step-desc">{desc}</div>}
      </div>
      <div className={`step-status-pill ${statusClass}`}>
        {statusLabel || defaultLabels[status] || status}
      </div>
    </div>
  );
};
