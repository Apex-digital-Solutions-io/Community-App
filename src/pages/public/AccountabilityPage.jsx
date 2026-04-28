import { useState, useEffect } from 'react';

function PointCard({ value, activity, description, span2 }) {
  return (
    <div style={{ ...s.pointCard, ...(span2 ? { gridColumn: 'span 2' } : {}) }}>
      <div style={s.pointBar} />
      <div style={s.pointValue}>{value}</div>
      <div style={s.pointActivity}>{activity}</div>
      <div style={s.pointDesc}>{description}</div>
    </div>
  );
}

function CurrencyPlate({ img, eyebrow, title, kicker, warning }) {
  return (
    <div style={s.currencyPlate}>
      <div style={{ ...s.currencyIcon, ...(warning ? { background: 'var(--crimson)', borderColor: 'var(--crimson)' } : {}) }}>
        {warning
          ? <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 32, color: 'var(--parchment)' }}>!</span>
          : <img src={img} alt="" style={{ width: 64, height: 64, objectFit: 'contain' }} />
        }
      </div>
      <div style={s.currencyBody}>
        <div style={s.currencyEyebrow}>{eyebrow}</div>
        <div style={s.currencyTitle}>{title}</div>
        <div style={s.currencyKicker}>{kicker}</div>
      </div>
    </div>
  );
}

function CoinShowcase({ img, type }) {
  return (
    <div style={s.coinShowcase}>
      <div style={s.coinWrap}>
        <img src={img} alt="" style={{ ...s.coin, opacity: 0.4, filter: 'blur(12px)', transform: 'scale(1.08)', zIndex: 0 }} />
        <img src={img} alt={type} style={{ ...s.coin, zIndex: 1, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }} />
      </div>
    </div>
  );
}

function SubsectionTitle({ children, tag }) {
  return (
    <div style={s.subsectionTitle}>
      {children}
      {tag && <span style={s.cadenceTag}>{tag}</span>}
    </div>
  );
}

export default function AccountabilityPage() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setModalOpen(false); };
    if (modalOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [modalOpen]);

  return (
    <>
      <style>{responsiveCSS}</style>

      {/* Page Header */}
      <header style={s.pageHeader}>
        <div style={s.eyebrow}>HIDDEN VALLEY KINGS · ACCOUNTABILITY</div>
        <div style={s.logoWrap}><img src="/hvklogo.png" alt="HVK" style={{ width: 80, height: 80, objectFit: 'contain' }} /></div>
        <h1 style={s.pageTitle}>ACCOUNTABILITY SYSTEM</h1>
        <div style={s.rule}><div style={s.ruleLine} /><div style={s.ruleTick} /><div style={s.ruleLine} /></div>
        <p style={s.subtitle}>Track growth, celebrate progress, advance the Kingdom</p>
      </header>

      <section style={s.section}>
        <div style={s.container}>
          {/* Intro */}
          <div style={s.intro}>
            <h2 style={s.introH2}>Iron Sharpens Iron</h2>
            <p style={s.introP}>The Armory is a tool to help you walk in discipline, not a system that grades you. Logging your habits puts your own walk in front of you — what's consistent, what's drifting, where the Spirit is moving. Three currencies mark three different kinds of growth: foundational disciplines, time poured into others, and the multiplication of disciples. The point is honesty before God, not numbers before men.</p>
            <button style={s.dataInfoBtn} onClick={() => setModalOpen(true)}>
              <span style={s.infoIcon}>?</span>
              <span>What do you do with my data?</span>
            </button>
          </div>

          {/* § I — Crucible Credit */}
          <div style={s.runningHeader}><span>Hidden Valley Kings · Foundation Currency</span><span style={{ color: 'var(--crimson)' }}>§ I · CRUCIBLE</span></div>
          <CurrencyPlate img="/crucible_credit.jpg" eyebrow="CURRENCY ONE · BRONZE" title="Crucible Credit" kicker="Foundation points earned through spiritual disciplines and group participation" />
          <CoinShowcase img="/crucible_credit.jpg" type="Crucible Credit" />

          <SubsectionTitle>Meditation · Scripture Memory</SubsectionTitle>
          <div style={s.pointsGrid}>
            <PointCard value="15 Credits" activity="With Assistance" description="Memorizing scripture with a lot of help" />
            <PointCard value="25 Credits" activity="Partial Assistance" description="Some assistance memorizing scripture" />
            <PointCard value="40 Credits" activity="Independent Mastery" description="Through the scripture without help" />
          </div>

          <SubsectionTitle tag="Monthly">Teachability · Book Review</SubsectionTitle>
          <div style={s.pointsGrid}>
            <PointCard value="20 Credits" activity="Complete the Book" description="Finish reading assigned book" />
            <PointCard value="30 Credits" activity="Active Engagement" description="Having 10+ bookmarks or notes" />
          </div>

          <SubsectionTitle>Fellowship · Monday Call of Wisdom</SubsectionTitle>
          <div style={s.pointsGrid}>
            <PointCard value="20 Credits" activity="Attendance" description="Showing up for fellowship" />
            <PointCard value="5 Credits" activity="Punctuality" description="Showing up on time" />
            <PointCard value="5 Credits" activity="Full Participation" description="Staying till end of group" />
          </div>

          <SubsectionTitle>Fellowship · Thursday Called for His Glory</SubsectionTitle>
          <div style={s.pointsGrid}>
            <PointCard value="20 Credits" activity="Attendance" description="Main weekly study" />
            <PointCard value="5 Credits" activity="Punctuality" description="Showing up on time" />
            <PointCard value="5 Credits" activity="Full Participation" description="Staying till end of group" />
          </div>
        </div>
      </section>

      {/* § II — Talent Tokens */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={s.runningHeader}><span>Hidden Valley Kings · Time Investment</span><span style={{ color: 'var(--crimson)' }}>§ II · TALENT</span></div>
          <CurrencyPlate img="/talent_token.jpg" eyebrow="CURRENCY TWO · SILVER" title="Talent Tokens" kicker="Premium currency earned through dedicated one-on-one discipleship time" />
          <CoinShowcase img="/talent_token.jpg" type="Talent Token" />
          <div style={s.pointsGrid}>
            <PointCard span2 value="1 Token per 30 Minutes" activity="Discipleship Investment" description="All roles earn equally for time spent in one-on-one discipleship outside of regular group sessions (includes Kingdom Coin teaching sessions)." />
          </div>
        </div>
      </section>

      {/* § III — Kingdom Coins */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={s.runningHeader}><span>Hidden Valley Kings · Multiplication</span><span style={{ color: 'var(--crimson)' }}>§ III · KINGDOM</span></div>
          <CurrencyPlate img="/kingdom_coin.jpg" eyebrow="CURRENCY THREE · GOLD" title="Kingdom Coins" kicker="Advanced currency earned through teaching and discipleship multiplication" />
          <CoinShowcase img="/kingdom_coin.jpg" type="Kingdom Coin" />

          <SubsectionTitle>Forge Keeper Rewards</SubsectionTitle>
          <div style={s.pointsGrid}>
            <PointCard value="1 Coin" activity="Create Teaching Material" description="Develop new Kingdom content" />
            <PointCard value="1 Coin" activity="Train Edge Keeper" description="Teaching material to Edge Keeper" />
            <PointCard value="1 Coin per Swordsman" activity="Successful Transfer" description="Each Swordsman who masters material" />
          </div>

          <SubsectionTitle>Edge Keeper Rewards</SubsectionTitle>
          <div style={s.pointsGrid}>
            <PointCard value="1 Coin" activity="Receive Teaching" description="Learning from Forge Keeper" />
            <PointCard value="1 Coin" activity="Successful Discipleship" description="Swordsman passes Forge Keeper test" />
          </div>

          <SubsectionTitle>Swordsman Rewards</SubsectionTitle>
          <div style={s.pointsGrid}>
            <PointCard value="1 Coin" activity="Learn from Edge Keeper" description="Receiving Kingdom teaching" />
            <PointCard value="1 Coin" activity="Pass Forge Keeper Test" description="Demonstrate mastery to Forge Keeper" />
          </div>
        </div>
      </section>

      {/* § IV — Critical Balance */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={s.runningHeader}><span>Hidden Valley Kings · Critical Balance</span><span style={{ color: 'var(--crimson)' }}>§ IV · WARNING</span></div>
          <CurrencyPlate warning eyebrow="SECTION FOUR · WARNING" title="Critical Balance" kicker="Points serve growth — never the other way around" />

          <div className="hvk-dodont-grid" style={s.doDontGrid}>
            <div style={s.doBox}>
              <h4 style={s.doTitle}>+ DO</h4>
              <ul style={s.doDontList}>
                {['Track spiritual disciplines for accountability', 'Celebrate growth and consistency', 'Use points to identify advancement readiness', 'Make check-ins easy and regular', 'Tie points to real spiritual growth'].map((t) => (
                  <li key={t} style={s.doLi}><span style={s.doMark}>+</span>{t}</li>
                ))}
              </ul>
            </div>
            <div style={s.dontBox}>
              <h4 style={s.dontTitle}>× DON'T</h4>
              <ul style={s.doDontList}>
                {["Make it performance-based Christianity", "Create pride or competition over grace", "Punish for low scores", "Make it complicated or burdensome", "Let the system replace genuine relationship"].map((t) => (
                  <li key={t} style={s.dontLi}><span style={s.dontMark}>×</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={s.scriptureQuoteBox}>
            <p style={s.sqQuote}>"Not that we lord it over your faith, but we work with you for your joy."</p>
            <div style={s.sqRef}>— 2 CORINTHIANS 1:24</div>
          </div>
        </div>
      </section>

      {/* Privacy Modal */}
      {modalOpen && (
        <div style={s.modalBackdrop} onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div style={s.modal}>
            <div style={s.modalInner} />
            <button style={s.modalClose} onClick={() => setModalOpen(false)}>×</button>
            <div style={s.modalEyebrow}>YOUR DATA · YOUR WALK</div>
            <h3 style={s.modalH3}>Privacy & Accountability</h3>
            <p style={s.modalP}>Your data is not tracked, sold, or shared. What you log in The Armory is visible only to you, your Edge Keeper, and your Forge Keeper — the brothers walking with you in discipleship.</p>
            <p style={s.modalP}>The Armory exists to help <em>you</em> see your walk. The numbers are between you, your discipler, and the Lord.</p>
            <ul style={s.modalUl}>
              {['No third-party tracking, no analytics, no advertising', 'No data sold or shared outside the brotherhood', 'Visible only to you and your assigned discipleship leaders', 'Used solely for your accountability and growth'].map((t) => (
                <li key={t} style={s.modalLi}><span style={{ position: 'absolute', left: 4, top: 8, color: 'var(--crimson)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>+</span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

const responsiveCSS = `
  @media (max-width: 900px) {
    .hvk-dodont-grid { grid-template-columns: 1fr !important; }
  }
`;

const s = {
  pageHeader: { padding: '72px 24px 56px', textAlign: 'center', borderBottom: '1px solid var(--rule-soft-2)' },
  eyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 6, color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 24 },
  logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: 24 },
  pageTitle: { fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: 'clamp(28px, 5.5vw, 50px)', letterSpacing: 6, color: 'var(--parchment)', lineHeight: 1.05, textShadow: 'var(--display-shadow)', marginBottom: 16 },
  rule: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '28px auto', maxWidth: 320 },
  ruleLine: { flex: 1, height: 1, background: 'var(--rule-soft)' },
  ruleTick: { width: 10, height: 5, background: 'var(--crimson)' },
  subtitle: { fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: 'var(--parchment-dim)', letterSpacing: 1 },

  section: { padding: '56px 24px' },
  container: { maxWidth: 1180, margin: '0 auto' },
  runningHeader: { display: 'flex', justifyContent: 'space-between', paddingBottom: 12, marginBottom: 36, borderBottom: '1px solid var(--rule-soft)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2.5, color: 'var(--parchment-dim)', textTransform: 'uppercase' },

  intro: { background: 'var(--anvil)', border: '1px solid var(--rule)', padding: 40, marginBottom: 56, textAlign: 'center' },
  introH2: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--parchment)', marginBottom: 16 },
  introP: { fontFamily: "'EB Garamond', serif", fontSize: 16, lineHeight: 1.7, color: 'var(--parchment)', maxWidth: 820, margin: '0 auto' },
  dataInfoBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, padding: '8px 16px', background: 'transparent', border: '1px solid var(--rule-soft)', color: 'var(--parchment-dim)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' },
  infoIcon: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, border: '1px solid currentColor', borderRadius: '50%', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 10, lineHeight: 1 },

  currencyPlate: { display: 'flex', marginBottom: 36 },
  currencyIcon: { width: 96, background: 'var(--anvil)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, border: '1px solid var(--rule)', borderRight: 'none' },
  currencyBody: { flex: 1, background: 'var(--anvil)', padding: '18px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid var(--rule)', borderLeft: '4px solid var(--crimson)' },
  currencyEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 6 },
  currencyTitle: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 'clamp(20px, 3vw, 28px)', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--parchment)' },
  currencyKicker: { fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 14, color: 'var(--parchment-dim)', marginTop: 4 },

  coinShowcase: { display: 'flex', justifyContent: 'center', padding: '24px 0 40px' },
  coinWrap: { position: 'relative', width: 300, height: 300 },
  coin: { position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '50%', objectFit: 'contain', objectPosition: 'center', pointerEvents: 'none' },

  subsectionTitle: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 4, color: 'var(--crimson)', textTransform: 'uppercase', margin: '36px 0 18px', paddingBottom: 8, borderBottom: '1px solid var(--rule-soft)' },
  cadenceTag: { display: 'inline-block', marginLeft: 10, padding: '2px 8px', background: 'var(--crimson)', color: '#F4E8D0', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 2, verticalAlign: 2 },

  pointsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 },
  pointCard: { background: 'var(--anvil)', border: '1px solid var(--rule)', padding: '22px', position: 'relative', paddingLeft: 25 },
  pointBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--crimson)' },
  pointValue: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 22, letterSpacing: 2, color: 'var(--crimson)', marginBottom: 8 },
  pointActivity: { fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--parchment)', marginBottom: 8 },
  pointDesc: { fontFamily: "'EB Garamond', serif", fontSize: 13, lineHeight: 1.5, color: 'var(--parchment-dim)' },

  doDontGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 },
  doBox: { background: 'var(--anvil)', border: '1px solid var(--rule)', borderTop: '4px solid var(--crimson)', padding: 28 },
  dontBox: { background: 'var(--anvil)', border: '1px solid var(--rule)', borderTop: '4px solid var(--parchment-dim)', padding: 28 },
  doTitle: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 18, color: 'var(--crimson)' },
  dontTitle: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 18, color: 'var(--parchment-dim)' },
  doDontList: { listStyle: 'none', padding: 0 },
  doLi: { fontFamily: "'EB Garamond', serif", fontSize: 14, lineHeight: 1.55, color: 'var(--parchment)', padding: '8px 0 8px 24px', borderBottom: '1px dotted var(--rule-soft)', position: 'relative' },
  dontLi: { fontFamily: "'EB Garamond', serif", fontSize: 14, lineHeight: 1.55, color: 'var(--parchment)', padding: '8px 0 8px 24px', borderBottom: '1px dotted var(--rule-soft)', position: 'relative' },
  doMark: { position: 'absolute', left: 4, top: 8, color: 'var(--crimson)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 },
  dontMark: { position: 'absolute', left: 4, top: 8, color: 'var(--parchment-dim)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 },

  scriptureQuoteBox: { background: 'var(--anvil)', border: '1px solid var(--rule)', borderLeft: '4px solid var(--crimson)', padding: '28px 32px', maxWidth: 820, margin: '32px auto 0', textAlign: 'center' },
  sqQuote: { fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, lineHeight: 1.55, color: 'var(--parchment)', marginBottom: 12 },
  sqRef: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--crimson)' },

  modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(10,9,8,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 24, backdropFilter: 'blur(4px)' },
  modal: { position: 'relative', maxWidth: 560, width: '100%', background: 'var(--anvil)', border: '1.5px solid var(--crimson)', padding: '48px 40px 40px', textAlign: 'left' },
  modalInner: { position: 'absolute', inset: 6, border: '0.5px solid var(--rule-soft)', pointerEvents: 'none' },
  modalClose: { position: 'absolute', top: 14, right: 14, width: 28, height: 28, background: 'transparent', border: '1px solid var(--rule-soft)', color: 'var(--parchment)', fontFamily: "'JetBrains Mono', monospace", fontSize: 16, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 4, color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 12 },
  modalH3: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 20, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--parchment)', marginBottom: 18 },
  modalP: { fontFamily: "'EB Garamond', serif", fontSize: 15, lineHeight: 1.7, color: 'var(--parchment)', marginBottom: 14 },
  modalUl: { listStyle: 'none', padding: 0, margin: '16px 0' },
  modalLi: { fontFamily: "'EB Garamond', serif", fontSize: 14, lineHeight: 1.6, color: 'var(--parchment)', padding: '8px 0 8px 22px', borderBottom: '1px dotted var(--rule-soft)', position: 'relative' },
};
