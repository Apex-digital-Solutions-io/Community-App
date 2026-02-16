import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div style={s.loaderWrapper} role="status" aria-label="Checking authentication">
        <div style={s.spinnerTrack}>
          <div style={s.spinner} />
        </div>
        <p style={s.loaderText}>Loading...</p>
      </div>
    );
  }

  /* ---- Not authenticated ---- */
  if (!user) {
    return <Navigate to="/armory/login" state={{ from: location }} replace />;
  }

  /* ---- Authenticated ---- */
  return <Outlet />;
}

/* ------------------------------------------------------------------ */
/*  Keyframe animation (injected once)                                 */
/* ------------------------------------------------------------------ */
const STYLE_ID = 'hvk-protected-route-spinner';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    @keyframes hvk-spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(el);
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const s = {
  loaderWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg)',
    gap: '20px',
  },
  spinnerTrack: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '4px solid var(--color-border)',
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    inset: '-4px',
    borderRadius: '50%',
    border: '4px solid transparent',
    borderTopColor: 'var(--color-primary)',
    animation: 'hvk-spin 0.8s linear infinite',
  },
  loaderText: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    margin: 0,
    fontWeight: 500,
  },
};
