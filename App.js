// App.js — Main application with officer portal routing

const { useState } = React;

/* ── Demo seed cases shown in officer queue by default ── */
const SEED_CASES = [
  {
    id: 'seed-1',
    name: 'Mohammed Al-Hassan',
    passportNo: 'P7821344',
    nationality: 'United Arab Emirates',
    dob: '1988-04-12',
    gender: 'Male',
    expiry: '2028-04-11',
    aiVerdict: 'suspicious',
    officerStatus: 'pending',
    officerNotes: '',
    submittedAt: '09:14:22',
  },
  {
    id: 'seed-2',
    name: 'Elena Vasquez',
    passportNo: 'X4490012',
    nationality: 'Colombia',
    dob: '1995-09-03',
    gender: 'Female',
    expiry: '2025-01-01',
    aiVerdict: 'rejected',
    officerStatus: 'pending',
    officerNotes: '',
    submittedAt: '09:22:05',
  },
  {
    id: 'seed-3',
    name: 'Yuki Tanaka',
    passportNo: 'JP223987',
    nationality: 'Japan',
    dob: '1992-07-19',
    gender: 'Female',
    expiry: '2030-07-18',
    aiVerdict: 'suspicious',
    officerStatus: 'approved',
    officerNotes: 'Manual check passed. Photo mismatch due to haircut.',
    submittedAt: '08:55:30',
  },
  {
    id: 'seed-4',
    name: 'Arjun Mehta',
    passportNo: 'IN881234',
    nationality: 'India',
    dob: '1985-11-25',
    gender: 'Male',
    expiry: '2027-11-24',
    aiVerdict: 'rejected',
    officerStatus: 'hold',
    officerNotes: 'Referred for deeper document verification.',
    submittedAt: '08:41:10',
  },
];

function App() {
  const [page,     setPage]     = useState('home');
  const [prevPage, setPrevPage] = useState(null);

  const [formData, setFormData] = useState({
    name: '', passportNo: '', nationality: '', gender: '',
    dob: '', expiry: '', birthplace: '', issueCountry: '',
    outcome: 'approved',
  });

  const [stats, setStats] = useState({
    total: 0, approved: 0, suspicious: 0, rejected: 0,
  });

  const [officer,   setOfficer]   = useState(null);
  const [caseQueue, setCaseQueue] = useState(SEED_CASES);

  function navigate(pg) {
    setPrevPage(page);
    setPage(pg);
  }

  function handleStartSim()        { navigate('applicant'); }
  function handleFormSubmit()      { navigate('processing'); }
  function handleProcessComplete() { navigate('result'); }

  function handleNewScan() {
    setFormData({ name:'', passportNo:'', nationality:'', gender:'', dob:'', expiry:'', birthplace:'', issueCountry:'', outcome:'approved' });
    navigate('applicant');
  }

  function updateStats(mode) {
    setStats(prev => ({ ...prev, total: prev.total + 1, [mode]: prev[mode] + 1 }));
  }

  function addToQueue(data, mode) {
    if (mode === 'suspicious' || mode === 'rejected') {
      setCaseQueue(prev => [{
        id: 'case-' + Date.now(),
        name:          data.name       || 'Unknown',
        passportNo:    data.passportNo || '—',
        nationality:   data.nationality || '—',
        dob:           data.dob         || '',
        gender:        data.gender      || '',
        expiry:        data.expiry      || '',
        aiVerdict:     mode,
        officerStatus: 'pending',
        officerNotes:  '',
        submittedAt:   new Date().toLocaleTimeString(),
      }, ...prev]);
    }
  }

  function handleUpdateStats(mode) {
    updateStats(mode);
    addToQueue(formData, mode);
  }

  function handleOfficerLogin(off)  { setOfficer(off); navigate('officer-dashboard'); }
  function handleOfficerLogout()    { setOfficer(null); navigate('home'); }

  function handleUpdateCase(id, action, notes) {
    setCaseQueue(prev => prev.map(c =>
      c.id === id ? { ...c, officerStatus: action, officerNotes: notes } : c
    ));
  }

  function handleNavigate(pg) {
    if (pg === 'officer-login') {
      officer ? navigate('officer-dashboard') : navigate('officer-login');
      return;
    }
    navigate(pg);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      {page !== 'officer-dashboard' && (
        <Header currentPage={page} onNavigate={handleNavigate} officer={officer} />
      )}

      {page === 'home' && (
        <HomePage onStart={handleStartSim} stats={stats} />
      )}
      {page === 'applicant' && (
        <ApplicantPage formData={formData} onUpdate={setFormData} onSubmit={handleFormSubmit} onBack={() => navigate('home')} />
      )}
      {page === 'processing' && (
        <ProcessingPage key={formData.passportNo + formData.name} formData={formData} onComplete={handleProcessComplete} stats={stats} onUpdateStats={handleUpdateStats} />
      )}
      {page === 'result' && (
        <ResultPage formData={formData} onNewScan={handleNewScan} onHome={() => navigate('home')} />
      )}
      {page === 'officer-login' && (
        <OfficerLoginPage onLogin={handleOfficerLogin} onBack={() => navigate(prevPage || 'home')} />
      )}
      {page === 'officer-dashboard' && officer && (
        <OfficerDashboardPage officer={officer} caseQueue={caseQueue} onUpdateCase={handleUpdateCase} onLogout={handleOfficerLogout} />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
