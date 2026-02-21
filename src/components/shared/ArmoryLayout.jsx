import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ------------------------------------------------------------------ */
/*  Sidebar link definitions                                           */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Responsive stylesheet (injected once)                              */
/* ------------------------------------------------------------------ */
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
      background-color: rgba(220, 20, 60, 0.06) !important;
      color: var(--color-primary) !important;
    }
    .hvk-signout-btn:hover {
      background-color: rgba(220, 20, 60, 0.08) !important;
    }
  `;
  document.head.appendChild(el);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ArmoryLayout() {
  const { profile, signOut, isAdmin, isEdgeKeeper } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* close sidebar on route change (mobile) */
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  /* lock scroll when mobile sidebar is open */
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

  /* user display values */
  const displayName = profile?.display_name || profile?.username || 'Member';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const userRole = profile?.user_role || 'Member';

  return (
    <div style={s.layout}>
      {/* -------- Mobile top bar -------- */}
      <div className="hvk-armory-toggle" style={s.mobileTopBar}>
        <button
          style={s.toggleBtn}
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="var(--color-text)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <Link to="/armory/dashboard" style={s.mobileTitle}>
          <svg style={{ width: 20, height: 20, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 20h20v2H2v-2zm1-7l4 5h10l4-5-3-6-4 4-3-7-3 7-4-4-1 6z" fill="var(--color-primary)" />
          </svg>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '18px', letterSpacing: '1px' }}>
            The Armory
          </span>
        </Link>
        {/* spacer to balance hamburger */}
        <div style={{ width: '44px' }} />
      </div>

      {/* -------- Mobile overlay -------- */}
      <div
        className={`hvk-armory-overlay${sidebarOpen ? ' open' : ''}`}
        style={s.overlay}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* -------- Sidebar -------- */}
      <aside
        className={`hvk-armory-sidebar${sidebarOpen ? ' open' : ''}`}
        style={s.sidebar}
        aria-label="Armory sidebar navigation"
      >
        {/* Sidebar header: user info */}
        <div style={s.sidebarHeader}>
          <Link to="/" style={s.sidebarLogoLink} aria-label="Back to public site">
            <svg style={{ width: 22, height: 22 }} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2 20h20v2H2v-2zm1-7l4 5h10l4-5-3-6-4 4-3-7-3 7-4-4-1 6z" fill="var(--color-primary)" />
            </svg>
            <span style={s.sidebarLogoText}>The Armory</span>
          </Link>
        </div>

        <div style={s.userCard}>
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              style={s.avatar}
            />
          ) : (
            <div style={s.avatarFallback} aria-hidden="true">
              {avatarLetter}
            </div>
          )}
          <div style={s.userInfo}>
            <p style={s.userName}>{displayName}</p>
            <p style={s.userRole}>{userRole}</p>
          </div>
        </div>

        {/* Nav links */}
        <nav style={s.sidebarNav}>
          <ul style={s.linkList}>
            {MEMBER_LINKS.map((link) => (
              <li key={link.path}>
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

          {/* Admin section */}
          {(isAdmin || isEdgeKeeper) && (
            <>
              <div style={s.sectionDivider}>
                <span style={s.sectionLabel}>Administration</span>
              </div>
              <ul style={s.linkList}>
                {ADMIN_LINKS.map((link) => (
                  <li key={link.path}>
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

        {/* Sign out */}
        <div style={s.sidebarFooter}>
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

      {/* -------- Main content -------- */}
      <main className="hvk-armory-main" style={s.main}>
        <div style={s.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline SVG icon components                                         */
/* ------------------------------------------------------------------ */
function DashboardIcon({ active }) {
  const color = active ? 'var(--color-primary)' : 'var(--color-text-secondary)';
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
  const color = active ? 'var(--color-primary)' : 'var(--color-text-secondary)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.8" />
      <path d="M12 8v8M9 11h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ScriptureIcon({ active }) {
  const color = active ? 'var(--color-primary)' : 'var(--color-text-secondary)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DisciplineIcon({ active }) {
  const color = active ? 'var(--color-primary)' : 'var(--color-text-secondary)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M2 17l10 5 10-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12l10 5 10-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatsIcon({ active }) {
  const color = active ? 'var(--color-primary)' : 'var(--color-text-secondary)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProfileIcon({ active }) {
  const color = active ? 'var(--color-primary)' : 'var(--color-text-secondary)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
      <path d="M20 21a8 8 0 10-16 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ManageUsersIcon({ active }) {
  const color = active ? 'var(--color-primary)' : 'var(--color-text-secondary)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="7" r="3.5" stroke={color} strokeWidth="1.8" />
      <path d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 8v6M16 11h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function AwardCoinsIcon({ active }) {
  const color = active ? 'var(--color-primary)' : 'var(--color-text-secondary)';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <path d="M14.5 9.5a3 3 0 10-5 2.2c.8.6 1.5 1.3 1.5 2.3h3c0-1 .7-1.7 1.5-2.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 17h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function RelationshipsIcon({ active }) {
  const color = active ? 'var(--color-primary)' : 'var(--color-text-secondary)';
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
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="var(--color-text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="var(--color-text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline style objects                                               */
/* ------------------------------------------------------------------ */
const SIDEBAR_WIDTH = '260px';

const s = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg-alt)',
  },

  /* mobile top bar */
  mobileTopBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--header-height)',
    backgroundColor: 'var(--color-bg)',
    borderBottom: '1px solid var(--color-border)',
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
    borderRadius: 'var(--radius-sm)',
    WebkitTapHighlightColor: 'transparent',
  },
  mobileTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },

  /* overlay */
  overlay: {
    display: 'none',
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1099,
  },

  /* sidebar */
  sidebar: {
    width: SIDEBAR_WIDTH,
    minWidth: SIDEBAR_WIDTH,
    height: '100vh',
    position: 'sticky',
    top: 0,
    backgroundColor: 'var(--color-bg)',
    borderRight: '1px solid var(--color-border)',
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
    gap: '8px',
    textDecoration: 'none',
  },
  sidebarLogoText: {
    fontSize: '17px',
    fontWeight: 700,
    color: 'var(--color-primary)',
    letterSpacing: '0.5px',
  },

  /* user card */
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    borderBottom: '1px solid var(--color-border)',
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
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 700,
    flexShrink: 0,
  },
  userInfo: {
    overflow: 'hidden',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text)',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    margin: 0,
  },

  /* nav */
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
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    borderLeft: '3px solid transparent',
    transition: 'color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
  },
  sidebarLinkActive: {
    color: 'var(--color-primary)',
    fontWeight: 600,
    backgroundColor: 'rgba(220,20,60,0.06)',
    borderLeftColor: 'var(--color-primary)',
  },

  /* admin section divider */
  sectionDivider: {
    padding: '16px 20px 8px',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },

  /* sidebar footer */
  sidebarFooter: {
    padding: '12px 16px 20px',
    borderTop: '1px solid var(--color-border)',
    marginTop: 'auto',
  },
  signOutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    background: 'none',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },

  /* main content */
  main: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: '32px',
    maxWidth: '1100px',
    width: '100%',
    margin: '0 auto',
  },
};
