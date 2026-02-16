import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  ShieldCheck,
  Flame,
  Crown,
  Wind,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

const styles = {
  page: {
    width: '100%',
    overflow: 'hidden',
  },

  /* ── Hero ────────────────────────────────────────────────── */
  hero: {
    position: 'relative',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '120px 24px 80px',
    background:
      'linear-gradient(165deg, #fff 0%, #fff5f7 40%, #fce4ec 100%)',
  },
  heroAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '6px',
    background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-light))',
  },
  heroInner: {
    maxWidth: '820px',
    position: 'relative',
    zIndex: 1,
  },
  heroTag: {
    display: 'inline-block',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: 'var(--color-primary)',
    marginBottom: '20px',
    padding: '6px 18px',
    border: '1.5px solid var(--color-primary)',
    borderRadius: '999px',
  },
  heroHeading: {
    fontSize: 'clamp(2.8rem, 7vw, 5rem)',
    fontWeight: 900,
    lineHeight: 1.05,
    color: 'var(--color-text)',
    letterSpacing: '-1.5px',
    marginBottom: '20px',
  },
  heroTagline: {
    fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  heroDescription: {
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7,
    maxWidth: '620px',
    margin: '0 auto 40px',
  },
  heroCtas: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    background: 'var(--color-primary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    transition: 'background 0.2s, transform 0.15s',
    cursor: 'pointer',
  },
  btnOutline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-primary)',
    background: 'transparent',
    border: '2px solid var(--color-primary)',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    transition: 'background 0.2s, color 0.2s',
    cursor: 'pointer',
  },
  scrollHint: {
    position: 'absolute',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'var(--color-text-muted)',
    animation: 'none',
    opacity: 0.5,
  },

  /* ── Section generic ─────────────────────────────────────── */
  section: {
    padding: '100px 24px',
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
  },
  sectionAlt: {
    padding: '100px 24px',
    background: 'var(--color-bg-alt)',
  },
  sectionInner: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  sectionTag: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: 'var(--color-primary)',
    marginBottom: '12px',
  },
  sectionTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 800,
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  sectionSubtitle: {
    fontSize: '1.05rem',
    color: 'var(--color-text-secondary)',
    maxWidth: '640px',
    margin: '0 auto',
    lineHeight: 1.7,
  },

  /* ── Mission / Vision / Values ───────────────────────────── */
  missionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
  },
  missionCard: {
    background: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px 32px',
    boxShadow: 'var(--shadow-md)',
    borderTop: '4px solid var(--color-primary)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  missionIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    color: '#fff',
  },
  missionCardTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '12px',
  },
  missionCardText: {
    fontSize: '0.95rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7,
  },

  /* ── Features ────────────────────────────────────────────── */
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '28px',
  },
  featureCard: {
    display: 'flex',
    gap: '20px',
    padding: '28px',
    background: 'var(--color-bg)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
    transition: 'box-shadow 0.2s, border-color 0.2s',
  },
  featureIconWrap: {
    flexShrink: 0,
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(220,20,60,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-primary)',
  },
  featureTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '6px',
  },
  featureDesc: {
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  },

  /* ── Final CTA ───────────────────────────────────────────── */
  ctaSection: {
    padding: '100px 24px',
    background: 'linear-gradient(165deg, var(--color-text) 0%, #2a1015 100%)',
    textAlign: 'center',
    color: '#fff',
  },
  ctaQuote: {
    fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
    fontWeight: 600,
    fontStyle: 'italic',
    maxWidth: '700px',
    margin: '0 auto 12px',
    lineHeight: 1.5,
  },
  ctaRef: {
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '40px',
  },
  ctaBtnLight: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 36px',
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
    background: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'transform 0.15s',
  },
};

const features = [
  {
    icon: BookOpen,
    title: 'Biblical Teaching',
    desc: 'Rooted in the Word of God, our teachings equip you with sound doctrine and practical application for daily living.',
  },
  {
    icon: Users,
    title: 'Authentic Fellowship',
    desc: 'Real relationships built on trust, vulnerability, and shared faith — a brotherhood that goes beyond the surface.',
  },
  {
    icon: ShieldCheck,
    title: 'Personal Accountability',
    desc: 'Consistent check-ins and honest conversations that challenge you to walk in integrity and holiness.',
  },
  {
    icon: Flame,
    title: 'Spiritual Disciplines',
    desc: 'Structured practices — prayer, fasting, Scripture memory, and worship — that strengthen your walk with Christ.',
  },
  {
    icon: Crown,
    title: 'Leadership Development',
    desc: 'A clear discipleship pipeline that empowers you to grow from learner to leader to mentor in God\'s Kingdom.',
  },
  {
    icon: Wind,
    title: 'Spirit-Led Living',
    desc: 'Learning to hear, follow, and move in step with the Holy Spirit in every area of life.',
  },
];

export default function HomePage() {
  return (
    <div style={styles.page}>
      {/* ── Hero ─────────────────────────────── */}
      <section style={styles.hero}>
        <div style={styles.heroAccent} />
        <div style={styles.heroInner}>
          <span style={styles.heroTag}>Hidden Valley Kings</span>
          <h1 style={styles.heroHeading}>RISE UP, KINGS</h1>
          <p style={styles.heroTagline}>
            A Brotherhood of Disciples Building God's Kingdom
          </p>
          <p style={styles.heroDescription}>
            Hidden Valley Kings is a Christ-centered community of men committed
            to growing together through Scripture, accountability, and the power
            of the Holy Spirit. We exist to sharpen one another and walk boldly
            in the calling God has placed on our lives.
          </p>
          <div style={styles.heroCtas}>
            <Link to="/armory" style={styles.btnPrimary}>
              Join the Movement <ArrowRight size={18} />
            </Link>
            <a href="#about" style={styles.btnOutline}>
              Learn More <ChevronDown size={18} />
            </a>
          </div>
        </div>
        <div style={styles.scrollHint}>
          <ChevronDown size={28} />
        </div>
      </section>

      {/* ── Mission / Vision / Values ────────── */}
      <section id="about" style={styles.sectionAlt}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTag}>Who We Are</span>
            <h2 style={styles.sectionTitle}>Mission, Vision &amp; Values</h2>
            <p style={styles.sectionSubtitle}>
              Everything we do is anchored in the truth of Scripture and driven
              by a desire to see men transformed by Christ.
            </p>
          </div>

          <div style={styles.missionGrid}>
            {/* Mission */}
            <div style={styles.missionCard}>
              <div style={styles.missionIcon}>
                <BookOpen size={26} />
              </div>
              <h3 style={styles.missionCardTitle}>Our Mission</h3>
              <p style={styles.missionCardText}>
                Hidden Valley Kings exists to make disciples of Christ by
                providing fellowship, mentorship, and spiritual guidance,
                equipping individuals to grow in spiritual disciplines, walk in
                the power of the Holy Spirit, and become vessels for honorable
                use in God's Kingdom.
              </p>
            </div>

            {/* Vision */}
            <div style={styles.missionCard}>
              <div style={styles.missionIcon}>
                <Crown size={26} />
              </div>
              <h3 style={styles.missionCardTitle}>Our Vision</h3>
              <p style={styles.missionCardText}>
                To see individuals transformed into the image of Christ, living
                in their God-given identity, free from sin, and walking in the
                authority and purpose of the Holy Spirit for the glory of God and
                the advancement of His Kingdom.
              </p>
            </div>

            {/* Values */}
            <div style={styles.missionCard}>
              <div style={styles.missionIcon}>
                <Users size={26} />
              </div>
              <h3 style={styles.missionCardTitle}>Our Values</h3>
              <p style={styles.missionCardText}>
                Iron sharpens iron — We believe in the power of authentic
                brotherhood to transform lives through accountability,
                scripture, and the Holy Spirit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Offer ────────────────────── */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTag}>What We Offer</span>
          <h2 style={styles.sectionTitle}>Built for Growth</h2>
          <p style={styles.sectionSubtitle}>
            Six pillars that shape every gathering, conversation, and
            discipleship relationship within our brotherhood.
          </p>
        </div>

        <div style={styles.featuresGrid}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={styles.featureCard}>
              <div style={styles.featureIconWrap}>
                <Icon size={24} />
              </div>
              <div>
                <h3 style={styles.featureTitle}>{title}</h3>
                <p style={styles.featureDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────── */}
      <section style={styles.ctaSection}>
        <p style={styles.ctaQuote}>
          "As iron sharpens iron, so one man sharpens another."
        </p>
        <p style={styles.ctaRef}>— Proverbs 27:17</p>
        <Link to="/armory" style={styles.ctaBtnLight}>
          Join the Brotherhood <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
