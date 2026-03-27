// pages/OfficerLoginPage.js
// FIX TC-03: Per-field validation with individual error highlighting

window.OfficerLoginPage = function OfficerLoginPage({ onLogin, onBack }) {
  const { useState } = React;

  const [username,  setUsername]  = useState('');
  const [password,  setPassword]  = useState('');
  const [badgeId,   setBadgeId]   = useState('');
  const [errors,    setErrors]    = useState({}); // FIX: per-field errors object
  const [globalErr, setGlobalErr] = useState('');
  const [loading,   setLoading]   = useState(false);
  const [showPass,  setShowPass]  = useState(false);

  const OFFICERS = [
    { username: 'officer.raj',   password: 'secure123', badge: 'OFF-001', name: 'Rajesh Kumar',  rank: 'Senior Immigration Officer', airport: 'Bengaluru International' },
    { username: 'officer.priya', password: 'secure456', badge: 'OFF-002', name: 'Priya Nair',    rank: 'Immigration Officer',        airport: 'Bengaluru International' },
    { username: 'admin',         password: 'admin123',  badge: 'ADM-001', name: 'Admin User',    rank: 'Duty Manager',               airport: 'Bengaluru International' },
  ];

  // FIX TC-03: Validate ALL fields first, collect ALL errors, then show them all at once
  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setGlobalErr('');

    // Collect all field errors upfront
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (!badgeId.trim())  newErrors.badgeId  = 'Badge ID is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // highlight each failing field individually
      return;
    }

    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const officer = OFFICERS.find(
      o => o.username === username.trim() &&
           o.password === password &&
           o.badge    === badgeId.trim().toUpperCase()
    );

    setLoading(false);

    if (officer) {
      onLogin(officer);
    } else {
      setGlobalErr('Invalid credentials. Please check your username, password, and Badge ID.');
    }
  };

  const fillDemo = (o) => {
    setUsername(o.username);
    setPassword(o.password);
    setBadgeId(o.badge);
    setErrors({});
    setGlobalErr('');
  };

  const clearFieldError = (field) => setErrors(prev => ({ ...prev, [field]: '' }));

  const features = [
    { icon: '🔍', text: 'Review AI-flagged and rejected passengers' },
    { icon: '✅', text: 'Approve, hold, or escalate border cases' },
    { icon: '📊', text: 'Real-time case queue and audit trail' },
    { icon: '🔒', text: 'Secure, role-based officer access' },
  ];

  // Shared input style builder
  const inputStyle = (hasError) => ({
    width: '100%',
    background: hasError ? '#fff1f2' : 'var(--bg-base)',
    border: `1.5px solid ${hasError ? 'var(--red-500)' : 'var(--border)'}`,
    borderRadius: 'var(--radius)',
    color: 'var(--text-dark)',
    fontSize: '14px',
    padding: '11px 14px 11px 40px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    transition: 'all var(--ease)',
    boxShadow: hasError ? '0 0 0 3px rgba(239,68,68,0.10)' : 'none',
  });

  return (
    <div className="officer-login-page">
      {/* Left panel */}
      <div className="login-left">
        <div className="login-left-badge">🛂 &nbsp;Officer Portal</div>
        <h2 className="login-left-title">Immigration<br />Officer Console</h2>
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
            {/* Demo hint */}
            <div className="login-demo-hint">
              <div className="login-demo-hint-title">🧪 Demo Accounts — click to fill</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { username: 'officer.raj',   password: 'secure123', badge: 'OFF-001', label: 'Senior Officer' },
                  { username: 'officer.priya', password: 'secure456', badge: 'OFF-002', label: 'Officer' },
                  { username: 'admin',         password: 'admin123',  badge: 'ADM-001', label: 'Admin' },
                ].map(o => (
                  <button key={o.username} onClick={() => fillDemo(o)} style={{
                    background: 'var(--bg-white)', border: '1px solid var(--blue-100)',
                    borderRadius: 'var(--radius-sm)', padding: '7px 10px',
                    cursor: 'pointer', textAlign: 'left', transition: 'all var(--ease)',
                    display: 'flex', gap: '8px', alignItems: 'center',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-white)'}>
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

            {/* Global auth error */}
            {globalErr && (
              <div className="login-error-msg">
                <span>⚠</span> {globalErr}
              </div>
            )}

            {/* Username */}
            <div className="login-form-field">
              <label className="login-label">
                Username
                {errors.username && (
                  <span style={{ color: 'var(--red-500)', fontSize: '11px', fontWeight: '400', marginLeft: '8px' }}>
                    — {errors.username}
                  </span>
                )}
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon">👤</span>
                <input
                  style={inputStyle(!!errors.username)}
                  type="text"
                  placeholder="e.g. officer.raj"
                  value={username}
                  onChange={e => { setUsername(e.target.value); clearFieldError('username'); setGlobalErr(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="username"
                  onFocus={e => { if (!errors.username) e.target.style.borderColor = 'var(--blue-500)'; }}
                  onBlur={e => { if (!errors.username) e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-form-field">
              <label className="login-label">
                Password
                {errors.password && (
                  <span style={{ color: 'var(--red-500)', fontSize: '11px', fontWeight: '400', marginLeft: '8px' }}>
                    — {errors.password}
                  </span>
                )}
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon">🔒</span>
                <input
                  style={{ ...inputStyle(!!errors.password), paddingRight: '44px' }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearFieldError('password'); setGlobalErr(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="current-password"
                  onFocus={e => { if (!errors.password) e.target.style.borderColor = 'var(--blue-500)'; }}
                  onBlur={e => { if (!errors.password) e.target.style.borderColor = errors.password ? 'var(--red-500)' : 'var(--border)'; }}
                />
                <button onClick={() => setShowPass(p => !p)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px',
                  color: 'var(--text-light)', padding: '2px',
                }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Badge ID — TC-03 fix: individual error highlight */}
            <div className="login-form-field" style={{ marginBottom: '20px' }}>
              <label className="login-label">
                Badge ID
                {errors.badgeId && (
                  <span style={{ color: 'var(--red-500)', fontSize: '11px', fontWeight: '400', marginLeft: '8px' }}>
                    — {errors.badgeId}
                  </span>
                )}
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon">🪪</span>
                <input
                  style={{ ...inputStyle(!!errors.badgeId), fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase' }}
                  type="text"
                  placeholder="e.g. OFF-001"
                  value={badgeId}
                  onChange={e => { setBadgeId(e.target.value); clearFieldError('badgeId'); setGlobalErr(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  onFocus={e => { if (!errors.badgeId) e.target.style.borderColor = 'var(--blue-500)'; }}
                  onBlur={e => { if (!errors.badgeId) e.target.style.borderColor = errors.badgeId ? 'var(--red-500)' : 'var(--border)'; }}
                />
              </div>
              {/* Inline error hint below Badge ID field */}
              {errors.badgeId && (
                <p style={{ fontSize: '11px', color: 'var(--red-600)', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚠ Badge ID is required. Find it on your staff identity card (e.g. OFF-001).
                </p>
              )}
            </div>

            <button className="login-submit-btn" onClick={handleLogin} disabled={loading}>
              {loading ? (
                <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Authenticating…</>
              ) : (
                <>🔐 &nbsp;Sign In to Officer Console</>
              )}
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={onBack} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto',
            }}>
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
