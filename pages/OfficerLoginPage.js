// pages/OfficerLoginPage.js
// Immigration Officer login with demo credentials

window.OfficerLoginPage = function OfficerLoginPage({ onLogin, onBack }) {
  const { useState } = React;

  const [username,  setUsername]  = useState('');
  const [password,  setPassword]  = useState('');
  const [badgeId,   setBadgeId]   = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [showPass,  setShowPass]  = useState(false);

  /* ── Demo credentials ── */
  const OFFICERS = [
    { username: 'officer.raj',   password: 'secure123', badge: 'OFF-001', name: 'Rajesh Kumar',   rank: 'Senior Immigration Officer', airport: 'Bengaluru International' },
    { username: 'officer.priya', password: 'secure456', badge: 'OFF-002', name: 'Priya Nair',     rank: 'Immigration Officer',        airport: 'Bengaluru International' },
    { username: 'admin',         password: 'admin123',  badge: 'ADM-001', name: 'Admin User',     rank: 'Duty Manager',               airport: 'Bengaluru International' },
  ];

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!username.trim()) { setError('Please enter your username.'); return; }
    if (!password.trim()) { setError('Please enter your password.'); return; }
    if (!badgeId.trim())  { setError('Please enter your Badge ID.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate auth

    const officer = OFFICERS.find(
      o => o.username === username.trim() &&
           o.password === password &&
           o.badge    === badgeId.trim().toUpperCase()
    );

    setLoading(false);

    if (officer) {
      onLogin(officer);
    } else {
      setError('Invalid credentials. Please check your username, password, and Badge ID.');
    }
  };

  const fillDemo = (o) => {
    setUsername(o.username);
    setPassword(o.password);
    setBadgeId(o.badge);
    setError('');
  };

  const features = [
    { icon: '🔍', text: 'Review AI-flagged and rejected passengers' },
    { icon: '✅', text: 'Approve, hold, or escalate border cases' },
    { icon: '📊', text: 'Real-time case queue and audit trail' },
    { icon: '🔒', text: 'Secure, role-based officer access' },
  ];

  return (
    <div className="officer-login-page">
      {/* Left panel */}
      <div className="login-left">
        <div className="login-left-badge">
          🛂 &nbsp;Officer Portal
        </div>
        <h2 className="login-left-title">
          Immigration<br />Officer Console
        </h2>
        <p className="login-left-desc">
          Secure access for authorised immigration officers to review,
          verify, and action AI-flagged passenger cases.
        </p>
        <div className="login-features">
          {features.map((f, i) => (
            <div className="login-feature-item" key={i}>
              <div className="login-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <span className="login-form-pretitle">Restricted Access</span>
            <h1 className="login-form-title">Officer Sign In</h1>
            <p className="login-form-sub">Enter your credentials to access the case queue</p>
          </div>

          <div className="login-card">
            {/* Demo credentials hint */}
            <div className="login-demo-hint">
              <div className="login-demo-hint-title">🧪 Demo Accounts — click to fill</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { username: 'officer.raj',   password: 'secure123', badge: 'OFF-001', label: 'Senior Officer' },
                  { username: 'officer.priya', password: 'secure456', badge: 'OFF-002', label: 'Officer' },
                  { username: 'admin',         password: 'admin123',  badge: 'ADM-001', label: 'Admin' },
                ].map(o => (
                  <button
                    key={o.username}
                    onClick={() => fillDemo(o)}
                    style={{
                      background: 'var(--bg-white)', border: '1px solid var(--blue-100)',
                      borderRadius: 'var(--radius-sm)', padding: '7px 10px',
                      cursor: 'pointer', textAlign: 'left', transition: 'all var(--ease)',
                      display: 'flex', gap: '8px', alignItems: 'center',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-white)'}
                  >
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--blue-600)',
                      background: 'var(--blue-100)', padding: '2px 6px', borderRadius: '4px' }}>
                      {o.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {o.username} / {o.password} / {o.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error-msg">
                <span>⚠</span> {error}
              </div>
            )}

            {/* Username */}
            <div className="login-form-field">
              <label className="login-label">Username</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">👤</span>
                <input
                  className={`login-input ${error ? 'error' : ''}`}
                  type="text"
                  placeholder="e.g. officer.raj"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-form-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">🔒</span>
                <input
                  className={`login-input ${error ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="current-password"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px',
                    color: 'var(--text-light)', padding: '2px',
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Badge ID */}
            <div className="login-form-field" style={{ marginBottom: '20px' }}>
              <label className="login-label">Badge ID</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">🪪</span>
                <input
                  className={`login-input ${error ? 'error' : ''}`}
                  type="text"
                  placeholder="e.g. OFF-001"
                  value={badgeId}
                  onChange={e => { setBadgeId(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={{ fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase' }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              className="login-submit-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                  Authenticating…
                </>
              ) : (
                <>🔐 &nbsp;Sign In to Officer Console</>
              )}
            </button>
          </div>

          <div className="login-footer-note">
            <button
              onClick={onBack}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '6px',
                margin: '0 auto',
              }}
            >
              ← Back to main application
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
