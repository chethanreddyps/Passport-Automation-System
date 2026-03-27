// pages/ResultPage.js

window.ResultPage = function ResultPage({ formData, onNewScan, onHome }) {
  const mode = formData.outcome || 'approved';
  const name = formData.name       || 'Passenger';
  const pass = formData.passportNo || '—';
  const nat  = formData.nationality || '—';
  const dob  = formData.dob         || '—';
  const exp  = formData.expiry      || '—';
  const time = new Date().toLocaleTimeString();
  const date = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

  const configs = {
    approved: {
      icon:  '✅',
      title: 'Passenger Approved',
      msg:   'All AI checks passed. The passenger is fully cleared for boarding.',
      steps: [
        { icon: '🚶', cls: 'green',  title: 'Proceed to Gate A-12',   sub: 'Follow the green lane signs to your departure gate' },
        { icon: '🛂', cls: 'blue',   title: 'Boarding Pass Required',  sub: 'Present boarding pass and this clearance at the gate' },
        { icon: '✈️', cls: 'teal',   title: 'Boarding Commences',      sub: 'Please be at the gate 30 minutes before departure' },
      ],
    },
    suspicious: {
      icon:  '⚠️',
      title: 'Flagged for Review',
      msg:   'Anomalies detected during AI verification. The passenger has been referred to an Immigration Officer for manual review.',
      steps: [
        { icon: '👮', cls: 'yellow', title: 'Report to Counter 3',     sub: 'An officer will conduct a manual document review' },
        { icon: '🪪', cls: 'blue',   title: 'Provide Original Docs',   sub: 'Have all supporting travel documents ready' },
        { icon: '⏳', cls: 'yellow', title: 'Await Officer Decision',  sub: 'Processing may take 15–30 minutes' },
      ],
    },
    rejected: {
      icon:  '🚫',
      title: 'Entry Denied',
      msg:   'Document verification failed. The passenger cannot be cleared and has been stopped for further investigation.',
      steps: [
        { icon: '🛑', cls: 'red',    title: 'Detained at Hold Area',   sub: 'Passenger must remain in the immigration hold zone' },
        { icon: '📋', cls: 'yellow', title: 'Secondary Screening',     sub: 'Senior officer conducting full secondary check' },
        { icon: '⚖️', cls: 'red',    title: 'Case Escalated',          sub: 'Case referred to airport authority for review' },
      ],
    },
  };

  const cfg = configs[mode];
  const refId = `PAI-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  return (
    <div style={{ background: 'var(--bg-base)', flex: 1 }}>
      <ProgressSteps current="result" />

      <div className="result-page">

        {/* Verdict card */}
        <div className={`verdict-card ${mode}`}>
          <div className="verdict-icon-wrap">{cfg.icon}</div>
          <div className="verdict-status-label">
            {mode === 'approved' ? 'CLEARANCE GRANTED' : mode === 'suspicious' ? 'UNDER REVIEW' : 'ENTRY DENIED'}
          </div>
          <h1 className="verdict-title">{cfg.title}</h1>
          <p className="verdict-msg">{cfg.msg}</p>
        </div>

        {/* Detail cards */}
        <div className="result-details-grid">
          <div className="detail-card">
            <div className="detail-card-title">Applicant Information</div>
            {[
              ['Full Name',    name],
              ['Nationality',  nat],
              ['Date of Birth', dob],
              ['Gender',       formData.gender || '—'],
            ].map(([k,v]) => (
              <div key={k} className="detail-row">
                <span className="detail-key">{k}</span>
                <span className="detail-val">{v}</span>
              </div>
            ))}
          </div>

          <div className="detail-card">
            <div className="detail-card-title">Document Information</div>
            {[
              ['Passport No.',   pass],
              ['Expiry Date',    exp],
              ['Issue Country',  formData.issueCountry || nat],
              ['Clearance Time', time],
              ['Reference ID',   refId],
            ].map(([k,v]) => (
              <div key={k} className="detail-row">
                <span className="detail-key">{k}</span>
                <span className="detail-val" style={{ fontSize: '11px' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className="next-steps-card">
          <div className="next-steps-title">Next Steps</div>
          <div className="next-steps-list">
            {cfg.steps.map((s, i) => (
              <div key={i} className="next-step-item">
                <div className={`next-step-icon ${s.cls}`}>{s.icon}</div>
                <div className="next-step-text">
                  <strong>{s.title}</strong>
                  <span>{s.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="result-actions">
          <button className="btn-result-primary" onClick={onNewScan}>
            ← Process New Passenger
          </button>
          <button className="btn-result-ghost" onClick={onHome}>
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
