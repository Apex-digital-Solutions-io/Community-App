import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const MISSION_CARDS = [
  { eyebrow: 'OUR MISSION', title: 'The Mission', text: 'To make disciples of Christ by providing fellowship, mentorship, and spiritual guidance, equipping individuals to grow in spiritual disciplines, walk in the power of the Holy Spirit, and become vessels for honorable use in God\'s Kingdom.' },
  { eyebrow: 'OUR VISION', title: 'The Vision', text: 'To see individuals transformed into the image of Christ, living in their God-given identity, free from sin, and walking in the authority and purpose of the Holy Spirit for the glory of God and the advancement of His Kingdom.' },
  { eyebrow: 'OUR VALUES', title: 'The Values', text: 'Biblical truth, authentic fellowship, radical accountability, intentional discipleship, and the transforming power of the Holy Spirit guide everything we do as we build up the body of Christ.' },
];

const OFFERS = [
  { num: '01', title: 'Biblical Teaching', body: 'Deep dive into Scripture with Monday morning calls and Thursday night studies focused on practical application of God\'s Word.' },
  { num: '02', title: 'Authentic Fellowship', body: 'Build genuine relationships with brothers who understand your struggles and celebrate your victories in Christ.' },
  { num: '03', title: 'Personal Accountability', body: 'Weekly check-ins with dedicated mentors who keep you sharp, encourage growth, and challenge you to walk in victory.' },
  { num: '04', title: 'Spiritual Disciplines', body: 'Develop consistent habits of prayer, Scripture memory, fasting, and service that deepen your relationship with God.' },
  { num: '05', title: 'Leadership Development', body: 'Clear pathway from Swordsman to Edge Keeper to Forge Keeper as you grow in spiritual maturity and service.' },
  { num: '06', title: 'Spirit-Led Living', body: 'Learn to walk in the power and authority of the Holy Spirit, equipped for spiritual warfare and Kingdom impact.' },
];

const TIERS = [
  { name: 'FORGE KEEPER', greek: 'Episkopos', desc: 'Oversees the community. Equips Edge Keepers. Sets doctrine.' },
  { name: 'EDGE KEEPER', greek: 'Diakonos', desc: 'Walks with Swordsmen. Disciples one or two deeply.' },
  { name: 'SWORDSMAN', greek: 'Mathetes', desc: 'Disciple in training. Building habits, growing in disciplines.' },
];

function Rule() {
  return (
    <div style={s.rule}>
      <div style={s.ruleLine} /><div style={s.ruleTick} /><div style={s.ruleLine} />
    </div>
  );
}

function CornerTicks() {
  return (
    <>
      <div style={{ ...s.tick, top: -5, left: -5 }} />
      <div style={{ ...s.tick, top: -5, right: -5 }} />
      <div style={{ ...s.tick, bottom: -5, left: -5 }} />
      <div style={{ ...s.tick, bottom: -5, right: -5 }} />
    </>
  );
}

function SectionPlate({ num, eyebrow, title, kicker }) {
  return (
    <div style={s.sectionPlate}>
      <div style={s.plateNum}>{num}</div>
      <div style={s.plateBody}>
        <div style={s.plateEyebrow}>{eyebrow}</div>
        <div style={s.plateTitle}>{title}</div>
        {kicker && <div style={s.plateKicker}>{kicker}</div>}
      </div>
    </div>
  );
}

function RunningHeader({ left, right }) {
  return (
    <div style={s.runningHeader}>
      <span>{left}</span>
      <span style={{ color: 'var(--crimson)' }}>{right}</span>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      glow.style.left = (e.clientX - rect.left) + 'px';
      glow.style.top = (e.clientY - rect.top) + 'px';
      glow.style.opacity = '1';
    };
    const onLeave = () => { glow.style.opacity = '0'; };
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <style>{responsiveCSS}</style>

      {/* Hero */}
      <section ref={heroRef} style={s.hero}>
        <div ref={glowRef} style={s.mouseGlow} />
        <div style={s.heroFrame}>
          <CornerTicks />
          <div style={s.innerBorder} />

          <div style={s.heroEyebrow}>HIDDEN VALLEY KINGS · EST · MMXXV</div>
          <div style={s.heroLogo}><img src="/hvklogo.png" alt="HVK" style={{ width: 140, height: 140, objectFit: 'contain' }} /></div>
          <Rule />
          <div style={s.heroPretitle}>A Brotherhood</div>
          <div style={s.heroTitleLine}>BUILDING</div>
          <div style={s.heroThe}>· THE ·</div>
          <div style={s.heroTitleLine}>KINGDOM</div>

          <p style={s.heroSubtagline}>
            Equipping men to walk in the power of the Holy Spirit<br />
            and become vessels for honorable use in God's Kingdom.
          </p>

          <div style={s.heroCta}>
            <Link to="/accountability" style={s.btnPrimary}>Join the Movement</Link>
            <Link to="/roles" style={s.btnSecondary}>Learn More</Link>
          </div>

          <div style={s.heroStamp}><div style={s.heroStampInner}>HVK · EST · MMXXV</div></div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <div style={s.scriptureQuote}>"Go therefore and make disciples of all nations…"</div>
            <div style={s.scriptureRef}>— Matthew 28:19</div>
          </div>
        </div>
      </section>

      {/* Section I: Mission */}
      <section style={s.section}>
        <div style={s.container}>
          <RunningHeader left="Hidden Valley Kings · Building the Kingdom" right="§ I" />
          <SectionPlate num="I" eyebrow="SECTION ONE" title="Built on Biblical Truth" kicker="Our foundation, our calling, our charge" />

          <div className="hvk-mission-grid" style={s.missionGrid}>
            {MISSION_CARDS.map((c) => (
              <div key={c.eyebrow} style={s.missionCard}>
                <div style={s.missionEyebrow}>{c.eyebrow}</div>
                <h3 style={s.missionH3}>{c.title}</h3>
                <p style={s.missionP}>{c.text}</p>
              </div>
            ))}
          </div>

          <div style={s.scriptureBox}>
            <div style={s.scriptureBoxHeader}>KEY TRUTH</div>
            <div style={s.scriptureBoxBody}>
              <p style={s.scriptureBoxQuote}>"Apart from me you can do nothing."</p>
              <div style={s.scriptureBoxRef}>— JOHN 15:5</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section II: What We Offer */}
      <section style={s.section}>
        <div style={s.container}>
          <RunningHeader left="Hidden Valley Kings · How We Serve" right="§ II" />
          <SectionPlate num="II" eyebrow="SECTION TWO" title="What We Offer" kicker="Six disciplines that form the man" />

          <div className="hvk-offer-list" style={s.offerList}>
            {OFFERS.map((o) => (
              <div key={o.num} className="hvk-offer-item" style={s.offerItem}>
                <div style={s.offerNum}>{o.num}</div>
                <div>
                  <div style={s.offerTitle}>{o.title}</div>
                  <div style={s.offerBody}>{o.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section III: Tiers */}
      <section style={s.section}>
        <div style={s.container}>
          <RunningHeader left="Hidden Valley Kings · The Pattern" right="§ III" />
          <SectionPlate num="III" eyebrow="SECTION THREE" title="Three Tiers · One Brotherhood" kicker="Forge Keepers call · Edge Keepers walk with · Swordsmen are sent" />

          <div style={s.tierTable}>
            <div className="hvk-tier-header" style={s.tierHeader}>
              <div>TIER</div><div>GREEK</div><div>OFFICE</div>
            </div>
            {TIERS.map((t) => (
              <div key={t.name} className="hvk-tier-row" style={s.tierRow}>
                <div style={s.tierName}>{t.name}</div>
                <div style={s.tierGreek}>{t.greek}</div>
                <div style={s.tierDesc}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="join" style={s.finalCta}>
        <div style={s.finalFrame}>
          <CornerTicks />
          <div style={s.innerBorder} />
          <h2 style={s.finalH2}>THE KING IS CALLING</h2>
          <p style={s.finalSubtitle}>Will you answer the call to deny yourself, take up your cross, and follow Him?</p>
          <Rule />
          <div style={{ margin: '40px auto', maxWidth: 600, textAlign: 'center' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, lineHeight: 1.5, color: 'var(--parchment)', marginBottom: 12 }}>
              "Iron sharpens iron, and one man sharpens another."
            </p>
            <div style={s.scriptureRef}>— PROVERBS 27:17</div>
          </div>
          <div style={s.heroCta}>
            <Link to="/schedule" style={s.btnPrimary}>View Our Schedule</Link>
            <Link to="/roles" style={s.btnSecondary}>Discover Your Role</Link>
          </div>
        </div>
      </section>
    </>
  );
}

const responsiveCSS = `
  @media (max-width: 900px) {
    .hvk-mission-grid { grid-template-columns: 1fr !important; }
    .hvk-offer-list { grid-template-columns: 1fr !important; }
    .hvk-offer-item { border-right: none !important; }
    .hvk-tier-header { grid-template-columns: 1fr !important; }
    .hvk-tier-header > div:not(:first-child) { display: none !important; }
    .hvk-tier-row { grid-template-columns: 1fr !important; gap: 6px !important; }
  }
`;

const s = {
  hero: { position: 'relative', minHeight: 'calc(100vh - 84px)', padding: '80px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mouseGlow: { position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,28,44,0.18) 0%, rgba(184,28,44,0.08) 30%, transparent 70%)', transform: 'translate(-50%, -50%)', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s ease', zIndex: 0, mixBlendMode: 'screen' },
  heroFrame: { position: 'relative', zIndex: 1, maxWidth: 920, width: '100%', padding: '80px 60px 100px', border: '1.5px solid var(--crimson)' },
  innerBorder: { position: 'absolute', inset: 8, border: '0.5px solid var(--rule-soft)', pointerEvents: 'none' },
  tick: { position: 'absolute', width: 10, height: 10, background: 'var(--crimson)' },
  heroEyebrow: { textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 6, color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 36 },
  heroLogo: { display: 'flex', justifyContent: 'center', marginBottom: 32 },
  rule: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '28px auto', maxWidth: 320 },
  ruleLine: { flex: 1, height: 1, background: 'var(--rule-soft)' },
  ruleTick: { width: 10, height: 5, background: 'var(--crimson)' },
  heroPretitle: { textAlign: 'center', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, color: 'var(--parchment-dim)', letterSpacing: 1, marginBottom: 16 },
  heroTitleLine: { textAlign: 'center', fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: 'clamp(48px, 8vw, 84px)', letterSpacing: 8, color: 'var(--parchment)', lineHeight: 1, textShadow: 'var(--display-shadow)' },
  heroThe: { textAlign: 'center', fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 20, letterSpacing: 8, color: 'var(--crimson)', margin: '16px 0' },
  heroSubtagline: { textAlign: 'center', marginTop: 48, fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 17, color: 'var(--parchment-dim)', lineHeight: 1.6, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' },
  heroCta: { display: 'flex', gap: 18, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 32px', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', textDecoration: 'none', background: 'var(--crimson)', color: '#F4E8D0', border: '1.5px solid var(--crimson)', cursor: 'pointer', transition: 'background 0.15s ease' },
  btnSecondary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 32px', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', textDecoration: 'none', background: 'transparent', color: 'var(--parchment)', border: '1.5px solid var(--parchment)', cursor: 'pointer', transition: 'background 0.15s ease, color 0.15s ease' },
  heroStamp: { display: 'flex', justifyContent: 'center', margin: '48px 0 32px' },
  heroStampInner: { padding: '8px 20px', background: 'var(--parchment)', color: 'var(--anvil)', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 11, letterSpacing: 6 },
  scriptureQuote: { fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 14, color: 'var(--parchment-dim)', marginBottom: 8 },
  scriptureRef: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: 'var(--crimson)', textTransform: 'uppercase' },

  section: { padding: '100px 24px', position: 'relative' },
  container: { maxWidth: 1180, margin: '0 auto' },
  runningHeader: { display: 'flex', justifyContent: 'space-between', paddingBottom: 12, marginBottom: 36, borderBottom: '1px solid var(--rule-soft)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2.5, color: 'var(--parchment-dim)', textTransform: 'uppercase' },
  sectionPlate: { display: 'flex', marginBottom: 60 },
  plateNum: { width: 96, background: 'var(--crimson)', color: '#F4E8D0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 42, letterSpacing: 2, boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.2)' },
  plateBody: { flex: 1, background: 'var(--anvil)', padding: '18px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  plateEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 6 },
  plateTitle: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--parchment)' },
  plateKicker: { fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 14, color: 'var(--parchment-dim)', marginTop: 4 },

  missionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 },
  missionCard: { background: 'var(--anvil)', border: '1px solid var(--rule)', borderLeft: '4px solid var(--crimson)', padding: '32px 28px' },
  missionEyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, color: 'var(--crimson)', textTransform: 'uppercase', marginBottom: 10 },
  missionH3: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 18, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--parchment)', marginBottom: 16 },
  missionP: { fontFamily: "'EB Garamond', serif", fontSize: 15, lineHeight: 1.65, color: 'var(--parchment)' },

  scriptureBox: { background: 'var(--anvil)', border: '1px solid var(--rule)', marginTop: 48, maxWidth: 820, marginLeft: 'auto', marginRight: 'auto' },
  scriptureBoxHeader: { background: 'var(--crimson)', color: '#F4E8D0', padding: '9px 16px', fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 11, letterSpacing: 4 },
  scriptureBoxBody: { padding: '22px 26px' },
  scriptureBoxQuote: { fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, color: 'var(--parchment)', marginBottom: 12 },
  scriptureBoxRef: { fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 11, letterSpacing: 3, color: 'var(--crimson)', textAlign: 'right' },

  offerList: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--rule)', background: 'var(--anvil)' },
  offerItem: { padding: '28px', borderBottom: '1px dotted var(--rule-soft)', borderRight: '1px dotted var(--rule-soft)', display: 'flex', gap: 18, alignItems: 'flex-start' },
  offerNum: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--crimson)', fontWeight: 700, minWidth: 26, paddingTop: 2 },
  offerTitle: { fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--parchment)', marginBottom: 8 },
  offerBody: { fontFamily: "'EB Garamond', serif", fontSize: 14, lineHeight: 1.6, color: 'var(--parchment-dim)' },

  tierTable: { border: '1px solid var(--rule)', background: 'var(--anvil)', marginTop: 48 },
  tierHeader: { display: 'grid', gridTemplateColumns: '200px 160px 1fr', background: 'var(--onyx)', color: 'var(--parchment)', padding: '12px 22px', fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, fontWeight: 600, borderBottom: '1px solid var(--rule)' },
  tierRow: { display: 'grid', gridTemplateColumns: '200px 160px 1fr', padding: '18px 22px', fontSize: 14, lineHeight: 1.55, borderTop: '1px solid var(--rule-soft-2)', alignItems: 'center' },
  tierName: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 12, letterSpacing: 2.5, color: 'var(--crimson)' },
  tierGreek: { fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 15, color: 'var(--parchment-dim)' },
  tierDesc: { fontFamily: "'EB Garamond', serif", color: 'var(--parchment)' },

  finalCta: { padding: '100px 24px 120px', textAlign: 'center' },
  finalFrame: { maxWidth: 820, margin: '0 auto', position: 'relative', padding: '60px 48px', border: '1px solid var(--crimson)' },
  finalH2: { fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: 6, color: 'var(--parchment)', marginBottom: 20 },
  finalSubtitle: { fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, color: 'var(--parchment-dim)', marginBottom: 40 },
};
