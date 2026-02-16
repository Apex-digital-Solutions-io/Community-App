import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

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
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          state: formData.state.trim(),
          invited_by: formData.invitedBy.trim(),
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
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successIcon}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                fill="var(--color-success)"
              />
            </svg>
          </div>
          <h2 style={styles.successHeading}>Request Submitted</h2>
          <p style={styles.successMessage}>
            Your request has been submitted. You'll be notified when approved.
          </p>
          <div style={styles.footer}>
            <Link to="/armory/login" style={styles.footerLink}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerSection}>
          <h1 style={styles.heading}>Request Access to The Armory</h1>
          <p style={styles.subheading}>
            Fill out the form below to request membership
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label htmlFor="reg-firstName" style={styles.label}>
                First Name
              </label>
              <input
                id="reg-firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                autoComplete="given-name"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="reg-lastName" style={styles.label}>
                Last Name
              </label>
              <input
                id="reg-lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                autoComplete="family-name"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="reg-email" style={styles.label}>
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label htmlFor="reg-password" style={styles.label}>
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                autoComplete="new-password"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="reg-confirmPassword" style={styles.label}>
                Confirm Password
              </label>
              <input
                id="reg-confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                autoComplete="new-password"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="reg-state" style={styles.label}>
              State
            </label>
            <input
              id="reg-state"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Texas"
              autoComplete="address-level1"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="reg-invitedBy" style={styles.label}>
              Invited By
            </label>
            <input
              id="reg-invitedBy"
              type="text"
              name="invitedBy"
              value={formData.invitedBy}
              onChange={handleChange}
              placeholder="Name of the person who invited you"
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
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>

          {error && (
            <div style={styles.errorBox} role="alert">
              {error}
            </div>
          )}
        </form>

        <div style={styles.footer}>
          <Link to="/armory/login" style={styles.footerLink}>
            Already have an account? Sign In
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
    maxWidth: '520px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: '40px 32px',
    border: '1px solid var(--color-border)',
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '28px',
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
  successIcon: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  successHeading: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--color-text)',
    textAlign: 'center',
    marginBottom: '12px',
  },
  successMessage: {
    fontSize: '15px',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
    lineHeight: '1.6',
    margin: 0,
  },
};
