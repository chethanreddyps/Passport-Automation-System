// pages/ProcessingPage.js

window.ProcessingPage = function ProcessingPage({ formData, onComplete, stats, onUpdateStats }) {
  const { useState, useEffect, useRef } = React;

  const [steps,       setSteps]       = useState([]);
  const [activeActor, setActiveActor] = useState(null);
  const [progress,    setProgress]    = useState(0);
  const [logs,        setLogs]        = useState([{ time: now(), msg: 'System ready. Starting pipeline…', type: 'accent' }]);
  const [showOfficer, setShowOfficer] = useState(false);
  const [done,        setDone]        = useState(false);
  const stepsRef = useRef(null);
  const logsRef  = useRef(null);
  const ran      = useRef(false);

  function now() {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  function pad(n) { return String(n).padStart(2, '0'); }
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const addLog = (setFn, msg, type = 'info') => {
    setFn(prev => [...prev, { time: now(), msg, type }]);
  };

  const addStep = (setFn, step) => {
    setFn(prev => [...prev, { ...step, id: Date.now() + Math.random() }]);
  };

  const updateStep = (setFn, id, patch) => {
    setFn(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    runPipeline();
  }, []);

  useEffect(() => {
    if (stepsRef.current) stepsRef.current.scrollTop = stepsRef.current.scrollHeight;
  }, [steps]);

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  const mode = formData.outcome || 'approved';
  const name = formData.name || 'Passenger';
  const pass = formData.passportNo || '—';

  async function runPipeline() {
    /* ── STEP 1 ── */
    setActiveActor('applicant');
    let s1;
    addStep(setSteps, s1 = {
      id: 1, num: 1, from: 'Applicant', to: 'System',
      title: 'Scan Passport at Airport',
      desc: `Passport ${pass} placed on kiosk scanner. MRZ and chip data extracted.`,
      status: 'done', statusLabel: 'Scanned',
    });
    addLog(setLogs, `Passport ${pass} scanned for ${name}`, 'accent');
    setProgress(10);
    await sleep(800);

    /* ── STEP 2 ── */
    setActiveActor('system');
    addStep(setSteps, {
      num: 2, from: 'System', to: 'AI Automation',
      title: 'Send Face Data and Documents',
      desc: 'Biometric face capture, MRZ chip data, and document images transmitted to AI engine.',
      status: 'done', statusLabel: 'Sent',
    });
    addLog(setLogs, 'Biometric data transmitted to AI engine', 'info');
    setProgress(22);
    await sleep(800);

    /* ── STEP 3 ── */
    setActiveActor('ai');
    let s3id = Date.now();
    addStep(setSteps, {
      id: s3id, num: 3, from: 'AI Automation', to: 'AI Automation',
      title: 'Validate Documents',
      desc: 'Running OCR, MRZ checksum, expiry validation, and issuing authority lookup…',
      status: 'processing', statusLabel: 'Checking',
    });
    addLog(setLogs, 'Validating document authenticity…', 'accent');
    setProgress(36);
    await sleep(1300);

    updateStep(setSteps, s3id, { status: 'done', statusLabel: 'Valid' });
    addLog(setLogs, 'Document validation complete ✓', 'success');

    /* ── STEP 4 ── */
    let s4id = Date.now();
    addStep(setSteps, {
      id: s4id, num: 4, from: 'AI Automation', to: 'AI Automation',
      title: 'Verify Face and Document Match',
      desc: 'Facial recognition engine comparing live capture against passport photograph…',
      status: 'processing', statusLabel: 'Matching',
    });
    addLog(setLogs, 'Running face recognition match…', 'accent');
    setProgress(50);
    await sleep(1400);

    const faceResult  = mode === 'approved' ? { st: 'done', lb: 'Matched' } : mode === 'suspicious' ? { st: 'alert', lb: 'Flagged' } : { st: 'stopped', lb: 'Mismatch' };
    updateStep(setSteps, s4id, { status: faceResult.st, statusLabel: faceResult.lb });

    if (mode === 'approved')    addLog(setLogs, 'Face match confirmed (98.7% confidence)', 'success');
    else if (mode === 'suspicious') addLog(setLogs, 'Low confidence match — flagging case ⚠', 'warn');
    else                        addLog(setLogs, 'Face match FAILED — documents suspect', 'error');
    setProgress(63);
    await sleep(700);

    /* ── STEP 5 — Reverification ── */
    if (mode !== 'rejected') {
      setActiveActor('system');
      addStep(setSteps, {
        num: 5, from: 'AI Automation', to: 'System',
        title: 'Reverification',
        desc: 'Cross-referencing international watchlists, travel history, and visa databases.',
        status: 'done', statusLabel: 'Done',
      });
      addLog(setLogs, 'Watchlist and travel history check complete', 'info');
      setProgress(72);
      await sleep(800);
    }

    /* ──────────── BRANCH: SUSPICIOUS ──────────── */
    if (mode === 'suspicious') {
      setActiveActor('officer');
      addStep(setSteps, {
        num: 6, from: 'AI Automation', to: 'Immigration Officer',
        title: 'Auto Alert to Officer',
        desc: `Anomaly detected — desk officer alerted for manual review of ${name}.`,
        status: 'alert', statusLabel: 'Alert', variant: 'suspicious',
      });
      addLog(setLogs, '🚨 AUTO ALERT dispatched to Immigration Officer', 'warn');
      setProgress(80);
      await sleep(700);

      addStep(setSteps, {
        num: 7, from: 'System', to: 'Applicant',
        title: 'Send Data to Officer Desk',
        desc: 'Full applicant data displayed at officer workstation for manual review.',
        status: 'done', statusLabel: 'Displayed', variant: 'suspicious',
      });
      await sleep(600);

      setActiveActor('officer');
      addStep(setSteps, {
        num: 8, from: 'AI Automation', to: 'Immigration Officer',
        title: 'Verification Result Sent',
        desc: 'AI analysis report forwarded. Awaiting officer decision.',
        status: 'alert', statusLabel: 'Pending', variant: 'suspicious',
      });
      addLog(setLogs, 'Verification result forwarded to officer for decision', 'warn');
      setProgress(92);
      await sleep(500);

      setShowOfficer(true);
      setDone(true);
      onUpdateStats('suspicious');
    }

    /* ──────────── BRANCH: APPROVED ──────────── */
    else if (mode === 'approved') {
      setActiveActor('ai');
      addStep(setSteps, {
        num: 9, from: 'AI Automation', to: 'Immigration Officer',
        title: 'Allow Boarding',
        desc: `All checks passed. AI authorises ${name} to proceed to gate.`,
        status: 'done', statusLabel: 'Approved', variant: 'approved',
      });
      addLog(setLogs, 'Boarding authorisation issued', 'success');
      setProgress(82);
      await sleep(700);

      setActiveActor('applicant');
      addStep(setSteps, {
        num: 10, from: 'System', to: 'Applicant',
        title: 'View Verification Result',
        desc: 'Approval confirmation displayed to passenger at kiosk.',
        status: 'done', statusLabel: 'Notified', variant: 'approved',
      });
      await sleep(600);

      addStep(setSteps, {
        num: 11, from: 'AI Automation', to: 'Immigration Officer',
        title: 'Boarding to the Aircraft',
        desc: `${name} cleared. Boarding pass activated — Gate A-12.`,
        status: 'done', statusLabel: 'Boarding', variant: 'approved',
      });
      addLog(setLogs, `✅ ${name} cleared for boarding — Gate A-12`, 'success');
      setProgress(100);
      await sleep(600);

      setActiveActor(null);
      setDone(true);
      onUpdateStats('approved');
      // FIX TC-07: removed auto-navigate setTimeout so steps 9-11 stay fully
      // visible. User now clicks "View Result →" manually, same as other paths.
    }

    /* ──────────── BRANCH: REJECTED ──────────── */
    else if (mode === 'rejected') {
      setActiveActor('officer');
      addStep(setSteps, {
        num: 12, from: 'AI Automation', to: 'Immigration Officer',
        title: 'Reject or Hold Passenger',
        desc: `Document verification failed for ${name}. Officer notified to detain.`,
        status: 'stopped', statusLabel: 'Rejected', variant: 'rejected',
      });
      addLog(setLogs, '🛑 AI REJECTED — officer notified to hold passenger', 'error');
      setProgress(80);
      await sleep(700);

      addStep(setSteps, {
        num: 13, from: 'System', to: 'Applicant',
        title: 'Boarding Denied',
        desc: 'Entry refused. Applicant directed to Immigration Hold area.',
        status: 'stopped', statusLabel: 'Denied', variant: 'rejected',
      });
      await sleep(600);

      addStep(setSteps, {
        num: 14, from: 'AI Automation', to: 'Immigration Officer',
        title: 'Stop or Secondary Check',
        desc: 'Secondary screening initiated. Documents forwarded to senior officer.',
        status: 'stopped', statusLabel: 'Hold', variant: 'rejected',
      });
      addLog(setLogs, 'Secondary check initiated', 'error');
      setProgress(92);
      await sleep(600);

      addStep(setSteps, {
        num: 15, from: 'System', to: 'Applicant',
        title: 'Boarding Prevented',
        desc: 'Passenger prevented from boarding. Case escalated to authorities.',
        status: 'stopped', statusLabel: 'Stopped', variant: 'rejected',
      });
      setProgress(100);
      await sleep(500);

      setShowOfficer(true);
      setActiveActor(null);
      setDone(true);
      onUpdateStats('rejected');
    }
  }

  const actors = [
    { id: 'applicant', emoji: '👤', name: 'Applicant' },
    { id: 'system',    emoji: '🖥️', name: 'System' },
    { id: 'ai',        emoji: '🤖', name: 'AI Automation' },
    { id: 'officer',   emoji: '👮', name: 'Immigration Officer' },
  ];

  const handleOfficerApprove = () => {
    setShowOfficer(false);
    addLog(setLogs, 'Officer approved passenger for boarding', 'success');
    onComplete();
  };

  const handleOfficerHold = () => {
    setShowOfficer(false);
    addLog(setLogs, 'Officer initiated secondary / hold process', 'warn');
    onComplete();
  };

  return (
    <div style={{ background: 'var(--bg-base)', flex: 1 }}>
      <ProgressSteps current="processing" />

      <div className="processing-page">

        {/* Actors bar */}
        <div className="actors-bar">
          <div className="actors-bar-title">Pipeline Actors</div>
          <div className="actors-row">
            {actors.map(a => (
              <div key={a.id} className={`actor-chip ${activeActor === a.id ? 'active' : ''}`}>
                <span className="actor-avatar">{a.emoji}</span>
                <span className="actor-name">{a.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-title">Processing Pipeline</span>
            <span className="progress-pct">{progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Steps + Sidebar */}
        <div className="steps-area">
          {/* Steps list */}
          <div className="steps-main">
            <div className="steps-header">
              <span className="steps-title">Sequence Pipeline</span>
              <span className={`badge ${done ? (mode === 'approved' ? 'badge-green' : mode === 'suspicious' ? 'badge-yellow' : 'badge-red') : 'badge-blue'}`}>
                {done ? mode.toUpperCase() : 'PROCESSING…'}
              </span>
            </div>

            <div className="steps-list" ref={stepsRef}>
              {steps.length === 0 ? (
                <div className="steps-idle">
                  <div className="steps-idle-icon">⚙️</div>
                  <div className="steps-idle-text">Initializing pipeline…</div>
                </div>
              ) : (
                steps.map((s, i) => (
                  <StepCard
                    key={s.id || i}
                    num={s.num}
                    from={s.from}
                    to={s.to}
                    title={s.title}
                    desc={s.desc}
                    status={s.status}
                    statusLabel={s.statusLabel}
                    variant={s.variant}
                    delay={i * 40}
                  />
                ))
              )}
            </div>

            {done && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  onClick={onComplete}
                  style={{
                    background: 'var(--blue-600)', color: '#fff',
                    border: 'none', borderRadius: 'var(--radius-full)',
                    padding: '12px 32px', fontSize: '14px', fontWeight: '600',
                    cursor: 'pointer', boxShadow: 'var(--shadow-blue)',
                    transition: 'all var(--ease)',
                  }}
                >
                  View Result →
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="steps-sidebar">
            {/* Activity Log */}
            <div className="log-panel">
              <div className="log-panel-title">
                <span className="log-dot"></span>
                Activity Log
              </div>
              <div className="log-stream" ref={logsRef}>
                {logs.map((l, i) => (
                  <div key={i} className={`log-entry log-${l.type}`}>
                    <span className="log-time">{l.time}</span>
                    <span className="log-msg">{l.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Officer Alert */}
            {showOfficer && (
              <OfficerAlert
                mode={mode}
                applicantName={name}
                onApprove={handleOfficerApprove}
                onHold={handleOfficerHold}
              />
            )}

            {/* Stats */}
            <StatsBar stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
};
