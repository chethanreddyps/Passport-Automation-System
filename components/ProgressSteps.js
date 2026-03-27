// components/ProgressSteps.js
// Wizard progress steps shown on applicant + processing + result pages

window.ProgressSteps = function ProgressSteps({ current }) {
  const steps = [
    { id: 1, label: 'Applicant Details', page: 'applicant' },
    { id: 2, label: 'Processing',        page: 'processing' },
    { id: 3, label: 'Result',            page: 'result' },
  ];

  const currentIndex = steps.findIndex(s => s.page === current);

  return (
    <div style={{
      background: 'var(--bg-white)',
      borderBottom: '1px solid var(--border)',
      padding: '14px 40px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        maxWidth: '500px',
        margin: '0 auto',
      }}>
        {steps.map((step, idx) => {
          const isDone    = idx < currentIndex;
          const isActive  = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Step dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)',
                  background: isDone ? 'var(--green-500)' : isActive ? 'var(--blue-600)' : 'var(--bg-base)',
                  color: (isDone || isActive) ? '#fff' : 'var(--text-light)',
                  border: isPending ? '1.5px solid var(--border)' : 'none',
                  boxShadow: isActive ? 'var(--shadow-blue)' : 'none',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}>
                  {isDone ? '✓' : step.id}
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: isActive ? '600' : '400',
                  color: isDone ? 'var(--green-600)' : isActive ? 'var(--blue-600)' : 'var(--text-light)',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease',
                }}>
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  background: idx < currentIndex ? 'var(--green-500)' : 'var(--border)',
                  margin: '0 8px',
                  marginBottom: '18px',
                  borderRadius: '2px',
                  transition: 'background 0.4s ease',
                }}/>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
