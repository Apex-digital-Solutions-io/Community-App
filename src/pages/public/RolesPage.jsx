import {
  Sword,
  ShieldCheck,
  Crown,
  CheckCircle,
  ArrowDown,
  Users,
} from 'lucide-react';

const styles = {
  page: {
    width: '100%',
  },

  /* ── Header ──────────────────────────────────────────────── */
  header: {
    padding: '100px 24px 60px',
    textAlign: 'center',
    background:
      'linear-gradient(165deg, #fff 0%, #fff5f7 40%, #fce4ec 100%)',
    borderBottom: '1px solid var(--color-border)',
  },
  headerTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: 'var(--color-primary)',
    marginBottom: '16px',
  },
  headerTitle: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 900,
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  headerSub: {
    fontSize: '1.05rem',
    color: 'var(--color-text-secondary)',
    maxWidth: '620px',
    margin: '0 auto',
    lineHeight: 1.7,
  },

  /* ── Content ─────────────────────────────────────────────── */
  content: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    padding: '60px 24px 100px',
  },

  /* ── Intro ───────────────────────────────────────────────── */
  intro: {
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto 60px',
  },
  introText: {
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7,
  },

  /* ── Role Cards ──────────────────────────────────────────── */
  rolesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
    marginBottom: '80px',
  },
  roleCard: {
    background: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
  },
  roleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    padding: '28px 32px',
    color: '#fff',
  },
  roleIconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleName: {
    fontSize: '1.4rem',
    fontWeight: 800,
  },
  roleGreek: {
    fontSize: '0.9rem',
    opacity: 0.8,
    fontStyle: 'italic',
  },
  roleSubtitle: {
    fontSize: '0.9rem',
    opacity: 0.85,
    fontWeight: 500,
  },
  roleTierBadge: {
    marginLeft: 'auto',
    padding: '6px 16px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.18)',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  roleBody: {
    padding: '32px',
  },
  roleDescription: {
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7,
    marginBottom: '24px',
  },
  dutiesTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  dutiesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
  },
  dutyItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '0.95rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },
  dutyIcon: {
    flexShrink: 0,
    marginTop: '2px',
  },

  /* ── Hierarchy Diagram ───────────────────────────────────── */
  hierarchySection: {
    textAlign: 'center',
  },
  hierarchyTitle: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: 'var(--color-text)',
    marginBottom: '8px',
  },
  hierarchySub: {
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '48px',
  },
  pyramid: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
  },
  pyramidTier: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pyramidBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '20px 36px',
    borderRadius: 'var(--radius-md)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.05rem',
    minWidth: '260px',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-md)',
  },
  pyramidArrow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 0',
    color: 'var(--color-text-muted)',
  },
  pyramidArrowLine: {
    width: '2px',
    height: '20px',
    background: 'var(--color-border)',
  },
  pyramidLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginTop: '4px',
  },

  /* ── Scripture Banner ────────────────────────────────────── */
  scriptureBanner: {
    marginTop: '80px',
    padding: '48px 32px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
    borderRadius: 'var(--radius-lg)',
    color: '#fff',
  },
  scriptureText: {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    fontWeight: 500,
    maxWidth: '600px',
    margin: '0 auto 12px',
    lineHeight: 1.6,
  },
  scriptureRef: {
    fontSize: '0.9rem',
    opacity: 0.7,
  },
};

const roles = [
  {
    name: 'Swordsman',
    greek: 'Mathetes',
    subtitle: 'Disciple in Training',
    tier: 'Tier 1',
    icon: Sword,
    gradient: 'linear-gradient(135deg, #4a6fa5, #3a5a8a)',
    description:
      'The Swordsman is a new or growing disciple learning to wield the Word of God. This role focuses on building foundational spiritual habits and engaging consistently with the community.',
    duties: [
      'Daily Bible reading and personal devotion',
      'Build healthy spiritual habits and routines',
      'Memorize Scripture passages weekly',
      'Attend Thursday Bible studies consistently',
      'Weekly accountability with an Edge Keeper',
    ],
  },
  {
    name: 'Edge Keeper',
    greek: 'Diakonos',
    subtitle: 'Deacon / Discipler',
    tier: 'Tier 2',
    icon: ShieldCheck,
    gradient: 'linear-gradient(135deg, #b8860b, #8b6914)',
    description:
      'The Edge Keeper is a proven disciple who now sharpens others. This role carries the responsibility of mentoring Swordsmen, leading in small group settings, and helping expand the brotherhood.',
    duties: [
      'Mentor and disciple assigned Swordsmen',
      'Conduct weekly check-ins with mentees',
      'Lead small group discussions and breakouts',
      'Recruit and onboard new members',
      'Fulfill all Swordsman duties as an example',
    ],
  },
  {
    name: 'Forge Keeper',
    greek: 'Episkopos',
    subtitle: 'Elder / Overseer',
    tier: 'Tier 3',
    icon: Crown,
    gradient: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
    description:
      'The Forge Keeper is the spiritual overseer who leads, teaches, and guards the health of the community. This role demands maturity, doctrinal soundness, and a heart for shepherding others.',
    duties: [
      'Lead Thursday Scripture studies and teachings',
      'Provide one-on-one discipleship to Edge Keepers',
      'Handle discipline and conflict resolution biblically',
      'Create and prepare teachings and study materials',
      'Oversee Edge Keepers and the overall discipleship pipeline',
    ],
  },
];

export default function RolesPage() {
  return (
    <div style={styles.page}>
      {/* ── Page Header ──────────────────────── */}
      <header style={styles.header}>
        <span style={styles.headerTag}>
          <Users size={16} /> Discipleship Pipeline
        </span>
        <h1 style={styles.headerTitle}>Roles &amp; Responsibilities</h1>
        <p style={styles.headerSub}>
          Our three-tier discipleship pipeline is designed to move every man
          from learner to leader, sharpening each other along the way.
        </p>
      </header>

      <div style={styles.content}>
        {/* ── Intro ──────────────────────────── */}
        <div style={styles.intro}>
          <p style={styles.introText}>
            Every member of Hidden Valley Kings enters as a Swordsman and grows
            through intentional discipleship. As faithfulness and maturity
            increase, men are called into greater responsibility — first as Edge
            Keepers who disciple others, and ultimately as Forge Keepers who
            oversee the community.
          </p>
        </div>

        {/* ── Role Cards ────────────────────── */}
        <div style={styles.rolesGrid}>
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <article key={role.name} style={styles.roleCard}>
                <div
                  style={{
                    ...styles.roleHeader,
                    background: role.gradient,
                  }}
                >
                  <div style={styles.roleIconWrap}>
                    <Icon size={26} />
                  </div>
                  <div>
                    <div style={styles.roleName}>{role.name}</div>
                    <div style={styles.roleGreek}>{role.greek}</div>
                    <div style={styles.roleSubtitle}>{role.subtitle}</div>
                  </div>
                  <div style={styles.roleTierBadge}>{role.tier}</div>
                </div>
                <div style={styles.roleBody}>
                  <p style={styles.roleDescription}>{role.description}</p>
                  <h4 style={styles.dutiesTitle}>Key Responsibilities</h4>
                  <ul style={styles.dutiesList}>
                    {role.duties.map((duty, i) => (
                      <li key={i} style={styles.dutyItem}>
                        <CheckCircle
                          size={18}
                          color="var(--color-primary)"
                          style={styles.dutyIcon}
                        />
                        {duty}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Hierarchy Diagram ──────────────── */}
        <div style={styles.hierarchySection}>
          <h2 style={styles.hierarchyTitle}>Discipleship Hierarchy</h2>
          <p style={styles.hierarchySub}>
            Each tier supports and sharpens the tier below it.
          </p>

          <div style={styles.pyramid}>
            {/* Forge Keeper */}
            <div style={styles.pyramidTier}>
              <div
                style={{
                  ...styles.pyramidBox,
                  background:
                    'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  minWidth: '220px',
                }}
              >
                <Crown size={22} />
                Forge Keeper
              </div>
              <div style={styles.pyramidLabel}>Episkopos — Elder / Overseer</div>
            </div>

            {/* Arrow */}
            <div style={styles.pyramidArrow}>
              <div style={styles.pyramidArrowLine} />
              <ArrowDown size={20} />
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  marginTop: '2px',
                }}
              >
                Oversees &amp; Disciples
              </span>
              <div style={styles.pyramidArrowLine} />
            </div>

            {/* Edge Keepers */}
            <div style={styles.pyramidTier}>
              <div
                style={{
                  ...styles.pyramidBox,
                  background: 'linear-gradient(135deg, #b8860b, #8b6914)',
                  minWidth: '300px',
                }}
              >
                <ShieldCheck size={22} />
                Edge Keepers
              </div>
              <div style={styles.pyramidLabel}>Diakonos — Deacon / Discipler</div>
            </div>

            {/* Arrow */}
            <div style={styles.pyramidArrow}>
              <div style={styles.pyramidArrowLine} />
              <ArrowDown size={20} />
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  marginTop: '2px',
                }}
              >
                Mentors &amp; Sharpens
              </span>
              <div style={styles.pyramidArrowLine} />
            </div>

            {/* Swordsmen */}
            <div style={styles.pyramidTier}>
              <div
                style={{
                  ...styles.pyramidBox,
                  background: 'linear-gradient(135deg, #4a6fa5, #3a5a8a)',
                  minWidth: '380px',
                }}
              >
                <Sword size={22} />
                Swordsmen
              </div>
              <div style={styles.pyramidLabel}>Mathetes — Disciple in Training</div>
            </div>
          </div>
        </div>

        {/* ── Scripture Banner ────────────────── */}
        <div style={styles.scriptureBanner}>
          <p style={styles.scriptureText}>
            "And the things you have heard me say in the presence of many
            witnesses entrust to reliable people who will also be qualified to
            teach others."
          </p>
          <p style={styles.scriptureRef}>— 2 Timothy 2:2</p>
        </div>
      </div>
    </div>
  );
}
