import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ThemeToggle } from '../../components/shared/Navbar';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: '',
    invitedBy: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim() ||
      !formData.state.trim() ||
      !formData.invitedBy.trim()
    ) {
      return 'All fields are required.';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from('user_requests')
        .insert({
          user_request_first_name: formData.firstName.trim(),
          user_request_last_name: formData.lastName.trim(),
          user_request_email: formData.email.trim(),
          user_request_state: formData.state.trim(),
          user_request_invited_by: formData.invitedBy.trim(),
          user_request_status: 'New Request',
        });

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={s.page}>
        <div style={s.themeToggleWrap}><ThemeToggle /></div>
        <div style={s.card}>
          <div style={s.logoWrap}>
            <img src="/hvklogo.png" alt="HVK" style={s.logo} />
          </div>
          <div style={s.rule} />
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="var(--crimson)" />
            </svg>
          </div>
          <h2 style={s.successHeading}>Request Submitted</h2>
          <p style={s.successMessage}>
            Your request has been submitted. You'll be notified when approved.
          </p>
          <div style={s.footer}>
            <Link to="/armory/login" className="hvk-auth-link" style={s.footerLink}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fields = [
    { id: 'reg-firstName', name: 'firstName', label: 'FIRST NAME', placeholder: 'John', autoComplete: 'given-name', type: 'text' },
    { id: 'reg-lastName', name: 'lastName', label: 'LAST NAME', placeholder: 'Doe', autoComplete: 'family-name', type: 'text' },
    { id: 'reg-email', name: 'email', label: 'EMAIL', placeholder: 'you@example.com', autoComplete: 'email', type: 'email', full: true },
    { id: 'reg-password', name: 'password', label: 'PASSWORD', placeholder: 'Min 6 characters', autoComplete: 'new-password', type: 'password' },
    { id: 'reg-confirmPassword', name: 'confirmPassword', label: 'CONFIRM PASSWORD', placeholder: 'Re-enter password', autoComplete: 'new-password', type: 'password' },
    { id: 'reg-state', name: 'state', label: 'STATE', placeholder: 'e.g. Texas', autoComplete: 'address-level1', type: 'text', full: true },
    { id: 'reg-invitedBy', name: 'invitedBy', label: 'INVITED BY', placeholder: 'Name of the person who invited you', type: 'text', full: true },
  ];

  const renderField = (f) => (
    <div key={f.id} style={s.fieldGroup}>
      <label htmlFor={f.id} style={s.label}>{f.label}</label>
      <input
        id={f.id}
        className="hvk-auth-input"
        type={f.type}
        name={f.name}
        value={formData[f.name]}
        onChange={handleChange}
        placeholder={f.placeholder}
        autoComplete={f.autoComplete}
        required
        style={s.input}
      />
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.themeToggleWrap}><ThemeToggle /></div>

      <div style={s.card}>
        <div style={s.logoWrap}>
          <img src="/hvklogo.png" alt="HVK" style={s.logo} />
        </div>

        <div style={s.rule} />

        <div style={s.headerSection}>
          <p style={s.eyebrow}>THE ARMORY</p>
          <h1 style={s.heading}>Request Access</h1>
          <p style={s.subheading}>Fill out the form below to request membership</p>
        </div>

        <form onSubmit={handleSubmit} style={s.form} noValidate>
          <div style={s.row}>
            {renderField(fields[0])}
            {renderField(fields[1])}
          </div>

          {renderField(fields[2])}

          <div style={s.row}>
            {renderField(fields[3])}
            {renderField(fields[4])}
          </div>

          {renderField(fields[5])}
          {renderField(fields[6])}

          <button
            type="submit"
            className="hvk-auth-btn"
            disabled={loading}
            style={{
              ...s.submitButton,
              ...(loading ? s.submitButtonDisabled : {}),
            }}
          >
            {loading ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
          </button>

          {error && (
            <div style={s.errorBox} role="alert">
              {error}
            </div>
          )}
        </form>

        <div style={s.footer}>
          <Link to="/armory/login" className="hvk-auth-link" style={s.footerLink}>
            Already have an account? Sign In
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
    maxWidth: '520px',
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
    gap: '18px',
  },
  row: {
    display: 'flex',
    gap: '14px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
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
  successHeading: {
    fontFamily: "'Cinzel', 'Georgia', serif",
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--parchment)',
    textAlign: 'center',
    marginBottom: '12px',
  },
  successMessage: {
    fontSize: '15px',
    color: 'var(--parchment-dim)',
    textAlign: 'center',
    lineHeight: '1.6',
    margin: 0,
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
