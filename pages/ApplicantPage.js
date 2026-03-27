// pages/ApplicantPage.js

window.ApplicantPage = function ApplicantPage({ formData, onUpdate, onSubmit, onBack }) {
  const { useState } = React;
  const [errors, setErrors] = useState({});
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  const countries = [
    'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh',
    'Belgium','Brazil','Canada','Chile','China','Colombia','Czech Republic','Denmark',
    'Egypt','Ethiopia','Finland','France','Germany','Ghana','Greece','Hungary','India',
    'Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan','Kenya','Malaysia',
    'Mexico','Morocco','Netherlands','New Zealand','Nigeria','Norway','Pakistan',
    'Peru','Philippines','Poland','Portugal','Saudi Arabia','Singapore','South Africa',
    'South Korea','Spain','Sri Lanka','Sweden','Switzerland','Thailand','Turkey',
    'Ukraine','United Arab Emirates','United Kingdom','United States','Vietnam',
  ];

  const validate = () => {
    const e = {};
    if (!formData.name?.trim())          e.name       = 'Full name is required';
    if (!formData.passportNo?.trim())    e.passportNo = 'Passport number is required';
    if (!formData.nationality)           e.nationality = 'Please select nationality';
    if (!formData.dob)                   e.dob        = 'Date of birth is required';
    if (!formData.expiry)                e.expiry     = 'Expiry date is required';
    if (!formData.gender)                e.gender     = 'Please select gender';
    if (!scanDone)                       e.scan       = 'Please scan the passport first';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    onUpdate({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleScan = () => {
    if (scanning || scanDone) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanDone(true);
      if (errors.scan) setErrors((prev) => ({ ...prev, scan: '' }));
    }, 2200);
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  const Field = ({ id, label, required, error, children }) => (
    <div className="form-field">
      <label className="form-label">
        {label}{required && <span className="required">*</span>}
      </label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-base)', flex: 1 }}>
      <ProgressSteps current="applicant" />
      <div className="applicant-page">

        {/* Page header */}
        <div className="page-header">
          <div className="page-breadcrumb">
            <span onClick={onBack}>Home</span>
            <span className="sep">/</span>
            <span style={{ color: 'var(--text-body)' }}>Applicant Details</span>
          </div>
          <h1 className="page-title">Applicant Details</h1>
          <p className="page-subtitle">Fill in the passenger's passport information and scan the document</p>
        </div>

        {/* Personal Information */}
        <div className="form-card">
          <div className="form-card-title">
            <div className="form-card-icon">🙍</div>
            Personal Information
          </div>
          <p className="form-card-subtitle">Primary identity details as shown in the passport</p>

          <div className="form-grid">
            <Field id="name" label="Full Name (as on passport)" required error={errors.name}>
              <input className={`form-input ${errors.name ? 'error' : ''}`}
                type="text" placeholder="e.g. Aditya Sharma"
                value={formData.name || ''}
                onChange={handleChange('name')}
              />
            </Field>

            <Field id="passportNo" label="Passport Number" required error={errors.passportNo}>
              <input className={`form-input ${errors.passportNo ? 'error' : ''}`}
                type="text" placeholder="e.g. A12345678"
                value={formData.passportNo || ''}
                onChange={handleChange('passportNo')}
                style={{ fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}
              />
            </Field>

            <Field id="nationality" label="Nationality" required error={errors.nationality}>
              <div className="form-select-wrap">
                <select className={`form-select ${errors.nationality ? 'error' : ''}`}
                  value={formData.nationality || ''}
                  onChange={handleChange('nationality')}>
                  <option value="">Select country…</option>
                  {countries.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </Field>

            <Field id="gender" label="Gender" required error={errors.gender}>
              <div className="form-select-wrap">
                <select className={`form-select ${errors.gender ? 'error' : ''}`}
                  value={formData.gender || ''}
                  onChange={handleChange('gender')}>
                  <option value="">Select…</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </Field>

            <Field id="dob" label="Date of Birth" required error={errors.dob}>
              <input className={`form-input ${errors.dob ? 'error' : ''}`}
                type="date"
                value={formData.dob || ''}
                onChange={handleChange('dob')}
              />
            </Field>

            <Field id="expiry" label="Passport Expiry Date" required error={errors.expiry}>
              <input className={`form-input ${errors.expiry ? 'error' : ''}`}
                type="date"
                value={formData.expiry || ''}
                onChange={handleChange('expiry')}
              />
            </Field>
          </div>

          <div className="form-divider" />

          <div className="form-grid">
            <Field id="birthplace" label="Place of Birth">
              <input className="form-input" type="text" placeholder="e.g. Mumbai"
                value={formData.birthplace || ''}
                onChange={handleChange('birthplace')}
              />
            </Field>

            <Field id="issueCountry" label="Country of Issue">
              <div className="form-select-wrap">
                <select className="form-select"
                  value={formData.issueCountry || ''}
                  onChange={handleChange('issueCountry')}>
                  <option value="">Select country…</option>
                  {countries.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </Field>
          </div>
        </div>

        {/* Passport Scan */}
        <div className="scan-card">
          <div className="form-card-title">
            <div className="form-card-icon">📷</div>
            Passport Scan
          </div>
          <p className="form-card-subtitle">Simulate the biometric scan of the physical passport</p>

          <div
            className={`scan-zone ${scanning ? 'scanning' : ''}`}
            onClick={handleScan}
            style={scanDone ? { borderColor: 'var(--green-500)', background: 'var(--green-100)' } : {}}
          >
            <div className="scan-line-anim" />
            <div className="scan-icon-wrap"
              style={scanDone ? { background: 'var(--green-100)', borderColor: 'var(--green-500)' } : {}}>
              {scanDone ? '✅' : scanning ? '🔄' : '🪪'}
            </div>
            <div className="scan-title"
              style={scanDone ? { color: 'var(--green-600)' } : {}}>
              {scanDone ? 'Passport Scanned Successfully' : scanning ? 'Scanning passport…' : 'Click to Scan Passport'}
            </div>
            <div className="scan-hint">
              {scanDone
                ? 'Biometric data, MRZ, and chip data captured'
                : scanning
                ? 'Reading MRZ, chip, and biometric data…'
                : 'Simulates placing passport on the kiosk scanner'}
            </div>
            {errors.scan && !scanDone && (
              <span style={{ fontSize: '11px', color: 'var(--red-500)', marginTop: '8px', fontWeight: '600' }}>
                {errors.scan}
              </span>
            )}
          </div>
        </div>

        {/* Simulation Mode */}
        <div className="form-card">
          <div className="form-card-title">
            <div className="form-card-icon">🎛️</div>
            Simulation Outcome
          </div>
          <p className="form-card-subtitle">Choose the AI processing result for this passenger</p>

          <div className="outcome-selector">
            {[
              { val: 'approved',   emoji: '✅', label: 'Approved',   desc: 'All checks pass' },
              { val: 'suspicious', emoji: '⚠️', label: 'Suspicious', desc: 'Officer review' },
              { val: 'rejected',   emoji: '🚫', label: 'Rejected',   desc: 'Entry denied' },
            ].map((o) => (
              <label key={o.val} className={`outcome-option ${o.val}`}>
                <input type="radio" name="simMode" value={o.val}
                  checked={formData.outcome === o.val}
                  onChange={handleChange('outcome')}
                />
                <div className="outcome-body">
                  <span className="outcome-emoji">{o.emoji}</span>
                  <span className="outcome-label">{o.label}</span>
                  <span className="outcome-desc">{o.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button className="btn-ghost" onClick={onBack}>← Back to Home</button>
          <button className="btn-primary" onClick={handleSubmit}>
            Begin Processing →
          </button>
        </div>
      </div>
    </div>
  );
};
