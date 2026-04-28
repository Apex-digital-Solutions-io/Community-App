import { Link } from 'react-router-dom';

export default function ResourcesPage() {
  return (
    <section style={s.section}>
      <div style={s.frame}>
        <div style={{ ...s.tick, top: -5, left: -5 }} />
        <div style={{ ...s.tick, top: -5, right: -5 }} />
        <div style={{ ...s.tick, bottom: -5, left: -5 }} />
        <div style={{ ...s.tick, bottom: -5, right: -5 }} />
        <div style={s.innerBorder} />

        <div style={s.eyebrow}>HIDDEN VALLEY KINGS · IN DEVELOPMENT</div>

        <div style={s.logoWrap}>
          <img src="/hvklogo.png" alt="HVK" style={s.logo} />
        </div>

        <div style={s.rule}>
          <div style={s.ruleLine} />
          <div style={s.ruleTick} />
          <div style={s.ruleLine} />
        </div>

        <h1 style={s.title}>COMING SOON</h1>
        <p style={s.subtitle}>Resources in Development</p>

        <p style={s.description}>
          We're building a comprehensive resource library with downloads,
          teachings, tools, and materials to equip you for Kingdom advancement.
          Check back soon.
        </p>

        <Link to="/" style={s.button}>Return Home</Link>

        <div style={s.scripture}>
          <div style={s.quote}>"Be strong and courageous. Do not be afraid…"</div>
          <div style={s.ref}>— Joshua 1:9</div>
        </div>
      </div>
    </section>
  );
}

const s = {
  section: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
  },
  frame: {
    position: 'relative',
    maxWidth: '760px',
    width: '100%',
    padding: '80px 60px',
    border: '1.5px solid var(--crimson)',
    textAlign: 'center',
  },
  innerBorder: {
    position: 'absolute',
    inset: '8px',
    border: '0.5px solid var(--rule-soft)',
    pointerEvents: 'none',
  },
  tick: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    background: 'var(--crimson)',
  },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    letterSpacing: '6px',
    color: 'var(--crimson)',
    textTransform: 'uppercase',
    marginBottom: '32px',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '28px',
  },
  logo: {
    width: '110px',
    height: '110px',
    objectFit: 'contain',
  },
  rule: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    margin: '24px auto',
    maxWidth: '280px',
  },
  ruleLine: { flex: 1, height: '1px', background: 'var(--rule-soft)' },
  ruleTick: { width: '10px', height: '5px', background: 'var(--crimson)' },
  title: {
    fontFamily: "'Cinzel', serif",
    fontWeight: 800,
    fontSize: 'clamp(40px, 7vw, 64px)',
    letterSpacing: '8px',
    color: 'var(--parchment)',
    lineHeight: 1,
    textShadow: 'var(--display-shadow)',
    marginBottom: '18px',
  },
  subtitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontSize: '22px',
    color: 'var(--crimson)',
    letterSpacing: '1.5px',
    marginBottom: '32px',
  },
  description: {
    fontFamily: "'EB Garamond', serif",
    fontSize: '17px',
    lineHeight: 1.7,
    color: 'var(--parchment)',
    maxWidth: '540px',
    margin: '0 auto 44px',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 36px',
    background: 'var(--crimson)',
    color: '#F4E8D0',
    border: '1.5px solid var(--crimson)',
    fontFamily: "'Cinzel', serif",
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    textDecoration: 'none',
  },
  scripture: {
    marginTop: '40px',
  },
  quote: {
    fontFamily: "'EB Garamond', serif",
    fontStyle: 'italic',
    fontSize: '14px',
    color: 'var(--parchment-dim)',
    marginBottom: '8px',
  },
  ref: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    letterSpacing: '3px',
    color: 'var(--crimson)',
    textTransform: 'uppercase',
  },
};
