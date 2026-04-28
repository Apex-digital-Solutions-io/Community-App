const ROTATION = [
  { week: 'Week 1', type: 'Study · Week A' },
  { week: 'Week 2', type: 'Fellowship · Week B' },
  { week: 'Week 3', type: 'Study · Week A' },
  { week: 'Week 4', type: 'Fellowship · Week B' },
  { week: 'Week 5*', type: 'Deep Calls to Deep', special: true },
];

const SCHEDULES = [
  {
    title: 'Call of Wisdom',
    time: 'Monday · 6:30 AM – 8:00 AM CT',
    rows: [
      ['6:30 – 6:45 AM', 'Fellowship'],
      ['6:45 – 7:00 AM', '3 Wisdom of the Week'],
      ['7:00 – 7:10 AM', 'Prayer'],
      ['7:10 – 7:40 AM', 'Proverb of the Day'],
      ['7:40 – 7:50 AM', 'Fellowship'],
      ['7:50 – 8:00 AM', 'Closing Prayer'],
    ],
  },
  {
    title: 'Called for His Glory',
    badge: 'Week A',
    time: 'Thursday · 7:00 PM – 9:00 PM CT · Weeks 1 & 3',
    rows: [
      ['7:00 – 7:15 PM', 'Fellowship'],
      ['7:15 – 7:30 PM', 'Prayer', '(Armor up · group · nation · earth)'],
      ['7:30 – 8:00 PM', 'Scripture Memory + Life Application'],
      ['8:00 – 8:30 PM', 'Scripture Study', '(discuss between each reading)'],
      ['8:30 – 8:45 PM', 'Prayer Requests'],
      ['8:45 – 9:00 PM', 'Closing Prayer'],
    ],
  },
  {
    title: 'Called for His Glory',
    badge: 'Week B',
    time: 'Thursday · 7:00 PM – 9:00 PM CT · Weeks 2 & 4',
    rows: [
      ['7:00 – 7:10 PM', 'Fellowship'],
      ['7:10 – 7:20 PM', 'Prayer', '(Armor up · group · nation · earth)'],
      ['7:20 – 7:45 PM', 'Scripture Memory + Life Application'],
      ['7:45 – 8:15 PM', 'Group Fellowship + Prayer'],
      ['8:15 – 8:45 PM', 'Read Scripture', '(or discuss book reading at end of month)'],
      ['8:45 – 9:00 PM', 'Closing Prayer'],
    ],
  },
  {
    title: 'Deep Calls to Deep',
    badge: 'Week 5',
    badgeSpecial: true,
    time: 'Thursday · 7:00 PM – 9:00 PM CT · 5th Thursday',
    rows: [
      ['7:00 – 7:15 PM', 'Fellowship & Opening Prayer'],
      ['7:15 – 7:30 PM', 'Topic Introduction'],
      ['7:30 – 8:30 PM', 'Going Deeper on a Specific Topic', '(focused group exploration of a chosen subject)'],
      ['8:30 – 8:45 PM', 'Q&A and Community Input'],
      ['8:45 – 9:00 PM', 'Closing Prayer & Application'],
    ],
  },
];

const NOTES = [
  'Monday "Call of Wisdom" — start the week with wisdom from Proverbs',
  'Thursday "Called for His Glory" alternates between Study (Week A) and Fellowship (Week B)',
  'Week 4 is always dedicated to monthly book discussion',
  '5-week months include a special "Deep Calls to Deep" session for advanced topics',
  'All times are firm to maintain structure and discipline',
  'Prayer time includes specific focus areas: armor up, group, nation, and world',
];

export default function SchedulePage() {
  return (
    <>
      <style>{responsiveCSS}</style>

      {/* Page Header */}
      <header style={s.pageHeader}>
        <div style={s.eyebrow}>HIDDEN VALLEY KINGS · GATHERINGS</div>
        <div style={s.logoWrap}><img src="/hvklogo.png" alt="HVK" style={{ width: 80, height: 80, objectFit: 'contain' }} /></div>
        <h1 style={s.pageTitle}>MEETING SCHEDULE</h1>
        <div style={s.rule}><div style={s.ruleLine} /><div style={s.ruleTick} /><div style={s.ruleLine} /></div>
        <p style={s.subtitle}>All times Central Time</p>
      </header>

      <section style={s.section}>
        <div style={s.container}>
          {/* Section I: Rotation */}
          <div style={s.runningHeader}>
            <span>Hidden Valley Kings · Schedule</span>
            <span style={{ color: 'var(--crimson)' }}>§ I · ROTATION</span>
          </div>
          <div style={s.sectionPlate}>
            <div style={s.plateNum}>I</div>
            <div style={s.plateBody}>
              <div style={s.plateEyebrow}>SECTION ONE</div>
              <div style={s.plateTitle}>Thursday Night Rotation</div>
              <div style={s.plateKicker}>Structured study, fellowship, and deep theological exploration</div>
            </div>
          </div>

          <div style={s.rotationExplainer}>
            <p style={s.rotationLead}>Our Thursday gatherings — "Called for His Glory" — follow a monthly rotation to balance structured study, fellowship, and deep theological exploration.</p>
            <div className="hvk-rotation-grid" style={s.rotationGrid}>
              {ROTATION.map((r) => (
                <div key={r.week} style={{ ...s.rotationItem, ...(r.special ? s.rotationSpecial : {}) }}>
                  <div style={{ ...s.rotationWeek, ...(r.special ? { color: 'var(--crimson)' } : {}) }}>{r.week}</div>
                  <div style={s.rotationType}>{r.type}</div>
                </div>
              ))}
            </div>
            <p style={s.rotationFootnote}>*When months have 5 Thursdays, Week 5 becomes "Deep Calls to Deep" — focused discussions on advanced theological topics and challenging questions.</p>
            <div style={s.rotationCallout}>
              <strong style={s.calloutStrong}>Monthly Book Discussion</strong>
              Week 4 is always dedicated to discussing the book we've been reading together throughout the month.
            </div>
          </div>

          {/* Section II: Gatherings */}
          <div style={s.runningHeader}>
            <span>Hidden Valley Kings · Weekly Cadence</span>
            <span style={{ color: 'var(--crimson)' }}>§ II · GATHERINGS</span>
          </div>
          <div style={s.sectionPlate}>
            <div style={s.plateNum}>II</div>
            <div style={s.plateBody}>
              <div style={s.plateEyebrow}>SECTION TWO</div>
              <div style={s.plateTitle}>Weekly Gatherings</div>
              <div style={s.plateKicker}>The rhythm that forms the man</div>
            </div>
          </div>

          <div className="hvk-schedules-grid" style={s.schedulesGrid}>
            {SCHEDULES.map((card, i) => (
              <div key={i} style={s.scheduleCard}>
                <div style={s.cardHeader}>
                  <div style={s.cardTitle}>
                    {card.title}
                    {card.badge && (
                      <span style={card.badgeSpecial ? s.badgeSpecial : s.badge}>{card.badge}</span>
                    )}
                  </div>
                  <div style={s.cardTime}>{card.time}</div>
                </div>
                <table style={s.table}>
                  <tbody>
                    {card.rows.map(([time, activity, note], j) => (
                      <tr key={j} style={s.tableRow}>
                        <td style={s.timeCell}>{time}</td>
                        <td style={s.activityCell}>
                          {activity}
                          {note && <span style={s.note}> {note}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div style={s.calendarSection}>
            <h2 style={s.calendarTitle}>Stay Connected</h2>
            <p style={s.calendarLead}>Subscribe to our calendar to never miss a gathering</p>
            <div style={s.calendarFrame}>
              <iframe
                src="https://calendar.google.com/calendar/embed?src=390cfd1b1abe61204b2176348dd0922608bc775ff31d686c85082ca1fac784a6%40group.calendar.google.com&ctz=America%2FCosta_Rica"
                style={s.calendarIframe}
                title="HVK Calendar"
                frameBorder="0"
                scrolling="no"
              />
            </div>
            <p style={s.calendarNote}>To add this calendar to your personal calendar app, click the "+ Google Calendar" button in the bottom right of the calendar above.</p>
          </div>

          {/* Notes */}
          <div style={s.notes}>
            <h3 style={s.notesTitle}>Schedule Notes</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {NOTES.map((n, i) => (
                <li key={i} style={s.noteLi}>{n}</li>
              ))}
            </ul>
          </div>

          {/* Scripture */}
          <div style={s.scriptureBox}>
            <div style={s.scriptureHeader}>SCRIPTURE</div>
            <div style={s.scriptureBody}>
              <p style={s.scriptureQuote}>"And let us consider how to stir up one another to love and good works, not neglecting to meet together…"</p>
              <div style={s.scriptureRef}>— HEBREWS 10:24–25</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const responsiveCSS = `
  @media (max-width: 900px) {
    .hvk-rotation-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .hvk-schedules-grid { grid-template-columns: 1fr !important; }
  }
`;

const s = {
  pageHeader: { padding: '72px 24px 56px', textAlign: 'center', borderBottom: '1px solid var(--rule-soft-2)' },
  eyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 6, color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 24 },
  logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: 24 },
  pageTitle: { fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: 'clamp(32px, 6vw, 56px)', letterSpacing: 6, color: 'var(--parchment)', lineHeight: 1, textShadow: 'var(--display-shadow)', marginBottom: 16 },
  rule: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '28px auto', maxWidth: 320 },
  ruleLine: { flex: 1, height: 1, background: 'var(--rule-soft)' },
  ruleTick: { width: 10, height: 5, background: 'var(--crimson)' },
  subtitle: { fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: 'var(--parchment-dim)', letterSpacing: 1 },

  section: { padding: '72px 24px' },
  container: { maxWidth: 1180, margin: '0 auto' },
  runningHeader: { display: 'flex', justifyContent: 'space-between', paddingBottom: 12, marginBottom: 36, borderBottom: '1px solid var(--rule-soft)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2.5, color: 'var(--parchment-dim)', textTransform: 'uppercase' },
  sectionPlate: { display: 'flex', marginBottom: 48 },
  plateNum: { width: 96, background: 'var(--crimson)', color: '#F4E8D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 42, letterSpacing: 2, boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.2)' },
  plateBody: { flex: 1, background: 'var(--anvil)', padding: '18px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  plateEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 6 },
  plateTitle: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 'clamp(20px, 3vw, 28px)', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--parchment)' },
  plateKicker: { fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 14, color: 'var(--parchment-dim)', marginTop: 4 },

  rotationExplainer: { background: 'var(--anvil)', border: '1px solid var(--rule)', padding: 32, marginBottom: 48 },
  rotationLead: { fontFamily: "'EB Garamond', serif", fontSize: 15, color: 'var(--parchment)', marginBottom: 24, lineHeight: 1.65 },
  rotationGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 },
  rotationItem: { background: 'var(--onyx)', border: '1px solid var(--rule)', padding: '18px 14px', textAlign: 'center' },
  rotationSpecial: { borderColor: 'var(--crimson)' },
  rotationWeek: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: 'var(--parchment-dim)', textTransform: 'uppercase', marginBottom: 6 },
  rotationType: { fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--parchment)' },
  rotationFootnote: { fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 13, color: 'var(--parchment-dim)', marginTop: 16 },
  rotationCallout: { marginTop: 20, padding: '14px 18px', background: 'var(--onyx)', borderLeft: '4px solid var(--crimson)', fontFamily: "'EB Garamond', serif", fontSize: 14, color: 'var(--parchment)' },
  calloutStrong: { fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, color: 'var(--crimson)', textTransform: 'uppercase', display: 'block', marginBottom: 4 },

  schedulesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 28 },
  scheduleCard: { background: 'var(--anvil)', border: '1px solid var(--rule)' },
  cardHeader: { background: 'var(--onyx)', padding: '18px 22px', borderBottom: '1px solid var(--rule)', position: 'relative', borderLeft: '4px solid var(--crimson)' },
  cardTitle: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 18, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--parchment)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  cardTime: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, color: 'var(--crimson)', textTransform: 'uppercase', marginTop: 6 },
  badge: { background: 'var(--crimson)', color: '#F4E8D0', padding: '3px 10px', fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2, fontWeight: 700 },
  badgeSpecial: { background: 'var(--parchment)', color: 'var(--anvil)', padding: '3px 10px', fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2, fontWeight: 700 },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableRow: { borderBottom: '1px dotted var(--rule-soft)' },
  timeCell: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--crimson)', letterSpacing: 1, width: 140, verticalAlign: 'top', paddingTop: 14, padding: '12px 22px' },
  activityCell: { fontFamily: "'EB Garamond', serif", fontSize: 14, lineHeight: 1.5, color: 'var(--parchment)', padding: '12px 22px' },
  note: { color: 'var(--parchment-dim)', fontStyle: 'italic', fontSize: 13 },

  calendarSection: { background: 'var(--anvil)', border: '1px solid var(--rule)', padding: 40, marginTop: 56 },
  calendarTitle: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--parchment)', textAlign: 'center', marginBottom: 16 },
  calendarLead: { fontFamily: "'EB Garamond', serif", color: 'var(--parchment-dim)', textAlign: 'center', marginBottom: 32, fontStyle: 'italic' },
  calendarFrame: { position: 'relative', paddingBottom: 600, height: 0, overflow: 'hidden', maxWidth: '100%', background: 'var(--parchment)', border: '1px solid var(--crimson)' },
  calendarIframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 },
  calendarNote: { fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 13, color: 'var(--parchment-dim)', textAlign: 'center', marginTop: 16 },

  notes: { background: 'var(--anvil)', border: '1px solid var(--rule)', borderLeft: '4px solid var(--crimson)', padding: 32, marginTop: 48 },
  notesTitle: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 16, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--parchment)', marginBottom: 18 },
  noteLi: { fontFamily: "'EB Garamond', serif", fontSize: 14, lineHeight: 1.7, color: 'var(--parchment)', padding: '8px 0 8px 24px', borderBottom: '1px dotted var(--rule-soft)', position: 'relative' },

  scriptureBox: { background: 'var(--anvil)', border: '1px solid var(--rule)', margin: '36px auto', maxWidth: 820 },
  scriptureHeader: { background: 'var(--crimson)', color: '#F4E8D0', padding: '9px 16px', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 11, letterSpacing: 4 },
  scriptureBody: { padding: '22px 26px' },
  scriptureQuote: { fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, color: 'var(--parchment)', marginBottom: 12 },
  scriptureRef: { fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 11, letterSpacing: 3, color: 'var(--crimson)', textAlign: 'right' },
};
