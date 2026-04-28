import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/shared/Navbar';

const STYLE_ID = 'hvk-auth-responsive';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
    .hvk-auth-input:focus {
      border-color: var(--crimson) !important;
      box-shadow: 0 0 0 2px rgba(184, 28, 44, 0.18) !important;
    }
    .hvk-auth-input::placeholder { color: var(--parchment-dim); opacity: 0.5; }
    .hvk-auth-btn:hover:not(:disabled) { opacity: 0.9; }
    .hvk-auth-link:hover { color: var(--parchment) !important; }
  `;
  document.head.appendChild(el);
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/armory/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.themeToggleWrap}>
        <ThemeToggle />
      </div>

      <div style={s.card}>
        <div style={s.logoWrap}>
          <img src="/hvklogo.png" alt="HVK" style={s.logo} />
        </div>

        <div style={s.rule} />

        <div style={s.headerSection}>
          <p style={s.eyebrow}>THE ARMORY</p>
          <h1 style={s.heading}>Sign In</h1>
          <p style={s.subheading}>Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} style={s.form} noValidate>
          <div style={s.fieldGroup}>
            <label htmlFor="login-email" style={s.label}>EMAIL</label>
            <input
              id="login-email"
              className="hvk-auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              style={s.input}
            />
          </div>

          <div style={s.fieldGroup}>
            <label htmlFor="login-password" style={s.label}>PASSWORD</label>
            <input
              id="login-password"
              className="hvk-auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              style={s.input}
            />
          </div>

          <button
            type="submit"
            className="hvk-auth-btn"
            disabled={loading}
            style={{
              ...s.submitButton,
              ...(loading ? s.submitButtonDisabled : {}),
            }}
          >
            {loading ? 'SIGNING IN...' : 'ENTER THE ARMORY'}
          </button>

          {error && (
            <div style={s.errorBox} role="alert">
              {error}
            </div>
          )}
        </form>

        <div style={s.footer}>
          <Link to="/armory/register" className="hvk-auth-link" style={s.footerLink}>
            New here? Request access
          </Link>
        </div>

        <div style={s.scripture}>
          <em>"Put on the full armor of God" — Ephesians 6:11</em>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--field-bg)',
    padding: '24px',
    fontFamily: "'EB Garamond', 'Georgia', serif",
    position: 'relative',
    backgroundImage:
      'radial-gradient(ellipse at 50% 0%, rgba(184,28,44,0.06) 0%, transparent 60%), repeating-linear-gradient(180deg, transparent, transparent 80px, rgba(184,28,44,0.012) 80px, rgba(184,28,44,0.012) 81px)',
  },
  themeToggleWrap: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'var(--anvil)',
    border: '2px solid var(--rule)',
    padding: '40px 32px',
    position: 'relative',
  },
  logoWrap: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  logo: {
    width: '64px',
    height: '64px',
    objectFit: 'contain',
    opacity: 0.9,
  },
  rule: {
    width: '60px',
    height: '2px',
    backgroundColor: 'var(--crimson)',
    margin: '0 auto 20px',
    opacity: 0.85,
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    letterSpacing: '3px',
    color: 'var(--crimson)',
    margin: '0 0 8px',
    textTransform: 'uppercase',
  },
  heading: {
    fontFamily: "'Cinzel', 'Georgia', serif",
    fontSize: '26px',
    fontWeight: '700',
    color: 'var(--parchment)',
    marginBottom: '8px',
    lineHeight: '1.2',
  },
  subheading: {
    fontSize: '15px',
    color: 'var(--parchment-dim)',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    fontWeight: '500',
    letterSpacing: '2px',
    color: 'var(--parchment-dim)',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    fontSize: '15px',
    lineHeight: '1.5',
    fontFamily: "'EB Garamond', 'Georgia', serif",
    color: 'var(--parchment)',
    backgroundColor: 'var(--onyx)',
    border: '1px solid var(--rule)',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  },
  submitButton: {
    width: '100%',
    padding: '13px 20px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2.5px',
    color: '#ffffff',
    backgroundColor: 'var(--crimson)',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    marginTop: '4px',
    textTransform: 'uppercase',
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  errorBox: {
    padding: '12px 14px',
    fontSize: '14px',
    color: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    lineHeight: '1.4',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid var(--rule)',
  },
  footerLink: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '1.5px',
    color: 'var(--crimson)',
    textDecoration: 'none',
    textTransform: 'uppercase',
  },
  scripture: {
    textAlign: 'center',
    marginTop: '20px',
    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
    fontSize: '13px',
    color: 'var(--parchment-dim)',
    opacity: 0.6,
    fontStyle: 'italic',
  },
};
