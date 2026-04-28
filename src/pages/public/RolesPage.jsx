import { useState, useEffect } from 'react';

/* ══════════════════════════════════════════════════════════════
   Roles & Responsibilities — HVK Discipleship Pipeline
   ══════════════════════════════════════════════════════════════ */

const roles = [
  {
    title: 'Swordsman',
    tier: 'TIER I',
    greek: 'Mathetes',
    desc: "Disciple in training — learning to walk in Christ’s authority and overcome sin",
    duties: [
      'Daily Bible reading',
      'Build healthy habits',
      'Memorize Scripture',
      'Attend Thursday studies',
      'Weekly accountability',
    ],
  },
  {
    title: 'Edge Keeper',
    tier: 'TIER II',
    greek: 'Diakonos',
    desc: 'Deacon and discipler — shepherding Swordsmen through their spiritual growth',
    duties: [
      'Mentor Swordsmen',
      'Weekly check-ins',
      'Lead small discussions',
      'Recruit new members',
      'All Swordsman duties',
    ],
  },
  {
    title: 'Forge Keeper',
    tier: 'TIER III',
    greek: 'Episkopos',
    desc: 'Elder and overseer — guiding the entire community with wisdom and spiritual authority',
    duties: [
      'Lead Thursday studies',
      'One-on-one discipleship',
      'Handle discipline biblically',
      'Create teachings',
      'Oversee Edge Keepers',
    ],
  },
];

const treeData = {
  level1: [{ label: 'FORGE KEEPER', name: 'Peter' }],
  level2: [
    { label: 'EDGE KEEPER', name: 'Mark' },
    { label: 'EDGE KEEPER', name: 'Silas' },
  ],
  level3: [
    { label: 'SWORDSMAN', name: 'Timothy' },
    { label: 'SWORDSMAN', name: 'Barnabas' },
    { label: 'SWORDSMAN', name: 'Luke' },
    { label: 'SWORDSMAN', name: 'Titus' },
    { label: 'SWORDSMAN', name: 'Onesimus' },
    { label: 'SWORDSMAN', name: 'Epaphras' },
    { label: 'SWORDSMAN', name: 'Clement' },
  ],
};

/* ── Styles ──────────────────────────────────────────────────── */

const s = {
  /* Page */
  page: { width: '100%' },

  /* ── Page Header ─────────────────────────────────────────── */
  header: {
    padding: '100px 24px 60px',
    textAlign: 'center',
    borderBottom: '1px solid var(--rule-soft-2)',
  },
  eyebrow: {
    fontFamily: "var(--font-mono)",
    fontSize: '11px',
    letterSpacing: '6px',
    color: 'var(--crimson)',
    textTransform: 'uppercase',
    marginBottom: '28px',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  logo: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: 'clamp(28px, 5.5vw, 50px)',
    letterSpacing: '6px',
    color: 'var(--parchment)',
    lineHeight: 1.1,
    textShadow: 'var(--display-shadow)',
    marginBottom: '20px',
  },
  rule: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    margin: '20px auto',
    maxWidth: '280px',
  },
  ruleLine: { flex: 1, height: '1px', background: 'var(--rule-soft)' },
  ruleTick: { width: '10px', height: '5px', background: 'var(--crimson)' },
  subtitle: {
    fontFamily: 'var(--font-accent)',
    fontStyle: 'italic',
    fontSize: '18px',
    color: 'var(--parchment-dim)',
    letterSpacing: '1px',
  },

  /* ── Content wrapper ─────────────────────────────────────── */
  content: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    padding: '60px 24px 100px',
  },

  /* ── Running header + Section plate ──────────────────────── */
  sectionWrap: {
    marginBottom: '80px',
  },
  runningHeader: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '5px',
    color: 'var(--parchment-dim)',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  sectionPlate: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '16px',
    marginBottom: '36px',
    borderBottom: '1px solid var(--rule-soft-2)',
    paddingBottom: '16px',
  },
  sectionNumeral: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '42px',
    color: 'var(--crimson)',
    lineHeight: 1,
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '22px',
    letterSpacing: '4px',
    color: 'var(--parchment)',
    textTransform: 'uppercase',
  },

  /* ── Intro paragraph with drop-cap ───────────────────────── */
  introText: {
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    lineHeight: 1.8,
    color: 'var(--parchment-dim)',
    maxWidth: '820px',
    marginBottom: '48px',
  },
  dropCap: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '42px',
    color: 'var(--crimson)',
    float: 'left',
    lineHeight: 1,
    marginRight: '8px',
    marginTop: '4px',
  },

  /* ── Pipeline card ───────────────────────────────────────── */
  pipelineCard: {
    background: 'var(--anvil)',
    border: '1px solid var(--rule)',
    borderTop: '4px solid var(--crimson)',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '5px',
    color: 'var(--crimson)',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingTop: '24px',
    marginBottom: '8px',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '24px',
    letterSpacing: '4px',
    color: 'var(--parchment)',
    textAlign: 'center',
    marginBottom: '4px',
  },
  cardGreek: {
    fontFamily: 'var(--font-accent)',
    fontStyle: 'italic',
    fontSize: '18px',
    color: 'var(--parchment-dim)',
    textAlign: 'center',
    marginBottom: '16px',
  },
  cardDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'var(--parchment-dim)',
    textAlign: 'center',
    padding: '0 24px 16px',
    borderBottom: '1px dotted var(--rule-soft)',
    margin: '0 20px',
  },
  cardDuties: {
    listStyle: 'none',
    padding: '16px 24px 24px',
    margin: 0,
    width: '100%',
    boxSizing: 'border-box',
  },
  dutyItem: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--parchment-dim)',
    lineHeight: 1.6,
    padding: '8px 0',
    borderBottom: '1px dotted var(--rule-soft-2)',
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  dutyItemLast: {
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--parchment-dim)',
    lineHeight: 1.6,
    padding: '8px 0',
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  dutyPrefix: {
    color: 'var(--crimson)',
    fontWeight: 700,
    flexShrink: 0,
  },

  /* ── Pipeline arrow ──────────────────────────────────────── */
  pipelineArrow: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    color: 'var(--crimson)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── Multiplication tree ─────────────────────────────────── */
  treeBox: {
    background: 'var(--anvil)',
    border: '1px solid var(--rule)',
    padding: '48px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  treeEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '5px',
    color: 'var(--crimson)',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  treeTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '20px',
    letterSpacing: '3px',
    color: 'var(--parchment)',
    textAlign: 'center',
    marginBottom: '40px',
  },
  treeLevel: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  treeNode: {
    background: 'var(--onyx)',
    border: '2px solid var(--crimson)',
    padding: '10px 16px',
    textAlign: 'center',
    minWidth: '90px',
  },
  treeNodeLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    letterSpacing: '2px',
    color: 'var(--crimson)',
    textTransform: 'uppercase',
    marginBottom: '2px',
  },
  treeNodeName: {
    fontFamily: 'var(--font-display)',
    fontSize: '11px',
    letterSpacing: '2px',
    color: 'var(--parchment)',
    textTransform: 'uppercase',
  },
  treeConnector: {
    width: '2px',
    height: '36px',
    margin: '0 auto',
    background: 'repeating-linear-gradient(to bottom, var(--crimson) 0px, var(--crimson) 4px, transparent 4px, transparent 8px)',
  },

  /* ── Verse callout ───────────────────────────────────────── */
  verseBox: {
    background: 'var(--anvil)',
    border: '1px solid var(--rule)',
    borderLeft: '4px solid var(--crimson)',
    padding: '40px 36px',
    textAlign: 'center',
  },
  verseEyebrow: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '5px',
    color: 'var(--crimson)',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },
  verseQuote: {
    fontFamily: 'var(--font-accent)',
    fontStyle: 'italic',
    fontSize: '22px',
    color: 'var(--parchment)',
    lineHeight: 1.6,
    maxWidth: '640px',
    margin: '0 auto 16px',
  },
  verseRef: {
    fontFamily: 'var(--font-display)',
    fontSize: '12px',
    letterSpacing: '3px',
    color: 'var(--crimson)',
    textTransform: 'uppercase',
  },
};

/* ── Helpers ──────────────────────────────────────────────── */

function RuleDivider() {
  return (
    <div style={s.rule}>
      <div style={s.ruleLine} />
      <div style={s.ruleTick} />
      <div style={s.ruleLine} />
    </div>
  );
}

function SectionHeader({ running, numeral, title }) {
  return (
    <>
      <div style={s.runningHeader}>{running}</div>
      <div style={s.sectionPlate}>
        <span style={s.sectionNumeral}>{numeral}</span>
        <span style={s.sectionTitle}>{title}</span>
      </div>
    </>
  );
}

function PipelineCard({ role }) {
  return (
    <div style={s.pipelineCard}>
      <div style={s.cardEyebrow}>{role.tier}</div>
      <div style={s.cardTitle}>{role.title.toUpperCase()}</div>
      <div style={s.cardGreek}>{role.greek}</div>
      <div style={s.cardDesc}>{role.desc}</div>
      <ul style={s.cardDuties}>
        {role.duties.map((d, i) => (
          <li
            key={i}
            style={i < role.duties.length - 1 ? s.dutyItem : s.dutyItemLast}
          >
            <span style={s.dutyPrefix}>+</span>
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TreeNode({ label, name }) {
  return (
    <div style={s.treeNode}>
      <div style={s.treeNodeLabel}>{label}</div>
      <div style={s.treeNodeName}>{name}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════════════ */

export default function RolesPage() {
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 900 : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const handler = (e) => setNarrow(e.matches);
    mq.addEventListener('change', handler);
    setNarrow(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* Dynamic pipeline grid */
  const pipelineGrid = {
    display: 'grid',
    gridTemplateColumns: narrow ? '1fr' : '1fr auto 1fr auto 1fr',
    gap: narrow ? '0' : '0 20px',
    alignItems: 'start',
  };

  const arrowStyle = {
    ...s.pipelineArrow,
    padding: narrow ? '12px 0' : '0',
    transform: narrow ? 'rotate(90deg)' : 'none',
    alignSelf: 'center',
    justifySelf: 'center',
  };

  return (
    <div style={s.page}>
      {/* ── Page Header ────────────────────────────────── */}
      <header style={s.header}>
        <div style={s.eyebrow}>
          HIDDEN VALLEY KINGS &middot; DISCIPLESHIP PIPELINE
        </div>

        <div style={s.logoWrap}>
          <img src="/hvklogo.png" alt="HVK" style={s.logo} />
        </div>

        <h1 style={s.title}>ROLES &amp; RESPONSIBILITIES</h1>

        <RuleDivider />

        <p style={s.subtitle}>Building disciples for God's Kingdom</p>
      </header>

      <div style={s.content}>
        {/* ── Section I: The Discipleship Pipeline ──────── */}
        <div style={s.sectionWrap}>
          <SectionHeader
            running="HIDDEN VALLEY KINGS · ROLES & RESPONSIBILITIES"
            numeral="I"
            title="The Discipleship Pipeline"
          />

          <p style={s.introText}>
            <span style={s.dropCap}>H</span>
            idden Valley Kings exists to make disciples of Christ through a
            clear discipleship pipeline. Every man enters as a Swordsman and
            grows through intentional mentorship. As faithfulness and maturity
            increase, men are called into greater responsibility — first as
            Edge Keepers who disciple others, and ultimately as Forge Keepers
            who oversee the entire community with wisdom and spiritual
            authority.
          </p>

          {/* Pipeline grid */}
          <div style={pipelineGrid}>
            <PipelineCard role={roles[0]} />
            <div style={arrowStyle}>&rarr;</div>
            <PipelineCard role={roles[1]} />
            <div style={arrowStyle}>&rarr;</div>
            <PipelineCard role={roles[2]} />
          </div>
        </div>

        {/* ── Section II: Four Generations ──────────────── */}
        <div style={s.sectionWrap}>
          <SectionHeader
            running="HIDDEN VALLEY KINGS · ROLES & RESPONSIBILITIES"
            numeral="II"
            title="Four Generations"
          />

          <div style={s.treeBox}>
            <div style={s.treeEyebrow}>PATTERN OF MULTIPLICATION</div>
            <div style={s.treeTitle}>From Forge Keeper to Faithful Men</div>

            {/* Level 1 */}
            <div style={s.treeLevel}>
              {treeData.level1.map((n, i) => (
                <TreeNode key={i} label={n.label} name={n.name} />
              ))}
            </div>

            {/* Connector */}
            <div style={s.treeConnector} />

            {/* Level 2 */}
            <div style={s.treeLevel}>
              {treeData.level2.map((n, i) => (
                <TreeNode key={i} label={n.label} name={n.name} />
              ))}
            </div>

            {/* Connector */}
            <div style={s.treeConnector} />

            {/* Level 3 */}
            <div style={s.treeLevel}>
              {treeData.level3.map((n, i) => (
                <TreeNode key={i} label={n.label} name={n.name} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Verse Callout ────────────────────────────── */}
        <div style={s.verseBox}>
          <div style={s.verseEyebrow}>SCRIPTURE</div>
          <div style={s.verseQuote}>
            "Go therefore and make disciples of all nations, baptizing them in
            the name of the Father and of the Son and of the Holy Spirit,
            teaching them to observe all that I have commanded you. And behold,
            I am with you always, to the end of the age."
          </div>
          <div style={s.verseRef}>&mdash; MATTHEW 28:19&ndash;20</div>
        </div>
      </div>
    </div>
  );
}
