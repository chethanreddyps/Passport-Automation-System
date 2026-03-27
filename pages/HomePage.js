// pages/HomePage.js

window.HomePage = function HomePage({ onStart, stats }) {
  const howCards = [
    {
      icon: '🪪', iconCls: 'blue', step: 'STEP 01',
      title: 'Applicant Entry',
      desc: 'Passenger presents passport at the automated kiosk. Biometric and MRZ data are captured instantly.',
    },
    {
      icon: '🤖', iconCls: 'teal', step: 'STEP 02',
      title: 'AI Verification',
      desc: 'AI engine validates documents, performs OCR, checks expiry, and runs face-document matching.',
    },
    {
      icon: '🛡️', iconCls: 'green', step: 'STEP 03',
      title: 'Risk Assessment',
      desc: 'Cross-references watchlists, travel history, and visa databases for instant threat scoring.',
    },
    {
      icon: '✅', iconCls: 'yellow', step: 'STEP 04',
      title: 'Clearance Decision',
      desc: 'Approved passengers board directly. Suspicious or rejected cases are routed to an Immigration Officer.',
    },
  ];

  const trusted = [
    { icon: '🔒', label: 'ICAO Compliant' },
    { icon: '⚡', label: 'Sub-3s Processing' },
    { icon: '🛡️', label: 'ISO 27001' },
    { icon: '🌍', label: '140+ Countries' },
    { icon: '📈', label: '99.7% Accuracy' },
  ];

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          INTELLIGENT BORDER CONTROL
        </div>

        <h1 className="hero-title">
          Seamless, Secure<br /><span>Immigration Clearance</span>
        </h1>

        <p className="hero-desc">
          AI-powered passport verification that processes travellers in under 3 seconds —
          reducing queues, eliminating fraud, and giving officers more time for what matters.
        </p>

        <div className="hero-cta">
          <button className="btn-hero-primary" onClick={onStart}>
            <span>Begin Simulation</span>
            <span style={{ fontSize: '16px' }}>→</span>
          </button>
          <button className="btn-hero-secondary">
            <span style={{ fontSize: '14px' }}>▶</span>
            Watch Demo
          </button>
        </div>
      </section>

      {/* TRUSTED BAR */}
      <div className="trusted-bar">
        {trusted.map((t) => (
          <div className="trusted-item" key={t.label}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.5 3.5L12 5l-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5z"
                fill="currentColor" opacity="0.7"/>
            </svg>
            {t.label}
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <span className="section-label">HOW IT WORKS</span>
        <h2 className="section-title">From scan to clearance<br />in four intelligent steps</h2>
        <p className="section-sub">
          Our system mirrors the sequence used by top-tier international airports,
          now simulated end-to-end in your browser.
        </p>

        <div className="how-grid">
          {howCards.map((card) => (
            <div className="how-card" key={card.step}>
              <div className={`how-icon ${card.iconCls}`}>{card.icon}</div>
              <span className="how-step-num">{card.step}</span>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS HERO */}
      <div className="stats-hero">
        {[
          { num: stats.total,                  label: 'Total Processed' },
          { num: `${stats.approved}`,          label: 'Approved' },
          { num: `${stats.suspicious}`,        label: 'Flagged for Review' },
          { num: `${stats.rejected}`,          label: 'Rejected' },
        ].map((s) => (
          <div className="stat-hero-item" key={s.label}>
            <span className="stat-hero-num">{s.num}</span>
            <span className="stat-hero-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
