// components/OfficerAlert.js
// Officer notification panel for suspicious/rejected cases

window.OfficerAlert = function OfficerAlert({ mode, applicantName, onApprove, onHold }) {
  const messages = {
    suspicious: `Anomaly detected for ${applicantName}. Face-document mismatch or watchlist flag raised. Please verify at counter and select an action below.`,
    rejected:   `${applicantName}'s documents failed AI verification. Identity could not be confirmed. Initiate a secondary check or hold the passenger.`,
  };

  return (
    <div className="officer-panel">
      <div className="officer-panel-header">
        <span style={{ fontSize: '18px' }}>🚨</span>
        <h4>Officer Action Required</h4>
      </div>
      <div className="officer-panel-body">
        <p className="officer-msg">{messages[mode]}</p>
        <div className="officer-btns">
          {mode === 'suspicious' && (
            <button className="officer-btn officer-btn-approve" onClick={onApprove}>
              ✓ Approve & Allow Boarding
            </button>
          )}
          <button className="officer-btn officer-btn-hold" onClick={onHold}>
            ⛔ {mode === 'suspicious' ? 'Hold for Secondary Check' : 'Initiate Secondary Check'}
          </button>
        </div>
      </div>
    </div>
  );
};
