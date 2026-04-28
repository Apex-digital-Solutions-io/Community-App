import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Schedule', path: '/schedule' },
  { label: 'Roles', path: '/roles' },
  { label: 'Accountability', path: '/accountability' },
  { label: 'The Armory', path: '/armory' },
  { label: 'Resources', path: '/resources' },
];

const STYLE_ID = 'hvk-navbar-responsive';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    .hvk-nav-desktop { display: flex; }
    .hvk-nav-hamburger { display: none; }
    .hvk-theme-toggle-nav { display: inline-flex; }
    @media (max-width: 900px) {
      .hvk-nav-desktop { display: none !important; }
      .hvk-nav-hamburger { display: flex !important; }
    }
    .hvk-nav-link:hover {
      color: var(--parchment) !important;
      border-bottom-color: var(--crimson) !important;
    }
    .hvk-mobile-link:hover {
      color: var(--parchment) !important;
      background-color: rgba(184, 28, 44, 0.08);
    }
    .navbar-crimson-line {
      position: absolute;
      left: 0; right: 0; bottom: -1px;
      height: 2px;
      background: var(--crimson);
      opacity: 0.85;
    }
  `;
  document.head.appendChild(el);
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={s.themeToggle}
    >
      {theme === 'dark' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      )}
      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}

export { ThemeToggle };

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    if (mobileOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <header style={s.header}>
        <div className="navbar-crimson-line" />
        <nav style={s.nav}>
          <Link to="/" style={s.logoLink} aria-label="HVK Home">
            <div style={s.logoIcon}>
              <img src="/hvklogo.png" alt="HVK" style={s.logoImg} />
            </div>
            <span style={s.logoText}>
              HIDDEN VALLEY <span style={s.logoAccent}>KINGS</span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ThemeToggle />

            <button
              className="hvk-nav-hamburger"
              style={s.hamburger}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              ≡
            </button>
          </div>

          <ul className="hvk-nav-desktop" style={s.desktopLinks}>
            {NAV_LINKS.map((link) => (
              <li key={link.path} style={{ listStyle: 'none' }}>
                <Link
                  to={link.path}
                  className="hvk-nav-link"
                  style={{
                    ...s.navLink,
                    ...(isActive(link.path) ? s.navLinkActive : {}),
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {mobileOpen && (
        <div style={s.overlay} onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      <aside
        ref={menuRef}
        style={{
          ...s.mobileMenu,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          visibility: mobileOpen ? 'visible' : 'hidden',
        }}
        aria-hidden={!mobileOpen}
      >
        <ul style={s.mobileList}>
          {NAV_LINKS.map((link) => (
            <li key={link.path} style={{ listStyle: 'none' }}>
              <Link
                to={link.path}
                className="hvk-mobile-link"
                style={{
                  ...s.mobileLink,
                  ...(isActive(link.path) ? s.mobileLinkActive : {}),
                }}
                tabIndex={mobileOpen ? 0 : -1}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

const s = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'var(--nav-bg)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--rule-soft-2)',
    zIndex: 1000,
    height: '84px',
    minHeight: '84px',
  },
  nav: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '0 32px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    textDecoration: 'none',
    color: 'var(--parchment)',
  },
  logoIcon: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  logoText: {
    fontFamily: "'Cinzel', serif",
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '4px',
    color: 'var(--parchment)',
  },
  logoAccent: {
    color: 'var(--crimson)',
  },
  desktopLinks: {
    alignItems: 'center',
    gap: '28px',
    margin: 0,
    padding: 0,
  },
  navLink: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: 'var(--parchment-dim)',
    textDecoration: 'none',
    padding: '6px 0',
    borderBottom: '1px solid transparent',
    transition: 'color 0.15s ease, border-color 0.15s ease',
  },
  navLinkActive: {
    color: 'var(--parchment)',
    borderBottomColor: 'var(--crimson)',
  },
  themeToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: '1px solid var(--rule-soft)',
    color: 'var(--ink)',
    padding: '6px 12px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease, color 0.15s ease',
  },
  hamburger: {
    background: 'none',
    border: '1px solid var(--rule-soft)',
    color: 'var(--parchment)',
    fontSize: '20px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1001,
  },
  mobileMenu: {
    position: 'fixed',
    top: '84px',
    left: 0,
    right: 0,
    backgroundColor: 'var(--onyx)',
    zIndex: 1002,
    transition: 'transform 0.3s ease, visibility 0.3s ease',
    borderBottom: '1px solid var(--crimson)',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 84px)',
  },
  mobileList: {
    margin: 0,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  mobileLink: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: 'var(--parchment-dim)',
    textDecoration: 'none',
    padding: '6px 0',
    borderBottom: '1px solid transparent',
    transition: 'color 0.15s ease, border-color 0.15s ease',
    display: 'block',
  },
  mobileLinkActive: {
    color: 'var(--parchment)',
    borderBottomColor: 'var(--crimson)',
  },
};
