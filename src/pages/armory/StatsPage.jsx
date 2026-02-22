import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const CATEGORY_FILTERS = ['All', 'Meeting', 'Workout'];
const DAY_FILTERS = ['All', 'Monday', 'Wednesday', 'Thursday'];
const DATE_RANGES = [
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
  { label: 'All Time', value: 0 },
];

export default function StatsPage() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dayFilter, setDayFilter] = useState('All');
  const [dateRange, setDateRange] = useState(30);

  /* Coin totals (same as Dashboard) */
  const [credits, setCredits] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    if (profile?.user_id) {
      fetchStats();
    }
  }, [profile?.user_id]);

  useEffect(() => {
    if (user) fetchCoinTotals();
  }, [user]);

  async function fetchStats() {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('user_daily_stats')
        .select('*')
        .eq('stat_user_id', profile.user_id)
        .order('stat_date', { ascending: true });

      if (fetchError) throw fetchError;
      setStats(data || []);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load stats data.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCoinTotals() {
    try {
      const { data: coinData, error: coinError } = await supabase
        .from('coin_relationships')
        .select('*')
        .eq('coin_user_id', user.id);

      if (coinError) throw coinError;

      const allRecords = coinData || [];

      // Crucible Credits
      const crucibleRecords = allRecords.filter(
        (r) => r.coin_type_id === 'Crucible Credit'
      );
      let totalCredits = 0;
      if (crucibleRecords.length > 0) {
        const allPointRefs = crucibleRecords.reduce((acc, record) => {
          if (Array.isArray(record.coin_relationship_point_ref) && record.coin_relationship_point_ref.length > 0) {
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
          totalCredits = (pointsData || []).reduce((sum, pt) => sum + (pt.point_value || 0), 0);
        }
      }

      // Talent Tokens
      const talentRecords = allRecords.filter((r) => r.coin_type_id === 'Talent Token');
      const totalTokens = talentRecords.reduce((sum, r) => sum + (r.coin_relationship_talent_amount || 0), 0);

      // Kingdom Coins
      const totalCoins = allRecords.filter((r) => r.coin_type_id === 'Kingdom Coin').length;

      setCredits(totalCredits);
      setTokens(totalTokens);
      setCoins(totalCoins);
    } catch (err) {
      console.error('Error fetching coin totals:', err);
    }
  }

  function getDayOfWeek(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  const filteredStats = useMemo(() => {
    let result = [...stats];

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter(
        (s) => s.stat_category && s.stat_category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Day type filter
    if (dayFilter !== 'All') {
      result = result.filter((s) => getDayOfWeek(s.stat_date) === dayFilter);
    }

    // Date range filter
    if (dateRange > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - dateRange);
      cutoffDate.setHours(0, 0, 0, 0);
      result = result.filter((s) => new Date(s.stat_date + 'T00:00:00') >= cutoffDate);
    }

    return result;
  }, [stats, categoryFilter, dayFilter, dateRange]);

  // Chart data for the line chart
  const lineChartData = useMemo(() => {
    return filteredStats.map((s) => ({
      date: format(new Date(s.stat_date + 'T00:00:00'), 'MMM d'),
      rawDate: s.stat_date,
      percentage: s.stat_percentage != null ? Number(s.stat_percentage) : 0,
      category: s.stat_category || 'Unknown',
    }));
  }, [filteredStats]);

  // Summary stats
  const summaryStats = useMemo(() => {
    if (filteredStats.length === 0) {
      return {
        averagePercentage: 0,
        totalPointsEarned: 0,
        totalPointsPossible: 0,
        totalMeetings: 0,
        currentStreak: 0,
      };
    }

    const totalPercentage = filteredStats.reduce(
      (sum, s) => sum + (s.stat_percentage != null ? Number(s.stat_percentage) : 0),
      0
    );
    const averagePercentage = totalPercentage / filteredStats.length;

    const totalPointsEarned = filteredStats.reduce(
      (sum, s) => sum + (s.stat_points_earned != null ? Number(s.stat_points_earned) : 0),
      0
    );

    const totalPointsPossible = filteredStats.reduce(
      (sum, s) => sum + (s.stat_points_possible != null ? Number(s.stat_points_possible) : 0),
      0
    );

    const totalMeetings = filteredStats.length;

    // Calculate current streak: consecutive dates (from the most recent backwards) with stats > 0
    let currentStreak = 0;
    const sortedByDateDesc = [...filteredStats].sort(
      (a, b) => new Date(b.stat_date) - new Date(a.stat_date)
    );

    // Get unique dates in descending order
    const uniqueDates = [];
    const seenDates = new Set();
    for (const s of sortedByDateDesc) {
      if (!seenDates.has(s.stat_date)) {
        seenDates.add(s.stat_date);
        uniqueDates.push(s.stat_date);
      }
    }

    for (let i = 0; i < uniqueDates.length; i++) {
      const dateStats = filteredStats.filter((s) => s.stat_date === uniqueDates[i]);
      const hasPositive = dateStats.some(
        (s) => s.stat_percentage != null && Number(s.stat_percentage) > 0
      );
      if (hasPositive) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      averagePercentage: Math.round(averagePercentage * 10) / 10,
      totalPointsEarned,
      totalPointsPossible,
      totalMeetings,
      currentStreak,
    };
  }, [filteredStats]);

  // Bar chart data: average percentage by day type
  const barChartData = useMemo(() => {
    const dayGroups = {};
    for (const day of ['Monday', 'Wednesday', 'Thursday']) {
      dayGroups[day] = [];
    }

    for (const s of filteredStats) {
      const day = getDayOfWeek(s.stat_date);
      if (dayGroups[day] !== undefined) {
        dayGroups[day].push(s.stat_percentage != null ? Number(s.stat_percentage) : 0);
      }
    }

    return Object.entries(dayGroups).map(([day, values]) => ({
      day,
      average: values.length > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0,
      count: values.length,
    }));
  }, [filteredStats]);

  // Determine the line color based on category filter
  function getLineColor() {
    if (categoryFilter === 'Meeting') return '#DC143C';
    if (categoryFilter === 'Workout') return '#3b82f6';
    return '#DC143C';
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Daily Stats</h1>
          <p style={styles.subtitle}>Track your progress over time</p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox} role="alert">
            {error}
          </div>
        )}

        {/* Filters */}
        <div style={styles.filterBar}>
          {/* Category filter */}
          <div style={styles.filterSection}>
            <span style={styles.filterLabel}>Category</span>
            <div style={styles.filterGroup}>
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat}
                  style={{
                    ...styles.filterChip,
                    ...(categoryFilter === cat ? styles.filterChipActive : {}),
                  }}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Day filter */}
          <div style={styles.filterSection}>
            <span style={styles.filterLabel}>Day</span>
            <div style={styles.filterGroup}>
              {DAY_FILTERS.map((day) => (
                <button
                  key={day}
                  style={{
                    ...styles.filterChip,
                    ...(dayFilter === day ? styles.filterChipActive : {}),
                  }}
                  onClick={() => setDayFilter(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Date range filter */}
          <div style={styles.filterSection}>
            <span style={styles.filterLabel}>Range</span>
            <div style={styles.filterGroup}>
              {DATE_RANGES.map((range) => (
                <button
                  key={range.value}
                  style={{
                    ...styles.filterChip,
                    ...(dateRange === range.value ? styles.filterChipActive : {}),
                  }}
                  onClick={() => setDateRange(range.value)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coin Totals (matching Dashboard) */}
        <div style={styles.coinGrid}>
          <div style={{ ...styles.coinCard, borderLeft: '4px solid var(--color-primary)' }}>
            <span style={styles.coinValue}>{credits}</span>
            <span style={styles.coinLabel}>Crucible Credits</span>
          </div>
          <div style={{ ...styles.coinCard, borderLeft: '4px solid var(--color-warning)' }}>
            <span style={styles.coinValue}>{tokens}</span>
            <span style={styles.coinLabel}>Talent Tokens</span>
          </div>
          <div style={{ ...styles.coinCard, borderLeft: '4px solid var(--color-success)' }}>
            <span style={styles.coinValue}>{coins}</span>
            <span style={styles.coinLabel}>Kingdom Coins</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <span style={styles.summaryValue}>{summaryStats.averagePercentage}%</span>
            <span style={styles.summaryLabel}>Average Score</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryValue}>{summaryStats.totalPointsEarned}</span>
            <span style={styles.summaryLabel}>Points Earned</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryValue}>{summaryStats.totalPointsPossible}</span>
            <span style={styles.summaryLabel}>Points Possible</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryValue}>{summaryStats.totalMeetings}</span>
            <span style={styles.summaryLabel}>Meetings Attended</span>
          </div>
          <div style={styles.summaryCard}>
            <span style={styles.summaryValue}>{summaryStats.currentStreak}</span>
            <span style={styles.summaryLabel}>Current Streak</span>
          </div>
        </div>

        {/* Line Chart */}
        {filteredStats.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              {stats.length === 0
                ? 'No stats data available yet.'
                : 'No data matches the current filters.'}
            </p>
          </div>
        ) : (
          <>
            <div style={styles.chartCard}>
              <h2 style={styles.chartTitle}>Performance Over Time</h2>
              <div style={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={360}>
                  <LineChart
                    data={lineChartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                      tickLine={{ stroke: 'var(--color-border)' }}
                      axisLine={{ stroke: 'var(--color-border)' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                      tickLine={{ stroke: 'var(--color-border)' }}
                      axisLine={{ stroke: 'var(--color-border)' }}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                      }}
                      formatter={(value) => [`${value}%`, 'Score']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      name="Score %"
                      stroke={getLineColor()}
                      strokeWidth={2}
                      dot={{ r: 3, fill: getLineColor() }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart - Average by Day */}
            <div style={styles.chartCard}>
              <h2 style={styles.chartTitle}>Average Score by Day</h2>
              <div style={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={barChartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 13, fill: 'var(--color-text-secondary)' }}
                      tickLine={{ stroke: 'var(--color-border)' }}
                      axisLine={{ stroke: 'var(--color-border)' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                      tickLine={{ stroke: 'var(--color-border)' }}
                      axisLine={{ stroke: 'var(--color-border)' }}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                      }}
                      formatter={(value, name, props) => [
                        `${value}% (${props.payload.count} sessions)`,
                        'Avg Score',
                      ]}
                    />
                    <Bar
                      dataKey="average"
                      name="Avg Score %"
                      fill="#DC143C"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={80}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg-alt)',
    fontFamily: 'var(--font-family)',
    padding: '24px',
  },
  container: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40vh',
  },
  loadingText: {
    fontSize: '16px',
    color: 'var(--color-text-muted)',
  },

  /* Header */
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    margin: 0,
  },

  /* Error */
  errorBox: {
    padding: '12px 14px',
    fontSize: '14px',
    color: 'var(--color-error)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '16px',
    lineHeight: '1.4',
  },

  /* Filters */
  filterBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginBottom: '24px',
    backgroundColor: 'var(--color-bg)',
    padding: '20px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
  },
  filterSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    minWidth: '70px',
  },
  filterGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterChip: {
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-bg-alt)',
    border: '1px solid var(--color-border)',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  filterChipActive: {
    color: '#ffffff',
    backgroundColor: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
  },

  /* Coin Totals */
  coinGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  coinCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 24px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
    gap: '4px',
  },
  coinValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text)',
    lineHeight: '1.2',
  },
  coinLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  /* Summary Cards */
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  summaryCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
    gap: '6px',
  },
  summaryValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text)',
    lineHeight: '1.2',
  },
  summaryLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
  },

  /* Charts */
  chartCard: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
    padding: '24px',
    marginBottom: '24px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text)',
    marginBottom: '20px',
  },
  chartWrapper: {
    width: '100%',
    overflowX: 'auto',
  },

  /* Empty State */
  emptyState: {
    textAlign: 'center',
    padding: '60px 24px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
  },
  emptyText: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    margin: 0,
  },
};
