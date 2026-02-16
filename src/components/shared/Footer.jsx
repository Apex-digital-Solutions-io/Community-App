import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        {/* Brand & mission */}
        <div style={s.brandSection}>
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
          <p style={s.tagline}>
            Forging brotherhood through discipline, accountability, and faith.
          </p>
        </div>

        {/* Divider */}
        <div style={s.divider} />

        {/* Bottom row */}
        <div style={s.bottom}>
          <p style={s.copyright}>
            &copy; {year} Hidden Valley Kings. All rights reserved.
          </p>
          <div style={s.bottomLinks}>
            <Link to="/armory" style={s.bottomLink}>
              The Armory
            </Link>
            <span style={s.dot}>&middot;</span>
            <Link to="/resources" style={s.bottomLink}>
              Resources
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- styles ---------- */
const s = {
  footer: {
    backgroundColor: 'var(--color-bg-dark)',
    color: '#ccc',
    marginTop: 'auto',
  },
  inner: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    padding: '40px 24px 32px',
  },

  /* brand */
  brandSection: {
    marginBottom: '24px',
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    marginBottom: '12px',
  },
  crownIcon: {
    width: '22px',
    height: '22px',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 800,
    color: 'var(--color-primary)',
    letterSpacing: '2px',
    fontFamily: 'var(--font-family)',
  },
  tagline: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#999',
    maxWidth: '420px',
    margin: 0,
  },

  /* divider */
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: '20px',
  },

  /* bottom row */
  bottom: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  copyright: {
    fontSize: '13px',
    color: '#777',
    margin: 0,
  },
  bottomLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  bottomLink: {
    fontSize: '13px',
    color: '#999',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  dot: {
    color: '#555',
    fontSize: '13px',
  },
};
