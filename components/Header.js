// components/Header.js

window.Header = function Header({ currentPage, onNavigate, officer }) {
  const navItems = [
    { id: 'home',       label: 'Home',        icon: '🏠' },
    { id: 'applicant',  label: 'Applicant',   icon: '🪪' },
    { id: 'processing', label: 'Processing',  icon: '⚙️' },
    { id: 'result',     label: 'Result',      icon: '📋' },
  ];

  return (
    <header style={{
      background:'var(--bg-white)', borderBottom:'1px solid var(--border)',
      padding:'0 24px', display:'flex', alignItems:'center',
      justifyContent:'space-between', height:'64px',
      position:'sticky', top:0, zIndex:200, boxShadow:'var(--shadow-xs)',
      gap:'12px', flexWrap:'wrap',
    }}>
      {/* Brand */}
      <div onClick={() => onNavigate('home')} style={{ display:'flex', alignItems:'center', gap:'12px', cursor:'pointer', flexShrink:0 }}>
        <div style={{
          width:'38px', height:'38px', borderRadius:'10px',
          background:'var(--blue-600)', display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:'18px', boxShadow:'var(--shadow-blue)',
        }}>🛂</div>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'17px', fontWeight:'700', color:'var(--text-dark)', lineHeight:1 }}>
            Passport<span style={{ color:'var(--blue-600)' }}>AI</span>
          </div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--text-light)', letterSpacing:'1.5px', textTransform:'uppercase', marginTop:'2px' }}>
            Smart Immigration
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', gap:'2px' }}>
        {navItems.map(item => {
          const isActive = currentPage === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} style={{
              display:'flex', alignItems:'center', gap:'5px',
              padding:'7px 12px', borderRadius:'var(--radius-full)', border:'none',
              background: isActive ? 'var(--blue-50)' : 'transparent',
              color: isActive ? 'var(--blue-600)' : 'var(--text-muted)',
              fontFamily:'var(--font-body)', fontSize:'13px',
              fontWeight: isActive ? '600' : '500', cursor:'pointer',
              transition:'all var(--ease)',
            }}>
              <span style={{ fontSize:'13px' }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Right side */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
        {/* Officer portal button */}
        <button
          onClick={() => onNavigate('officer-login')}
          style={{
            display:'flex', alignItems:'center', gap:'7px',
            padding:'8px 16px', borderRadius:'var(--radius-full)',
            background: (currentPage === 'officer-login' || currentPage === 'officer-dashboard')
              ? 'var(--blue-600)' : 'var(--bg-soft)',
            color: (currentPage === 'officer-login' || currentPage === 'officer-dashboard')
              ? '#fff' : 'var(--text-body)',
            border:'1.5px solid',
            borderColor: (currentPage === 'officer-login' || currentPage === 'officer-dashboard')
              ? 'var(--blue-600)' : 'var(--border)',
            fontFamily:'var(--font-body)', fontSize:'13px', fontWeight:'600',
            cursor:'pointer', transition:'all var(--ease)',
            boxShadow: officer ? 'var(--shadow-blue)' : 'none',
          }}
        >
          <span>👮</span>
          {officer ? `Officer: ${officer.name.split(' ')[0]}` : 'Officer Portal'}
          {officer && (
            <span style={{
              width:'7px', height:'7px', borderRadius:'50%',
              background:'var(--green-500)', animation:'pulse 2s infinite',
            }}/>
          )}
        </button>

        {/* System status */}
        <div style={{
          display:'flex', alignItems:'center', gap:'6px',
          background:'var(--green-100)', border:'1px solid rgba(34,197,94,0.3)',
          borderRadius:'var(--radius-full)', padding:'5px 12px',
          fontSize:'10px', fontWeight:'600', color:'var(--green-600)',
          letterSpacing:'0.5px', fontFamily:'var(--font-mono)',
        }}>
          <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'var(--green-500)', animation:'pulse 2s infinite' }}></span>
          ONLINE
        </div>
      </div>
    </header>
  );
};
