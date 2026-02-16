import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerSection}>
          <h1 style={styles.heading}>Sign In to The Armory</h1>
          <p style={styles.subheading}>Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={styles.fieldGroup}>
            <label htmlFor="login-email" style={styles.label}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="login-password" style={styles.label}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {}),
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {error && (
            <div style={styles.errorBox} role="alert">
              {error}
            </div>
          )}
        </form>

        <div style={styles.footer}>
          <Link to="/armory/register" style={styles.footerLink}>
            New here? Request access
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-alt)',
    padding: '24px',
    fontFamily: 'var(--font-family)',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: '40px 32px',
    border: '1px solid var(--color-border)',
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '8px',
    lineHeight: '1.2',
  },
  subheading: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
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
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '15px',
    lineHeight: '1.5',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  },
  submitButton: {
    width: '100%',
    padding: '12px 20px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'var(--color-primary)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, opacity 0.2s ease',
    marginTop: '4px',
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  errorBox: {
    padding: '12px 14px',
    fontSize: '14px',
    color: 'var(--color-error)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 'var(--radius-sm)',
    lineHeight: '1.4',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid var(--color-border)',
  },
  footerLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-primary)',
    textDecoration: 'none',
  },
};
