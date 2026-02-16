import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Schedule', path: '/schedule' },
  { label: 'Roles', path: '/roles' },
  { label: 'Gamification', path: '/gamification' },
  { label: 'The Armory', path: '/armory' },
  { label: 'Resources', path: '/resources' },
];

/* ---------- responsive stylesheet (injected once) ---------- */
const STYLE_ID = 'hvk-navbar-responsive';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    .hvk-nav-desktop { display: flex; }
    .hvk-nav-hamburger { display: none; }
    @media (max-width: 768px) {
      .hvk-nav-desktop { display: none !important; }
      .hvk-nav-hamburger { display: flex !important; }
    }
    .hvk-nav-link:hover {
      color: var(--color-primary) !important;
      background-color: rgba(220, 20, 60, 0.04);
    }
    .hvk-mobile-link:hover {
      color: var(--color-primary) !important;
      background-color: rgba(220, 20, 60, 0.06);
    }
  `;
  document.head.appendChild(el);
}

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  /* track scroll for shadow effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* lock body scroll & handle Escape key when menu is open */
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
      <header
        style={{
          ...s.header,
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        }}
      >
        <nav style={s.nav}>
          {/* -------- Logo -------- */}
          <Link to="/" style={s.logoLink} aria-label="HVK Home">
            <svg
              style={s.crownIcon}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 20h20v2H2v-2zm1-7l4 5h10l4-5-3-6-4 4-3-7-3 7-4-4-1 6z"
                fill="var(--color-primary)"
              />
            </svg>
            <span style={s.logoText}>HVK</span>
          </Link>

          {/* -------- Desktop links -------- */}
          <ul className="hvk-nav-desktop" style={s.desktopLinks}>
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="hvk-nav-link"
                  style={{
                    ...s.navLink,
                    ...(isActive(link.path) ? s.navLinkActive : {}),
                  }}
                >
                  {link.label}
                  {isActive(link.path) && <span style={s.activeBar} />}
                </Link>
              </li>
            ))}
          </ul>

          {/* -------- Hamburger -------- */}
          <button
            className="hvk-nav-hamburger"
            style={s.hamburger}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="hvk-mobile-menu"
          >
            <span
              style={{
                ...s.bar,
                transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                ...s.bar,
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                ...s.bar,
                transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </nav>
      </header>

      {/* -------- Mobile overlay -------- */}
      {mobileOpen && (
        <div
          style={s.overlay}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* -------- Mobile slide-out menu -------- */}
      <aside
        id="hvk-mobile-menu"
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
            <li key={link.path}>
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

/* ---------- inline style objects ---------- */
const s = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: 'var(--color-bg)',
    borderBottom: '1px solid var(--color-border)',
    height: 'var(--header-height)',
    transition: 'box-shadow 0.2s ease',
  },
  nav: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    padding: '0 24px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  /* logo */
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  crownIcon: {
    width: '28px',
    height: '28px',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 800,
    color: 'var(--color-primary)',
    letterSpacing: '2px',
    fontFamily: 'var(--font-family)',
  },

  /* desktop links */
  desktopLinks: {
    alignItems: 'center',
    gap: '4px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 16px',
    fontSize: '15px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-sm)',
    transition: 'color 0.2s ease, background-color 0.2s ease',
  },
  navLinkActive: {
    color: 'var(--color-primary)',
    fontWeight: 600,
  },
  activeBar: {
    position: 'absolute',
    bottom: '-2px',
    left: '16px',
    right: '16px',
    height: '2px',
    backgroundColor: 'var(--color-primary)',
    borderRadius: '1px',
  },

  /* hamburger */
  hamburger: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    width: '44px',
    height: '44px',
    padding: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
    WebkitTapHighlightColor: 'transparent',
  },
  bar: {
    display: 'block',
    width: '22px',
    height: '2px',
    backgroundColor: 'var(--color-text)',
    borderRadius: '1px',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    transformOrigin: 'center',
  },

  /* mobile drawer */
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1001,
  },
  mobileMenu: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '280px',
    maxWidth: '80vw',
    backgroundColor: 'var(--color-bg)',
    zIndex: 1002,
    transition: 'transform 0.3s ease, visibility 0.3s ease',
    paddingTop: 'var(--header-height)',
    overflowY: 'auto',
    boxShadow: 'var(--shadow-lg)',
  },
  mobileList: {
    listStyle: 'none',
    margin: 0,
    padding: '16px 0',
  },
  mobileLink: {
    display: 'block',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    borderLeft: '3px solid transparent',
    transition: 'color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
  },
  mobileLinkActive: {
    color: 'var(--color-primary)',
    fontWeight: 600,
    backgroundColor: 'rgba(220,20,60,0.06)',
    borderLeftColor: 'var(--color-primary)',
  },
};
