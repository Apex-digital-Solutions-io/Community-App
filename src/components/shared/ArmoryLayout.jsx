import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const MEMBER_LINKS = [
  { label: 'Dashboard',        path: '/armory/dashboard',        icon: DashboardIcon },
  { label: 'Treasury',         path: '/armory/treasury',         icon: TreasuryIcon },
  { label: 'Scripture Memory', path: '/armory/scripture-memory',  icon: ScriptureIcon },
  { label: 'Discipline Den',  path: '/armory/discipline-den',    icon: DisciplineIcon },
  { label: 'Stats',           path: '/armory/stats',             icon: StatsIcon },
  { label: 'Profile',         path: '/armory/profile',           icon: ProfileIcon },
];

const ADMIN_LINKS = [
  { label: 'Manage Users',   path: '/armory/admin/users',         icon: ManageUsersIcon },
  { label: 'Award Coins',    path: '/armory/admin/award',         icon: AwardCoinsIcon },
  { label: 'Relationships',  path: '/armory/admin/relationships', icon: RelationshipsIcon },
];

const STYLE_ID = 'hvk-armory-layout-responsive';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    .hvk-armory-sidebar {
      transform: translateX(0);
      position: relative;
      z-index: auto;
    }
    .hvk-armory-toggle {
      display: none;
    }
    .hvk-armory-overlay {
      display: none;
    }
    @media (max-width: 768px) {
      .hvk-armory-sidebar {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        bottom: 0 !important;
        z-index: 1100 !important;
        transform: translateX(-100%);
        transition: transform 0.3s ease, visibility 0.3s ease !important;
        visibility: hidden;
      }
      .hvk-armory-sidebar.open {
        transform: translateX(0) !important;
        visibility: visible !important;
      }
      .hvk-armory-toggle {
        display: flex !important;
      }
      .hvk-armory-overlay.open {
        display: block !important;
      }
      .hvk-armory-main {
        padding-top: var(--header-height) !important;
      }
    }
    .hvk-sidebar-link:hover {
      background-color: rgba(184, 28, 44, 0.08) !important;
      color: var(--crimson) !important;
    }
    .hvk-signout-btn:hover {
      background-color: rgba(184, 28, 44, 0.08) !important;
    }
    .hvk-theme-toggle-armory:hover {
      border-color: var(--crimson) !important;
      color: var(--crimson) !important;
    }
  `;
  document.head.appendChild(el);
}

export default function ArmoryLayout() {
  const { profile, signOut, isAdmin, isEdgeKeeper } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const isActive = (path) => location.pathname === path;

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/armory');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  }

  const displayName = profile?.display_name || profile?.username || 'Member';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const userRole = profile?.user_role || 'Member';

  return (
    <div style={s.layout}>
      <div className="hvk-armory-toggle" style={s.mobileTopBar}>
        <button
          style={s.toggleBtn}
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="var(--parchment)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <Link to="/armory/dashboard" style={s.mobileTitle}>
          <img src="/hvklogo.png" alt="HVK" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          <span style={{ color: 'var(--crimson)', fontWeight: 700, fontSize: '14px', letterSpacing: '3px', fontFamily: "'Cinzel', serif" }}>
            THE ARMORY
          </span>
        </Link>
        <button
          className="hvk-theme-toggle-armory"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={s.themeToggleMobile}
        >
          {theme === 'dark' ? '☽' : '☀'}
        </button>
      </div>

      <div
        className={`hvk-armory-overlay${sidebarOpen ? ' open' : ''}`}
        style={s.overlay}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`hvk-armory-sidebar${sidebarOpen ? ' open' : ''}`}
        style={s.sidebar}
        aria-label="Armory sidebar navigation"
      >
        <div style={s.sidebarHeader}>
          <Link to="/" style={s.sidebarLogoLink} aria-label="Back to public site">
            <img src="/hvklogo.png" alt="HVK" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            <span style={s.sidebarLogoText}>The Armory</span>
          </Link>
        </div>

        <div style={s.userCard}>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={displayName} style={s.avatar} />
          ) : (
            <div style={s.avatarFallback} aria-hidden="true">{avatarLetter}</div>
          )}
          <div style={s.userInfo}>
            <p style={s.userName}>{displayName}</p>
            <p style={s.userRole}>{userRole}</p>
          </div>
        </div>

        <nav style={s.sidebarNav}>
          <ul style={s.linkList}>
            {MEMBER_LINKS.map((link) => (
              <li key={link.path} style={{ listStyle: 'none' }}>
                <Link
                  to={link.path}
                  className="hvk-sidebar-link"
                  style={{
                    ...s.sidebarLink,
                    ...(isActive(link.path) ? s.sidebarLinkActive : {}),
                  }}
                >
                  <link.icon active={isActive(link.path)} />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {(isAdmin || isEdgeKeeper) && (
            <>
              <div style={s.sectionDivider}>
                <span style={s.sectionLabel}>Administration</span>
              </div>
              <ul style={s.linkList}>
                {ADMIN_LINKS.map((link) => (
                  <li key={link.path} style={{ listStyle: 'none' }}>
                    <Link
                      to={link.path}
                      className="hvk-sidebar-link"
                      style={{
                        ...s.sidebarLink,
                        ...(isActive(link.path) ? s.sidebarLinkActive : {}),
                      }}
                    >
                      <link.icon active={isActive(link.path)} />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        <div style={s.sidebarFooter}>
          <button
            className="hvk-theme-toggle-armory"
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
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            className="hvk-signout-btn"
            style={s.signOutBtn}
            onClick={handleSignOut}
          >
            <SignOutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="hvk-armory-main" style={s.main}>
        <div style={s.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function DashboardIcon({ active }) {
  const color = active ? 'var(--crimson)' : 'var(--parchment-dim)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1" stroke={color} strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.8" />
      <rect x="14" y="12" width="7" height="9" rx="1" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

function TreasuryIcon({ active }) {
  const color = active ? 'var(--crimson)' : 'var(--parchment-dim)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.8" />
      <path d="M12 8v8M9 11h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ScriptureIcon({ active }) {
  const color = active ? 'var(--crimson)' : 'var(--parchment-dim)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DisciplineIcon({ active }) {
  const color = active ? 'var(--crimson)' : 'var(--parchment-dim)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M2 17l10 5 10-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12l10 5 10-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatsIcon({ active }) {
  const color = active ? 'var(--crimson)' : 'var(--parchment-dim)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProfileIcon({ active }) {
  const color = active ? 'var(--crimson)' : 'var(--parchment-dim)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
      <path d="M20 21a8 8 0 10-16 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ManageUsersIcon({ active }) {
  const color = active ? 'var(--crimson)' : 'var(--parchment-dim)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="7" r="3.5" stroke={color} strokeWidth="1.8" />
      <path d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 8v6M16 11h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AwardCoinsIcon({ active }) {
  const color = active ? 'var(--crimson)' : 'var(--parchment-dim)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <path d="M14.5 9.5a3 3 0 10-5 2.2c.8.6 1.5 1.3 1.5 2.3h3c0-1 .7-1.7 1.5-2.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 17h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function RelationshipsIcon({ active }) {
  const color = active ? 'var(--crimson)' : 'var(--parchment-dim)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="7" cy="9" r="3" stroke={color} strokeWidth="1.8" />
      <circle cx="17" cy="9" r="3" stroke={color} strokeWidth="1.8" />
      <path d="M1 21v-1a4 4 0 014-4h4a4 4 0 014 4v1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 21v-1a4 4 0 014-4h2a4 4 0 014 4v1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="var(--parchment-dim)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="var(--parchment-dim)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SIDEBAR_WIDTH = '260px';

const s = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--field-bg)',
    backgroundImage: 'var(--field-bg-image)',
    backgroundAttachment: 'fixed',
  },
  mobileTopBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--header-height)',
    backgroundColor: 'var(--nav-bg)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--rule-soft-2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 1050,
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  mobileTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  themeToggleMobile: {
    background: 'none',
    border: '1px solid var(--rule-soft)',
    color: 'var(--parchment-dim)',
    padding: '6px 10px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  overlay: {
    display: 'none',
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1099,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    minWidth: SIDEBAR_WIDTH,
    height: '100vh',
    position: 'sticky',
    top: 0,
    backgroundColor: 'var(--anvil)',
    borderRight: '1px solid var(--rule)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  sidebarHeader: {
    padding: '20px 20px 0',
  },
  sidebarLogoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  sidebarLogoText: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--crimson)',
    letterSpacing: '2px',
    fontFamily: "'Cinzel', serif",
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    borderBottom: '1px solid var(--rule)',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  avatarFallback: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--crimson)',
    color: '#F4E8D0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 700,
    flexShrink: 0,
    fontFamily: "'Cinzel', serif",
  },
  userInfo: {
    overflow: 'hidden',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--parchment)',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: "'Cinzel', serif",
  },
  userRole: {
    fontSize: '11px',
    color: 'var(--parchment-dim)',
    margin: 0,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  sidebarNav: {
    flex: 1,
    padding: '12px 0',
  },
  linkList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  sidebarLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--parchment-dim)',
    textDecoration: 'none',
    borderLeft: '3px solid transparent',
    transition: 'color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
    fontFamily: "'EB Garamond', serif",
  },
  sidebarLinkActive: {
    color: 'var(--crimson)',
    fontWeight: 600,
    backgroundColor: 'rgba(184, 28, 44, 0.08)',
    borderLeftColor: 'var(--crimson)',
  },
  sectionDivider: {
    padding: '16px 20px 8px',
  },
  sectionLabel: {
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--crimson)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  sidebarFooter: {
    padding: '12px 16px 20px',
    borderTop: '1px solid var(--rule)',
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  themeToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 12px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--parchment-dim)',
    background: 'none',
    border: '1px solid var(--rule-soft)',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '1px',
    transition: 'border-color 0.15s ease, color 0.15s ease',
  },
  signOutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--parchment-dim)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    fontFamily: "'EB Garamond', serif",
  },
  main: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: '48px 32px 32px',
    maxWidth: '1100px',
    width: '100%',
    margin: '0 auto',
  },
};
