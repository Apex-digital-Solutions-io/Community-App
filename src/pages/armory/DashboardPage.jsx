import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function DashboardPage() {
  const { user, profile } = useAuth();

  const [credits, setCredits] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [coins, setCoins] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    async function fetchCoinTotals() {
      setLoading(true);
      setError('');

      try {
        // Fetch all coin_relationships for the current user
        const { data: coinData, error: coinError } = await supabase
          .from('coin_relationships')
          .select('*')
          .eq('coin_user_id', user.id);

        if (coinError) throw coinError;

        const allRecords = coinData || [];

        // --- Crucible Credits ---
        // Filter records for Crucible Credit, then look up point_values from the points table
        const crucibleRecords = allRecords.filter(
          (r) => r.coin_type_id === 'Crucible Credit'
        );

        let totalCredits = 0;
        if (crucibleRecords.length > 0) {
          // Collect all point refs from all crucible records
          const allPointRefs = crucibleRecords.reduce((acc, record) => {
            if (
              Array.isArray(record.coin_relationship_point_ref) &&
              record.coin_relationship_point_ref.length > 0
            ) {
              acc.push(...record.coin_relationship_point_ref);
            }
            return acc;
          }, []);

          if (allPointRefs.length > 0) {
            const { data: pointsData, error: pointsError } = await supabase
              .from('points')
              .select('point_value')
              .in('point_id', allPointRefs);

            if (pointsError) throw pointsError;

            totalCredits = (pointsData || []).reduce(
              (sum, pt) => sum + (pt.point_value || 0),
              0
            );
          }
        }

        // --- Talent Tokens ---
        // Sum coin_relationship_talent_amount for Talent Token records
        const talentRecords = allRecords.filter(
          (r) => r.coin_type_id === 'Talent Token'
        );
        const totalTokens = talentRecords.reduce(
          (sum, r) => sum + (r.coin_relationship_talent_amount || 0),
          0
        );

        // --- Kingdom Coins ---
        // Count records where coin_type_id = 'Kingdom Coin'
        const totalCoins = allRecords.filter(
          (r) => r.coin_type_id === 'Kingdom Coin'
        ).length;

        setCredits(totalCredits);
        setTokens(totalTokens);
        setCoins(totalCoins);

        // --- Recent Activity ---
        // Get the latest 5 coin_relationships for this user
        const { data: activityData, error: activityError } = await supabase
          .from('coin_relationships')
          .select('*')
          .eq('coin_user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (activityError) throw activityError;

        setRecentActivity(activityData || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    fetchCoinTotals();
  }, [user]);

  const firstName = profile?.user_first_name || 'Warrior';

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Welcome Header */}
        <div style={styles.welcomeSection}>
          <h1 style={styles.welcomeHeading}>
            Welcome back, {firstName}
          </h1>
          <p style={styles.summaryLabel}>
            CC:{credits} TT:{tokens} KC:{coins}
          </p>
        </div>

        {error && (
          <div style={styles.errorBox} role="alert">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div style={styles.cardsGrid}>
          <div style={{ ...styles.card, ...styles.cardCrimson }}>
            <div style={styles.cardIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="var(--color-primary)" strokeWidth="2" />
                <path d="M12 6v6l4 2" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div style={styles.cardContent}>
              <p style={styles.cardLabel}>Crucible Credits</p>
              <p style={styles.cardValue}>{credits}</p>
            </div>
          </div>

          <div style={{ ...styles.card, ...styles.cardAmber }}>
            <div style={styles.cardIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                  stroke="var(--color-warning)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={styles.cardContent}>
              <p style={styles.cardLabel}>Talent Tokens</p>
              <p style={styles.cardValue}>{tokens}</p>
            </div>
          </div>

          <div style={{ ...styles.card, ...styles.cardGreen }}>
            <div style={styles.cardIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="var(--color-success)" strokeWidth="2" />
                <path d="M8 12h8M12 8v8" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div style={styles.cardContent}>
              <p style={styles.cardLabel}>Kingdom Coins</p>
              <p style={styles.cardValue}>{coins}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p style={styles.emptyText}>No recent activity to display.</p>
          ) : (
            <div style={styles.activityList}>
              {recentActivity.map((item) => (
                <div key={item.coin_relationship_id} style={styles.activityItem}>
                  <div style={styles.activityDot} />
                  <div style={styles.activityContent}>
                    <p style={styles.activityType}>{item.coin_type_id}</p>
                    <p style={styles.activityDate}>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Unknown date'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Quick Links</h2>
          <div style={styles.quickLinksGrid}>
            <Link to="/armory/scripture-memory" style={styles.quickLink}>
              <span style={styles.quickLinkIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 19.5A2.5 2.5 0 016.5 17H20"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Scripture Memory
            </Link>
            <Link to="/armory/discipline-den" style={styles.quickLink}>
              <span style={styles.quickLinkIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.73 21a2 2 0 01-3.46 0"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Discipline Den
            </Link>
            <Link to="/armory/stats" style={styles.quickLink}>
              <span style={styles.quickLinkIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18 20V10M12 20V4M6 20v-6"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Stats
            </Link>
          </div>
        </div>

        {/* Upcoming Events */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Upcoming Events</h2>
          <div style={styles.eventsPlaceholder}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="var(--color-text-muted)" strokeWidth="2" />
              <path d="M16 2v4M8 2v4M3 10h18" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p style={styles.eventsText}>
              Check the schedule for upcoming meetings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg-alt)',
    fontFamily: 'var(--font-family)',
    paddingTop: '32px',
    paddingBottom: '48px',
  },
  container: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    padding: '0 24px',
  },

  /* Loading */
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid var(--color-border)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
  },

  /* Welcome */
  welcomeSection: {
    marginBottom: '28px',
  },
  welcomeHeading: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '6px',
  },
  summaryLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    letterSpacing: '1px',
    fontFamily: 'monospace, var(--font-family)',
  },

  /* Error */
  errorBox: {
    padding: '12px 14px',
    fontSize: '14px',
    color: 'var(--color-error)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 'var(--radius-sm)',
    lineHeight: '1.4',
    marginBottom: '24px',
  },

  /* Cards Grid */
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '36px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '24px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
  },
  cardCrimson: {
    borderLeft: '4px solid var(--color-primary)',
  },
  cardAmber: {
    borderLeft: '4px solid var(--color-warning)',
  },
  cardGreen: {
    borderLeft: '4px solid var(--color-success)',
  },
  cardIcon: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--color-bg-alt)',
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  cardLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--color-text-muted)',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text)',
    lineHeight: '1',
    margin: 0,
  },

  /* Sections */
  section: {
    marginBottom: '32px',
  },
  sectionHeading: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    padding: '20px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    textAlign: 'center',
  },

  /* Activity List */
  activityList: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 20px',
    borderBottom: '1px solid var(--color-border)',
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  activityType: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text)',
    margin: 0,
  },
  activityDate: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    margin: 0,
    flexShrink: 0,
  },

  /* Quick Links */
  quickLinksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
  },
  quickLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 20px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text)',
    textDecoration: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  quickLinkIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  /* Events Placeholder */
  eventsPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-md)',
    border: '1px dashed var(--color-border)',
  },
  eventsText: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    margin: 0,
  },
};

// Inject keyframe animation for the loading spinner
const spinnerStyleId = 'dashboard-spinner-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(spinnerStyleId)) {
  const styleEl = document.createElement('style');
  styleEl.id = spinnerStyleId;
  styleEl.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleEl);
}
