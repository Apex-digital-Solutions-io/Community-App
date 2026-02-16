import { BookOpen, Hammer } from 'lucide-react';

const styles = {
  page: {
    width: '100%',
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 24px',
    textAlign: 'center',
  },
  iconWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    marginBottom: '32px',
  },
  heading: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 900,
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 20px',
    borderRadius: '999px',
    background: 'rgba(220,20,60,0.08)',
    color: 'var(--color-primary)',
    fontWeight: 700,
    fontSize: '0.9rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '24px',
  },
  description: {
    fontSize: '1.05rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7,
    maxWidth: '480px',
  },
  accent: {
    width: '48px',
    height: '4px',
    borderRadius: '2px',
    background: 'var(--color-primary)',
    margin: '32px auto 0',
  },
};

export default function ResourcesPage() {
  return (
    <div style={styles.page}>
      <div style={styles.iconWrap}>
        <BookOpen size={36} />
      </div>
      <h1 style={styles.heading}>Resources</h1>
      <div style={styles.badge}>
        <Hammer size={16} />
        Coming Soon
      </div>
      <p style={styles.description}>
        We are currently preparing a library of Bible studies, reading lists,
        devotionals, and discipleship tools for the brotherhood. Check back soon
        — great things are being forged.
      </p>
      <div style={styles.accent} />
    </div>
  );
}
