import {
  Award,
  Clock,
  Coins,
  BookOpen,
  Star,
  Users,
  CheckCircle,
  XCircle,
  Sword,
  ShieldCheck,
  Crown,
  Video,
  Flame,
  CalendarCheck,
  Timer,
  MessageCircle,
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
    display: 'flex',
    flexDirection: 'column',
    gap: '60px',
  },

  /* ── Overview cards ──────────────────────────────────────── */
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  overviewCard: {
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    color: '#fff',
    boxShadow: 'var(--shadow-md)',
  },
  overviewIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  overviewName: {
    fontSize: '1.3rem',
    fontWeight: 800,
    marginBottom: '8px',
  },
  overviewDesc: {
    fontSize: '0.9rem',
    opacity: 0.85,
    lineHeight: 1.6,
  },

  /* ── Currency Section ────────────────────────────────────── */
  currencySection: {
    background: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
  },
  currencyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    padding: '24px 32px',
    color: '#fff',
  },
  currencyIconWrap: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  currencyTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
  },
  currencySubtitle: {
    fontSize: '0.85rem',
    opacity: 0.85,
  },
  currencyBody: {
    padding: '32px',
  },
  currencyDesc: {
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.7,
    marginBottom: '28px',
  },

  /* ── Category Group ──────────────────────────────────────── */
  categoryTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  categoryCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '14px 18px',
    background: 'var(--color-bg-alt)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
  },
  categoryLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.9rem',
    color: 'var(--color-text)',
    fontWeight: 500,
  },
  categoryIconSmall: {
    color: 'var(--color-primary)',
    flexShrink: 0,
  },
  pointBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '999px',
    background: 'rgba(220,20,60,0.08)',
    color: 'var(--color-primary)',
    fontWeight: 700,
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
  },

  /* ── Kingdom Coins Role Sections ─────────────────────────── */
  roleSection: {
    marginBottom: '24px',
  },
  roleSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
  },
  roleSectionName: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--color-text)',
  },
  roleBadge: {
    padding: '3px 12px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#fff',
    whiteSpace: 'nowrap',
  },
  roleMethods: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  roleMethodItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },

  /* ── Balance Guidelines ──────────────────────────────────── */
  guidelinesSection: {
    background: 'var(--color-bg-alt)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px 32px',
    border: '1px solid var(--color-border)',
  },
  guidelinesTitle: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: 'var(--color-text)',
    marginBottom: '8px',
    textAlign: 'center',
  },
  guidelinesSubtitle: {
    fontSize: '1rem',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
    marginBottom: '36px',
  },
  guidelinesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '32px',
  },
  guidelineCol: {
    background: 'var(--color-bg)',
    borderRadius: 'var(--radius-md)',
    padding: '28px',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
  },
  guidelineColTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.1rem',
    fontWeight: 700,
    marginBottom: '20px',
  },
  guidelineList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  guidelineItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    color: 'var(--color-text-secondary)',
  },
  guidelineIcon: {
    flexShrink: 0,
    marginTop: '2px',
  },
};

const crucibleCategories = [
  {
    group: 'Scripture Memory',
    icon: BookOpen,
    items: [
      { label: 'Assisted recitation', points: '5 pts' },
      { label: 'Partial recall', points: '10 pts' },
      { label: 'Independent recitation', points: '15 pts' },
    ],
  },
  {
    group: 'Study & Reading',
    icon: Star,
    items: [{ label: 'Book review (per review)', points: '20 pts' }],
  },
  {
    group: 'Meeting Attendance',
    icon: CalendarCheck,
    items: [
      { label: 'Monday attendance', points: '15 pts' },
      { label: 'Wednesday attendance', points: '10 pts' },
      { label: 'Thursday attendance', points: '20 pts' },
    ],
  },
  {
    group: 'Participation & Engagement',
    icon: Flame,
    items: [
      { label: 'Punctuality (on time)', points: '5 pts' },
      { label: 'Full participation', points: '5 pts' },
      { label: 'Prayer participation', points: '5 pts' },
      { label: 'Video on during meeting', points: '5 pts' },
    ],
  },
];

const kingdomCoinRoles = [
  {
    role: 'Forge Keeper',
    icon: Crown,
    color: 'var(--color-primary)',
    methods: [
      'Earn coins by leading Thursday studies and preparing teaching materials',
      'Earn coins for one-on-one discipleship sessions with Edge Keepers',
      'Earn coins for handling discipline or conflict resolution biblically',
      'Earn coins for creating new teachings, studies, or curriculum',
    ],
  },
  {
    role: 'Edge Keeper',
    icon: ShieldCheck,
    color: '#b8860b',
    methods: [
      'Earn coins by conducting weekly check-ins with assigned Swordsmen',
      'Earn coins for leading small group discussions or breakouts',
      'Earn coins for successfully recruiting and onboarding new members',
      'Earn coins for mentoring a Swordsman through a growth milestone',
    ],
  },
  {
    role: 'Swordsman',
    icon: Sword,
    color: '#4a6fa5',
    methods: [
      'Earn coins by maintaining consistent daily Bible reading streaks',
      'Earn coins for completing Scripture memory challenges',
      'Earn coins for attending all weekly meetings in a given month',
      'Earn coins for sharing testimony or leading prayer in a meeting',
    ],
  },
];

const doList = [
  'Use Crucible Credits to track spiritual growth and discipline',
  'Earn Talent Tokens consistently through faithful service',
  'Invest Kingdom Coins into discipleship and community impact',
  'Celebrate others who are growing and earning in the system',
  'View the system as a tool for growth, not a competition',
  'Encourage brothers who are falling behind — lift them up',
];

const dontList = [
  'Hoard currencies for personal status or bragging rights',
  'Compare your progress to others in a spirit of pride',
  'Neglect spiritual growth while chasing points',
  'Manipulate attendance or participation for point gain',
  'Use the system to judge or look down on other members',
  'Forget the purpose: Christlikeness, not accumulation',
];

export default function GamificationPage() {
  return (
    <div style={styles.page}>
      {/* ── Page Header ──────────────────────── */}
      <header style={styles.header}>
        <span style={styles.headerTag}>
          <Award size={16} /> Gamification
        </span>
        <h1 style={styles.headerTitle}>Three-Currency System</h1>
        <p style={styles.headerSub}>
          Our gamification system uses three distinct currencies to track,
          reward, and encourage growth across every dimension of discipleship.
        </p>
      </header>

      <div style={styles.content}>
        {/* ── Overview Cards ──────────────────── */}
        <div style={styles.overviewGrid}>
          <div
            style={{
              ...styles.overviewCard,
              background:
                'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            }}
          >
            <div style={styles.overviewIcon}>
              <Award size={26} />
            </div>
            <h3 style={styles.overviewName}>Crucible Credits</h3>
            <p style={styles.overviewDesc}>
              Points earned through spiritual disciplines, meeting attendance,
              Scripture memory, and active participation. The measure of your
              daily faithfulness.
            </p>
          </div>

          <div
            style={{
              ...styles.overviewCard,
              background: 'linear-gradient(135deg, #b8860b, #8b6914)',
            }}
          >
            <div style={styles.overviewIcon}>
              <Clock size={26} />
            </div>
            <h3 style={styles.overviewName}>Talent Tokens</h3>
            <p style={styles.overviewDesc}>
              Time-based tokens earned through discipleship and service. For
              every 10 minutes invested into discipling others, you earn 1
              Talent Token.
            </p>
          </div>

          <div
            style={{
              ...styles.overviewCard,
              background: 'linear-gradient(135deg, #4a6fa5, #3a5a8a)',
            }}
          >
            <div style={styles.overviewIcon}>
              <Coins size={26} />
            </div>
            <h3 style={styles.overviewName}>Kingdom Coins</h3>
            <p style={styles.overviewDesc}>
              Role-specific currency earned through leadership, mentorship, and
              service unique to your position within the discipleship pipeline.
            </p>
          </div>
        </div>

        {/* ── Crucible Credits Detail ────────── */}
        <div style={styles.currencySection}>
          <div
            style={{
              ...styles.currencyHeader,
              background:
                'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            }}
          >
            <div style={styles.currencyIconWrap}>
              <Award size={22} />
            </div>
            <div>
              <div style={styles.currencyTitle}>Crucible Credits</div>
              <div style={styles.currencySubtitle}>
                Earned through disciplines &amp; participation
              </div>
            </div>
          </div>
          <div style={styles.currencyBody}>
            <p style={styles.currencyDesc}>
              Crucible Credits reward consistency, discipline, and engagement.
              Every act of faithfulness — from memorizing Scripture to showing up
              on time — earns you credits that reflect your spiritual growth
              journey.
            </p>

            {crucibleCategories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div key={cat.group}>
                  <h4 style={styles.categoryTitle}>
                    <CatIcon size={18} color="var(--color-primary)" />
                    {cat.group}
                  </h4>
                  <div style={styles.categoryGrid}>
                    {cat.items.map((item, i) => (
                      <div key={i} style={styles.categoryCard}>
                        <span style={styles.categoryLabel}>
                          {item.label}
                        </span>
                        <span style={styles.pointBadge}>{item.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Talent Tokens Detail ───────────── */}
        <div style={styles.currencySection}>
          <div
            style={{
              ...styles.currencyHeader,
              background: 'linear-gradient(135deg, #b8860b, #8b6914)',
            }}
          >
            <div style={styles.currencyIconWrap}>
              <Clock size={22} />
            </div>
            <div>
              <div style={styles.currencyTitle}>Talent Tokens</div>
              <div style={styles.currencySubtitle}>
                Time-based discipleship currency
              </div>
            </div>
          </div>
          <div style={styles.currencyBody}>
            <p style={styles.currencyDesc}>
              Talent Tokens are earned by investing your time into discipling
              others. This currency reflects your commitment to pouring into the
              lives around you.
            </p>

            <div style={styles.categoryGrid}>
              <div style={styles.categoryCard}>
                <span style={styles.categoryLabel}>
                  <Timer size={18} style={styles.categoryIconSmall} />
                  Conversion rate
                </span>
                <span style={styles.pointBadge}>1 Token / 10 min</span>
              </div>
              <div style={styles.categoryCard}>
                <span style={styles.categoryLabel}>
                  <Users size={18} style={styles.categoryIconSmall} />
                  Applies to
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  All discipleship time
                </span>
              </div>
              <div style={styles.categoryCard}>
                <span style={styles.categoryLabel}>
                  <MessageCircle size={18} style={styles.categoryIconSmall} />
                  Includes
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  Mentoring, check-ins, teaching
                </span>
              </div>
              <div style={styles.categoryCard}>
                <span style={styles.categoryLabel}>
                  <Video size={18} style={styles.categoryIconSmall} />
                  Tracked via
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  Self-report &amp; leader verification
                </span>
              </div>
            </div>

            <div
              style={{
                padding: '20px 24px',
                background: 'rgba(184,134,11,0.06)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(184,134,11,0.15)',
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: 'var(--color-text)' }}>Example:</strong>{' '}
              A 30-minute one-on-one discipleship call earns 3 Talent Tokens. A
              60-minute small group session earns 6 Talent Tokens.
            </div>
          </div>
        </div>

        {/* ── Kingdom Coins Detail ───────────── */}
        <div style={styles.currencySection}>
          <div
            style={{
              ...styles.currencyHeader,
              background: 'linear-gradient(135deg, #4a6fa5, #3a5a8a)',
            }}
          >
            <div style={styles.currencyIconWrap}>
              <Coins size={22} />
            </div>
            <div>
              <div style={styles.currencyTitle}>Kingdom Coins</div>
              <div style={styles.currencySubtitle}>
                Role-specific earning methods
              </div>
            </div>
          </div>
          <div style={styles.currencyBody}>
            <p style={styles.currencyDesc}>
              Kingdom Coins are earned differently based on your role within the
              discipleship pipeline. Each tier has unique earning opportunities
              that align with its responsibilities.
            </p>

            {kingdomCoinRoles.map((role) => {
              const RoleIcon = role.icon;
              return (
                <div key={role.role} style={styles.roleSection}>
                  <div style={styles.roleSectionHeader}>
                    <RoleIcon size={20} color={role.color} />
                    <span style={styles.roleSectionName}>{role.role}</span>
                    <span
                      style={{
                        ...styles.roleBadge,
                        background: role.color,
                      }}
                    >
                      {role.role === 'Forge Keeper'
                        ? 'Tier 3'
                        : role.role === 'Edge Keeper'
                          ? 'Tier 2'
                          : 'Tier 1'}
                    </span>
                  </div>
                  <ul style={styles.roleMethods}>
                    {role.methods.map((method, i) => (
                      <li key={i} style={styles.roleMethodItem}>
                        <CheckCircle
                          size={16}
                          color={role.color}
                          style={{ flexShrink: 0, marginTop: '3px' }}
                        />
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Balance Guidelines ─────────────── */}
        <div style={styles.guidelinesSection}>
          <h2 style={styles.guidelinesTitle}>Balance Guidelines</h2>
          <p style={styles.guidelinesSubtitle}>
            The gamification system exists to serve your growth — not the other
            way around.
          </p>

          <div style={styles.guidelinesGrid}>
            {/* DO */}
            <div style={styles.guidelineCol}>
              <h3
                style={{
                  ...styles.guidelineColTitle,
                  color: 'var(--color-success)',
                }}
              >
                <CheckCircle size={22} />
                DO
              </h3>
              <ul style={styles.guidelineList}>
                {doList.map((item, i) => (
                  <li key={i} style={styles.guidelineItem}>
                    <CheckCircle
                      size={16}
                      color="var(--color-success)"
                      style={styles.guidelineIcon}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* DON'T */}
            <div style={styles.guidelineCol}>
              <h3
                style={{
                  ...styles.guidelineColTitle,
                  color: 'var(--color-error)',
                }}
              >
                <XCircle size={22} />
                DON'T
              </h3>
              <ul style={styles.guidelineList}>
                {dontList.map((item, i) => (
                  <li key={i} style={styles.guidelineItem}>
                    <XCircle
                      size={16}
                      color="var(--color-error)"
                      style={styles.guidelineIcon}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
