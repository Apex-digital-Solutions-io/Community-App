import {
  Calendar,
  Clock,
  Sun,
  Sword,
  Sparkles,
  BookOpen,
  Info,
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
    maxWidth: '560px',
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
    gap: '40px',
  },

  /* ── Day Card ────────────────────────────────────────────── */
  dayCard: {
    background: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
  },
  dayHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    padding: '24px 32px',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
    color: '#fff',
  },
  dayIconWrap: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dayTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
  },
  dayMeta: {
    fontSize: '0.85rem',
    opacity: 0.85,
    fontWeight: 500,
  },
  dayTimeBadge: {
    marginLeft: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.18)',
    fontSize: '0.85rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  dayBody: {
    padding: '28px 32px',
  },

  /* ── Timeline ────────────────────────────────────────────── */
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    position: 'relative',
  },
  timelineItem: {
    display: 'flex',
    gap: '20px',
    position: 'relative',
    paddingBottom: '20px',
  },
  timelineItemLast: {
    display: 'flex',
    gap: '20px',
    position: 'relative',
    paddingBottom: '0',
  },
  timelineDot: {
    flexShrink: 0,
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    marginTop: '5px',
    position: 'relative',
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    left: '5px',
    top: '17px',
    bottom: '0',
    width: '2px',
    background: 'var(--color-border)',
  },
  timelineTime: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
    minWidth: '100px',
    whiteSpace: 'nowrap',
  },
  timelineLabel: {
    fontSize: '0.95rem',
    color: 'var(--color-text)',
    lineHeight: 1.5,
  },

  /* ── Notes ───────────────────────────────────────────────── */
  notesSection: {
    background: 'var(--color-bg-alt)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    border: '1px solid var(--color-border)',
  },
  notesTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  notesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  notesItem: {
    fontSize: '0.95rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    paddingLeft: '20px',
    position: 'relative',
  },
  notesBullet: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: 'var(--color-primary)',
    fontWeight: 700,
  },

  /* ── Calendar Embed ──────────────────────────────────────── */
  calendarSection: {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--color-border)',
  },
  calendarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '20px 28px',
    background: 'var(--color-bg-alt)',
    borderBottom: '1px solid var(--color-border)',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--color-text)',
  },
  calendarIframe: {
    width: '100%',
    height: '600px',
    border: 'none',
  },
};

const schedule = [
  {
    day: 'Monday',
    title: 'Call of Wisdom',
    time: '6:30 - 8:00 AM CT',
    icon: Sun,
    segments: [
      { time: '6:30 - 6:45', label: 'Fellowship' },
      { time: '6:45 - 7:00', label: '3 Wisdom of the Week' },
      { time: '7:00 - 7:10', label: 'Prayer' },
      { time: '7:10 - 7:40', label: 'Proverb of the Day' },
      { time: '7:40 - 7:50', label: 'Fellowship' },
      { time: '7:50 - 8:00', label: 'Closing Prayer' },
    ],
  },
  {
    day: 'Wednesday',
    title: 'Called to Warfare',
    time: '7:00 - 8:00 AM CT',
    icon: Sword,
    segments: [
      { time: '7:00 - 7:10', label: 'Worship' },
      { time: '7:10 - 7:20', label: 'Prayer + Armor Up' },
      { time: '7:20 - 7:40', label: 'Read a Chapter of Psalms' },
      { time: '7:40 - 7:50', label: 'Warfare Application' },
      { time: '7:50 - 8:00', label: 'Closing Prayer' },
    ],
  },
  {
    day: 'Thursday',
    title: 'Called for His Glory — Week A',
    subtitle: 'Weeks 1 & 3',
    time: '7:00 - 9:00 PM CT',
    icon: Sparkles,
    segments: [
      { time: '7:00 - 7:15', label: 'Fellowship' },
      { time: '7:15 - 7:30', label: 'Prayer' },
      { time: '7:30 - 8:00', label: 'Scripture Memory + Life Application' },
      { time: '8:00 - 8:30', label: 'Scripture Study' },
      { time: '8:30 - 8:45', label: 'Prayer Requests' },
      { time: '8:45 - 9:00', label: 'Closing Prayer' },
    ],
  },
  {
    day: 'Thursday',
    title: 'Called for His Glory — Week B',
    subtitle: 'Weeks 2 & 4',
    time: '7:00 - 9:00 PM CT',
    icon: Sparkles,
    segments: [
      { time: '7:00 - 7:10', label: 'Fellowship' },
      { time: '7:10 - 7:20', label: 'Prayer' },
      { time: '7:20 - 7:45', label: 'Scripture Memory + Life Application' },
      { time: '7:45 - 8:15', label: 'Group Fellowship + Prayer' },
      {
        time: '8:15 - 8:45',
        label: 'Read Scripture (or discuss Book Reading if end of month)',
      },
      { time: '8:45 - 9:00', label: 'Closing Prayer' },
    ],
  },
  {
    day: 'Thursday',
    title: 'Deep Calls to Deep',
    subtitle: 'Week 5 — 5th Thursday Only',
    time: '7:00 - 9:00 PM CT',
    icon: BookOpen,
    segments: [
      { time: '7:00 - 7:15', label: 'Fellowship & Opening Prayer' },
      { time: '7:15 - 7:30', label: 'Topic Introduction' },
      { time: '7:30 - 8:30', label: 'Deep Theological Discussion' },
      { time: '8:30 - 8:45', label: 'Q&A and Community Input' },
      { time: '8:45 - 9:00', label: 'Closing Prayer & Application' },
    ],
  },
];

function TimelineSegments({ segments }) {
  return (
    <div style={styles.timeline}>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <div
            key={i}
            style={isLast ? styles.timelineItemLast : styles.timelineItem}
          >
            <div style={{ position: 'relative' }}>
              <div style={styles.timelineDot} />
              {!isLast && <div style={styles.timelineLine} />}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'baseline' }}>
              <span style={styles.timelineTime}>{seg.time}</span>
              <span style={styles.timelineLabel}>{seg.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SchedulePage() {
  return (
    <div style={styles.page}>
      {/* ── Page Header ──────────────────────── */}
      <header style={styles.header}>
        <span style={styles.headerTag}>
          <Calendar size={16} /> Schedule
        </span>
        <h1 style={styles.headerTitle}>Weekly Meeting Schedule</h1>
        <p style={styles.headerSub}>
          Our rhythm of gathering keeps us grounded in the Word, connected in
          fellowship, and growing as disciples. All times are Central Time (CT).
        </p>
      </header>

      {/* ── Schedule Cards ───────────────────── */}
      <div style={styles.content}>
        {schedule.map((meeting, idx) => {
          const Icon = meeting.icon;
          return (
            <article key={idx} style={styles.dayCard}>
              <div style={styles.dayHeader}>
                <div style={styles.dayIconWrap}>
                  <Icon size={22} />
                </div>
                <div>
                  <div style={styles.dayTitle}>
                    {meeting.day} — {meeting.title}
                  </div>
                  {meeting.subtitle && (
                    <div style={styles.dayMeta}>{meeting.subtitle}</div>
                  )}
                </div>
                <div style={styles.dayTimeBadge}>
                  <Clock size={14} /> {meeting.time}
                </div>
              </div>
              <div style={styles.dayBody}>
                <TimelineSegments segments={meeting.segments} />
              </div>
            </article>
          );
        })}

        {/* ── Notes ──────────────────────────── */}
        <div style={styles.notesSection}>
          <h3 style={styles.notesTitle}>
            <Info size={20} color="var(--color-primary)" /> Schedule Notes
          </h3>
          <ul style={styles.notesList}>
            {[
              'All meetings are held virtually unless otherwise announced.',
              'Thursday meetings alternate between Week A (weeks 1 & 3) and Week B (weeks 2 & 4) each month.',
              '"Deep Calls to Deep" only occurs when a month has a 5th Thursday.',
              'Times are subject to occasional adjustment — check the calendar below for the latest updates.',
              'New members are welcome to attend any meeting. Reach out to a leader for access details.',
            ].map((note, i) => (
              <li key={i} style={styles.notesItem}>
                <span style={styles.notesBullet}>&bull;</span>
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Google Calendar ────────────────── */}
        <div style={styles.calendarSection}>
          <div style={styles.calendarHeader}>
            <Calendar size={20} color="var(--color-primary)" />
            Community Calendar
          </div>
          <iframe
            title="HVK Community Calendar"
            src="https://calendar.google.com/calendar/embed?src=390cfd1b1abe61204b2176348dd0922608bc775ff31d686c85082ca1fac784a6%40group.calendar.google.com&ctz=America%2FCosta_Rica"
            style={styles.calendarIframe}
          />
        </div>
      </div>
    </div>
  );
}
