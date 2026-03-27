// pages/OfficerDashboardPage.js
// Full officer dashboard: case queue, detail view, actions

window.OfficerDashboardPage = function OfficerDashboardPage({ officer, caseQueue, onUpdateCase, onLogout }) {
  const { useState, useMemo } = React;

  const [selectedId, setSelectedId]   = useState(null);
  const [filter,     setFilter]       = useState('all');
  // FIX TC-19: store notes per case ID so they survive case switching
  const [notesMap,   setNotesMap]     = useState({});
  const [actionDone, setActionDone]   = useState({});

  /* ── Derived state ── */
  const selectedCase = useMemo(
    () => caseQueue.find(c => c.id === selectedId),
    [caseQueue, selectedId]
  );

  const filtered = useMemo(() => {
    if (filter === 'all')     return caseQueue;
    if (filter === 'pending') return caseQueue.filter(c => c.officerStatus === 'pending');
    return caseQueue.filter(c => c.officerStatus === filter);
  }, [caseQueue, filter]);

  const counts = useMemo(() => ({
    pending:  caseQueue.filter(c => c.officerStatus === 'pending').length,
    approved: caseQueue.filter(c => c.officerStatus === 'approved').length,
    rejected: caseQueue.filter(c => c.officerStatus === 'rejected').length,
    hold:     caseQueue.filter(c => c.officerStatus === 'hold').length,
  }), [caseQueue]);

  /* ── Action handler ── */
  const handleAction = (action) => {
    if (!selectedCase) return;
    const caseNotes = notesMap[selectedCase.id] || '';
    onUpdateCase(selectedCase.id, action, caseNotes);
    setActionDone(prev => ({ ...prev, [selectedCase.id]: action }));
    // Clear just this case's notes after actioning
    setNotesMap(prev => ({ ...prev, [selectedCase.id]: '' }));
  };

  /* ── AI checks config by AI verdict ── */
  const getAiChecks = (c) => {
    const isSuspicious = c.aiVerdict === 'suspicious';
    const isRejected   = c.aiVerdict === 'rejected';
    return [
      { icon: '📄', label: 'Document Authenticity',    result: isRejected ? 'fail' : 'pass',  text: isRejected ? 'Failed' : 'Passed' },
      { icon: '🔠', label: 'MRZ Checksum',             result: isRejected ? 'fail' : 'pass',  text: isRejected ? 'Error'  : 'Valid'  },
      { icon: '📅', label: 'Passport Expiry',          result: 'pass', text: 'Valid' },
      { icon: '🙂', label: 'Face Recognition Match',   result: isRejected ? 'fail' : isSuspicious ? 'warn' : 'pass', text: isRejected ? 'Mismatch' : isSuspicious ? 'Low Confidence (64%)' : 'Matched (98.7%)' },
      { icon: '🌍', label: 'Watchlist Cross-reference', result: isSuspicious ? 'warn' : isRejected ? 'warn' : 'pass', text: isSuspicious ? 'Possible Match' : isRejected ? 'Flagged Entry' : 'Clear' },
      { icon: '✈️', label: 'Travel History',           result: isSuspicious ? 'warn' : 'pass', text: isSuspicious ? 'Unusual Pattern' : 'Normal' },
      { icon: '🛂', label: 'Visa Status',              result: isRejected ? 'fail' : 'pass', text: isRejected ? 'Invalid' : 'Valid' },
    ];
  };

  /* ── Status display helpers ── */
  const statusDotClass = { pending: 'pending', approved: 'approved', rejected: 'rejected', hold: 'hold' };

  const aiVerdictIcon = { suspicious: '⚠️', rejected: '🚫', approved: '✅' };

  const filterOptions = [
    { id: 'all',      label: `All (${caseQueue.length})`,      cls: '' },
    { id: 'pending',  label: `Pending (${counts.pending})`,    cls: 'yellow' },
    { id: 'approved', label: `Approved (${counts.approved})`,  cls: 'green' },
    { id: 'rejected', label: `Rejected (${counts.rejected})`,  cls: 'red' },
    { id: 'hold',     label: `On Hold (${counts.hold})`,       cls: '' },
  ];

  return (
    <div className="officer-dashboard">
      {/* Officer top bar */}
      <div className="officer-topbar">
        <div className="officer-topbar-left">
          <div className="officer-avatar">
            {officer.name.split(' ').map(w => w[0]).join('').slice(0,2)}
          </div>
          <div>
            <div className="officer-info-name">{officer.name}</div>
            <div className="officer-info-role">{officer.rank} · {officer.badge}</div>
          </div>
        </div>

        <div className="officer-topbar-right">
          <div className="topbar-stat pending">
            <span className="topbar-stat-num">{counts.pending}</span>
            <span className="topbar-stat-lbl">Pending</span>
          </div>
          <div className="topbar-stat approved">
            <span className="topbar-stat-num">{counts.approved}</span>
            <span className="topbar-stat-lbl">Approved</span>
          </div>
          <div className="topbar-stat rejected">
            <span className="topbar-stat-num">{counts.rejected}</span>
            <span className="topbar-stat-lbl">Rejected</span>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Dashboard body */}
      <div className="dashboard-body">

        {/* ── LEFT: Cases list ── */}
        <div className="cases-panel">
          <div className="cases-panel-header">
            <div className="cases-panel-title">Case Queue</div>
            <div className="cases-filter-row">
              {filterOptions.map(f => (
                <button
                  key={f.id}
                  className={`filter-pill ${filter === f.id ? `active ${f.cls}` : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="cases-list">
            {filtered.length === 0 ? (
              <div className="cases-empty">
                <div className="cases-empty-icon">📋</div>
                <div className="cases-empty-text">No cases in this category</div>
              </div>
            ) : (
              filtered.map(c => (
                <div
                  key={c.id}
                  className={`case-row ${selectedId === c.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(c.id)}
                >
                  <div className="case-row-avatar">
                    {c.aiVerdict === 'suspicious' ? '⚠️' : c.aiVerdict === 'rejected' ? '🚫' : '✅'}
                  </div>
                  <div className="case-row-info">
                    <div className="case-row-name">{c.name}</div>
                    <div className="case-row-meta">{c.passportNo} · {c.nationality}</div>
                  </div>
                  <div className="case-row-status">
                    <span className={`status-dot ${statusDotClass[c.officerStatus] || 'pending'}`} title={c.officerStatus} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT: Detail panel ── */}
        <div className="detail-panel">
          {!selectedCase ? (
            <div className="detail-panel-empty">
              <div className="detail-panel-empty-icon">👈</div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Select a case from the queue</p>
            </div>
          ) : (
            <div className="case-detail">

              {/* Header */}
              <div className="case-detail-header">
                <div className="case-detail-top">
                  <div className="case-detail-avatar">🙍</div>
                  <div>
                    <div className="case-detail-name">{selectedCase.name}</div>
                    <div className="case-detail-passport">{selectedCase.passportNo} · {selectedCase.nationality}</div>
                  </div>
                </div>
                <div className={`case-ai-verdict ${selectedCase.aiVerdict}`}>
                  <span>{aiVerdictIcon[selectedCase.aiVerdict]}</span>
                  <span>
                    AI Verdict: <strong>
                      {selectedCase.aiVerdict === 'suspicious' ? 'Flagged – Suspicious Activity' :
                       selectedCase.aiVerdict === 'rejected'   ? 'Rejected – Document Failure'   :
                       'Approved'}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Applicant info */}
              <div className="case-info-card">
                <div className="case-info-title">Applicant Information</div>
                {[
                  ['Full Name',      selectedCase.name],
                  ['Passport No.',   selectedCase.passportNo],
                  ['Nationality',    selectedCase.nationality],
                  ['Date of Birth',  selectedCase.dob || '—'],
                  ['Gender',         selectedCase.gender || '—'],
                  ['Passport Expiry',selectedCase.expiry || '—'],
                  ['Submitted At',   selectedCase.submittedAt],
                ].map(([k, v]) => (
                  <div key={k} className="case-info-row">
                    <span className="case-info-key">{k}</span>
                    <span className="case-info-val">{v}</span>
                  </div>
                ))}
              </div>

              {/* AI Checks */}
              <div className="ai-checks-card">
                <div className="case-info-title">AI Verification Checks</div>
                {getAiChecks(selectedCase).map((chk, i) => (
                  <div key={i} className="ai-check-row">
                    <span className="ai-check-icon">{chk.icon}</span>
                    <span className="ai-check-label">{chk.label}</span>
                    <span className={`ai-check-result check-${chk.result}`}>{chk.text}</span>
                  </div>
                ))}
              </div>

              {/* Officer Notes */}
              {selectedCase.officerStatus === 'pending' && (
                <div className="notes-card">
                  <div className="case-info-title">
                    Officer Notes
                    {/* FIX TC-19: show saved indicator when notes exist */}
                    {notesMap[selectedCase.id] && (
                      <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--green-600)',
                        background: 'var(--green-100)', padding: '2px 7px', borderRadius: '99px', fontWeight: '600' }}>
                        ✓ Saved
                      </span>
                    )}
                  </div>
                  <textarea
                    className="notes-textarea"
                    placeholder="Add notes about this case (optional)… Notes are saved per case and persist while you browse the queue."
                    value={notesMap[selectedCase.id] || ''}
                    onChange={e => setNotesMap(prev => ({ ...prev, [selectedCase.id]: e.target.value }))}
                  />
                  <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '6px' }}>
                    💾 Notes auto-save as you type and are kept per case.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="action-card">
                <div className="action-card-title">Officer Decision</div>

                {selectedCase.officerStatus !== 'pending' ? (
                  <div className={`actioned-banner ${selectedCase.officerStatus}`}>
                    <span style={{ fontSize: '18px' }}>
                      {selectedCase.officerStatus === 'approved' ? '✅' :
                       selectedCase.officerStatus === 'rejected' ? '🚫' : '⏸️'}
                    </span>
                    <div>
                      <div>
                        Case marked as <strong>{selectedCase.officerStatus.toUpperCase()}</strong>
                      </div>
                      {selectedCase.officerNotes && (
                        <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '3px' }}>
                          Note: {selectedCase.officerNotes}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <button className="action-btn approve" onClick={() => handleAction('approved')}>
                      <span className="action-btn-icon">✅</span>
                      <span className="action-btn-text">
                        Approve & Allow Boarding
                        <span className="action-btn-sub">Passenger cleared — gate access granted</span>
                      </span>
                    </button>

                    <button className="action-btn hold" onClick={() => handleAction('hold')}>
                      <span className="action-btn-icon">⏸️</span>
                      <span className="action-btn-text">
                        Hold for Secondary Screening
                        <span className="action-btn-sub">Transfer to secondary check area</span>
                      </span>
                    </button>

                    <button className="action-btn reject" onClick={() => handleAction('rejected')}>
                      <span className="action-btn-icon">🚫</span>
                      <span className="action-btn-text">
                        Reject & Deny Entry
                        <span className="action-btn-sub">Entry refused — escalate to authorities</span>
                      </span>
                    </button>
                  </>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
