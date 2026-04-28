export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <span>HIDDENVALLEYKINGS.COM</span>
        <span style={s.crimson}>· MATTHEW 6:20 ·</span>
        <span>HVK · MMXXV</span>
      </div>
    </footer>
  );
}

const s = {
  footer: {
    borderTop: '1px solid var(--rule-soft-2)',
    padding: '40px 24px',
    background: 'var(--onyx)',
    marginTop: 'auto',
  },
  inner: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    letterSpacing: '2.5px',
    color: 'var(--parchment-dim)',
    textTransform: 'uppercase',
    flexWrap: 'wrap',
    gap: '16px',
  },
  crimson: {
    color: 'var(--crimson)',
  },
};
