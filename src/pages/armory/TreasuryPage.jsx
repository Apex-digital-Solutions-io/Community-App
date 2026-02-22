import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const COIN_TYPE_CC = 'Crucible Credit';
const COIN_TYPE_TT = 'Talent Token';
const COIN_TYPE_KC = 'Kingdom Coin';

export default function TreasuryPage() {
  const { profile } = useAuth();

  const [coinRelationships, setCoinRelationships] = useState([]);
  const [pointsMap, setPointsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    if (!profile?.user_id) return;

    async function fetchData() {
      setLoading(true);
      setError('');

      try {
        const [coinResult, pointsResult] = await Promise.all([
          supabase
            .from('coin_relationships')
            .select(`
              *,
              edge_keeper:coin_relationship_edge_keeper_id ( user_id, user_first_name, user_last_name, user_name ),
              forge_keeper:coin_relationship_forge_keeper_id ( user_id, user_first_name, user_last_name, user_name )
            `)
            .eq('coin_user_id', profile.user_id)
            .order('coin_relationship_date_rewarded', { ascending: false }),
          supabase.from('points').select('*'),
        ]);

        if (coinResult.error) {
          throw new Error(`Failed to load coin data: ${coinResult.error.message}`);
        }
        if (pointsResult.error) {
          throw new Error(`Failed to load points data: ${pointsResult.error.message}`);
        }

        setCoinRelationships(coinResult.data || []);

        const pMap = {};
        for (const point of pointsResult.data || []) {
          pMap[point.point_id] = point;
        }
        setPointsMap(pMap);
      } catch (err) {
        setError(err.message || 'An error occurred while loading treasury data.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [profile?.user_id]);

  const totals = useMemo(() => {
    let crucibleCredits = 0;
    let talentTokens = 0;
    let kingdomCoins = 0;

    for (const record of coinRelationships) {
      if (record.coin_type_id === COIN_TYPE_CC) {
        const pointIds = record.coin_relationship_point_ref || [];
        let recordTotal = 0;
        for (const pid of pointIds) {
          const point = pointsMap[pid];
          if (point) {
            recordTotal += point.point_value || 0;
          }
        }
        crucibleCredits += recordTotal;
      } else if (record.coin_type_id === COIN_TYPE_TT) {
        talentTokens += record.coin_relationship_talent_amount || 0;
      } else if (record.coin_type_id === COIN_TYPE_KC) {
        kingdomCoins += 1;
      }
    }

    return { crucibleCredits, talentTokens, kingdomCoins };
  }, [coinRelationships, pointsMap]);

  const sortedRecords = useMemo(() => {
    const sorted = [...coinRelationships];
    sorted.sort((a, b) => {
      const dateA = new Date(a.coin_relationship_date_rewarded || 0);
      const dateB = new Date(b.coin_relationship_date_rewarded || 0);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  }, [coinRelationships, sortDirection]);

  function toggleSort() {
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  }

  function getKeeperName(keeper) {
    if (!keeper) return '--';
    if (keeper.user_name) return keeper.user_name;
    if (keeper.user_first_name || keeper.user_last_name) {
      return `${keeper.user_first_name || ''} ${keeper.user_last_name || ''}`.trim();
    }
    return '--';
  }

  function getPointActivities(record) {
    const pointIds = record.coin_relationship_point_ref || [];
    if (!pointIds.length) return '--';
    const activities = pointIds
      .map((pid) => {
        const point = pointsMap[pid];
        return point ? (point.point_activity || point.point_name || `Point #${pid}`) : `Point #${pid}`;
      });
    return activities.join(', ');
  }

  function getComputedValue(record) {
    if (record.coin_type_id === COIN_TYPE_CC) {
      const pointIds = record.coin_relationship_point_ref || [];
      let total = 0;
      for (const pid of pointIds) {
        const point = pointsMap[pid];
        if (point) total += point.point_value || 0;
      }
      return total;
    }
    if (record.coin_type_id === COIN_TYPE_TT) {
      return record.coin_relationship_talent_amount || 0;
    }
    if (record.coin_type_id === COIN_TYPE_KC) {
      return 1;
    }
    return 0;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function getCoinTypeLabel(typeId) {
    if (typeId === COIN_TYPE_CC) return 'CC';
    if (typeId === COIN_TYPE_TT) return 'TT';
    if (typeId === COIN_TYPE_KC) return 'KC';
    return typeId || '--';
  }

  function getCoinTypeColor(typeId) {
    if (typeId === COIN_TYPE_CC) return '#DC143C';
    if (typeId === COIN_TYPE_TT) return '#D97706';
    if (typeId === COIN_TYPE_KC) return '#7C3AED';
    return 'var(--color-text-muted)';
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.pageHeading}>Treasury</h1>
          <div style={styles.loadingMessage}>Loading treasury data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.pageHeading}>Treasury</h1>

        {error && (
          <div style={styles.errorBox} role="alert">
            {error}
          </div>
        )}

        {/* Coin Total Cards */}
        <div style={styles.cardsRow}>
          <div style={{ ...styles.coinCard, ...styles.ccCard }}>
            <div style={styles.coinCardLabel}>Crucible Credits</div>
            <div style={{ ...styles.coinCardValue, color: '#DC143C' }}>
              {totals.crucibleCredits}
            </div>
          </div>

          <div style={{ ...styles.coinCard, ...styles.ttCard }}>
            <div style={styles.coinCardLabel}>Talent Tokens</div>
            <div style={{ ...styles.coinCardValue, color: '#D97706' }}>
              {totals.talentTokens}
            </div>
          </div>

          <div style={{ ...styles.coinCard, ...styles.kcCard }}>
            <div style={styles.coinCardLabel}>Kingdom Coins</div>
            <div style={{ ...styles.coinCardValue, color: '#7C3AED' }}>
              {totals.kingdomCoins}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={styles.summaryLabel}>
          <span style={{ color: '#DC143C', fontWeight: '700' }}>CC:{totals.crucibleCredits}</span>
          {'  '}
          <span style={{ color: '#D97706', fontWeight: '700' }}>TT:{totals.talentTokens}</span>
          {'  '}
          <span style={{ color: '#7C3AED', fontWeight: '700' }}>KC:{totals.kingdomCoins}</span>
        </div>

        {/* Transaction History */}
        <div style={styles.tableSection}>
          <h2 style={styles.sectionHeading}>Transaction History</h2>

          {sortedRecords.length === 0 ? (
            <div style={styles.emptyMessage}>
              No transactions found.
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th
                      style={{ ...styles.th, cursor: 'pointer', userSelect: 'none' }}
                      onClick={toggleSort}
                      title="Click to sort"
                    >
                      Date {sortDirection === 'desc' ? '\u25BC' : '\u25B2'}
                    </th>
                    <th style={styles.th}>Day</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Points Earned</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Value</th>
                    <th style={styles.th}>Awarded By</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRecords.map((record, index) => (
                    <tr
                      key={record.coin_relationship_id || index}
                      style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                    >
                      <td style={styles.td}>
                        {formatDate(record.coin_relationship_date_rewarded)}
                      </td>
                      <td style={styles.td}>
                        {record.coin_relationship_day || '--'}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.coinBadge,
                            backgroundColor: getCoinTypeColor(record.coin_type_id) + '18',
                            color: getCoinTypeColor(record.coin_type_id),
                            border: `1px solid ${getCoinTypeColor(record.coin_type_id)}33`,
                          }}
                        >
                          {getCoinTypeLabel(record.coin_type_id)}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {getPointActivities(record)}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>
                        {getComputedValue(record)}
                      </td>
                      <td style={styles.td}>
                        {record.edge_keeper
                          ? getKeeperName(record.edge_keeper)
                          : record.forge_keeper
                            ? getKeeperName(record.forge_keeper)
                            : '--'}
                        {record.edge_keeper && record.forge_keeper && (
                          <span style={styles.secondaryKeeper}>
                            {' / '}{getKeeperName(record.forge_keeper)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg-alt)',
    padding: '32px 24px',
    fontFamily: 'var(--font-family)',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  pageHeading: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '28px',
  },
  loadingMessage: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    padding: '60px 0',
  },
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
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  coinCard: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    padding: '28px 24px',
    textAlign: 'center',
    border: '1px solid var(--color-border)',
  },
  ccCard: {
    borderTop: '4px solid #DC143C',
  },
  ttCard: {
    borderTop: '4px solid #D97706',
  },
  kcCard: {
    borderTop: '4px solid #7C3AED',
  },
  coinCardLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  coinCardValue: {
    fontSize: '42px',
    fontWeight: '800',
    lineHeight: '1.1',
  },
  summaryLabel: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    padding: '12px 20px',
    textAlign: 'center',
    fontSize: '16px',
    letterSpacing: '1px',
    marginBottom: '28px',
  },
  tableSection: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
    padding: '24px',
  },
  sectionHeading: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--color-border)',
  },
  emptyMessage: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    padding: '40px 0',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '12px 14px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid var(--color-border)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 14px',
    color: 'var(--color-text)',
    borderBottom: '1px solid var(--color-border)',
    verticalAlign: 'top',
  },
  trEven: {
    backgroundColor: 'var(--color-bg)',
  },
  trOdd: {
    backgroundColor: 'var(--color-bg-alt)',
  },
  coinBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  secondaryKeeper: {
    color: 'var(--color-text-muted)',
    fontSize: '13px',
  },
};
