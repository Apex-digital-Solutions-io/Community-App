import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { ROLES, COIN_TYPES, MEETING_DAYS } from '../../lib/constants';

const COIN_TYPE_OPTIONS = [
  { label: 'Crucible Credit', value: COIN_TYPES.CRUCIBLE_CREDIT },
  { label: 'Talent Token', value: COIN_TYPES.TALENT_TOKEN },
  { label: 'Kingdom Coin', value: COIN_TYPES.KINGDOM_COIN },
];

export default function AwardCoinsPage() {
  const { user, profile, isEdgeKeeper, isForgeKeeper, loading: authLoading } = useAuth();

  /* Step tracking */
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 5;

  /* Step 1: Date and day */
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  /* Step 2: User selection */
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  /* Step 3: Coin type */
  const [selectedCoinType, setSelectedCoinType] = useState('');

  /* Step 4: Activities */
  const [pointActivities, setPointActivities] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [selectedPointIds, setSelectedPointIds] = useState([]);
  const [talentAmount, setTalentAmount] = useState(10);

  /* Step 5: Submit */
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /* Recent awards */
  const [recentAwards, setRecentAwards] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  /* Add new activity */
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({ name: '', value: '', day: 'All days', role: 'All' });
  const [addingActivity, setAddingActivity] = useState(false);

  /* Messages */
  const [error, setError] = useState('');

  const currentUserId = user?.id;

  /* Fetch users for Step 2 */
  const fetchAvailableUsers = useCallback(async () => {
    if (!currentUserId) return;
    setLoadingUsers(true);

    if (isForgeKeeper) {
      const { data, error: fetchErr } = await supabase
        .from('users')
        .select('*')
        .order('user_first_name');
      if (fetchErr) {
        console.error('Error fetching users:', fetchErr);
      } else {
        setAvailableUsers(data || []);
      }
    } else {
      /* Edge Keeper: only assigned disciples */
      const { data, error: fetchErr } = await supabase
        .from('relationships')
        .select('*, disciple:users!disciple_id(user_id, user_first_name, user_last_name, user_name, user_email, user_role)')
        .eq('mentor_id', currentUserId);
      if (fetchErr) {
        console.error('Error fetching disciples:', fetchErr);
      } else {
        const disciples = (data || [])
          .map((r) => r.disciple)
          .filter(Boolean);
        setAvailableUsers(disciples);
      }
    }

    setLoadingUsers(false);
  }, [currentUserId, isForgeKeeper]);

  /* Fetch point activities for Step 4 */
  const fetchPointActivities = useCallback(async () => {
    if (!selectedCoinType || !selectedDay) return;
    setLoadingPoints(true);
    setSelectedPointIds([]);

    if (selectedCoinType === COIN_TYPES.CRUCIBLE_CREDIT) {
      const { data, error: fetchErr } = await supabase
        .from('points')
        .select('*')
        .eq('point_coin_type', COIN_TYPES.CRUCIBLE_CREDIT);

      if (fetchErr) {
        console.error('Error fetching points:', fetchErr);
        setPointActivities([]);
      } else {
        const filtered = (data || []).filter((p) => {
          if (!p.point_day || p.point_day === 'All days') return true;
          return p.point_day.includes(selectedDay);
        });
        setPointActivities(filtered);
      }
    } else if (selectedCoinType === COIN_TYPES.KINGDOM_COIN) {
      const selectedUser = availableUsers.find((u) => u.user_id === selectedUserId);
      const userRole = selectedUser?.user_role || ROLES.USER;

      const { data, error: fetchErr } = await supabase
        .from('points')
        .select('*')
        .eq('point_coin_type', COIN_TYPES.KINGDOM_COIN);

      if (fetchErr) {
        console.error('Error fetching kingdom points:', fetchErr);
        setPointActivities([]);
      } else {
        const filtered = (data || []).filter((p) => {
          if (!p.point_role) return true;
          return p.point_role === userRole || p.point_role === 'All';
        });
        setPointActivities(filtered);
      }
    } else {
      setPointActivities([]);
    }

    setLoadingPoints(false);
  }, [selectedCoinType, selectedDay, selectedUserId, availableUsers]);

  /* Fetch recent awards */
  const fetchRecentAwards = useCallback(async () => {
    if (!currentUserId) return;
    setLoadingRecent(true);

    const { data, error: fetchErr } = await supabase
      .from('coin_relationships')
      .select('*, awarded_user:users!coin_user_id(user_first_name, user_last_name, user_name)')
      .or(`coin_relationship_edge_keeper_id.eq.${currentUserId},coin_relationship_forge_keeper_id.eq.${currentUserId}`)
      .order('coin_date', { ascending: false })
      .limit(10);

    if (fetchErr) {
      console.error('Error fetching recent awards:', fetchErr);
    } else {
      setRecentAwards(data || []);
    }
    setLoadingRecent(false);
  }, [currentUserId]);

  useEffect(() => {
    if (isEdgeKeeper) {
      fetchAvailableUsers();
      fetchRecentAwards();
    }
  }, [isEdgeKeeper, fetchAvailableUsers, fetchRecentAwards]);

  useEffect(() => {
    if (currentStep === 4) {
      fetchPointActivities();
    }
  }, [currentStep, fetchPointActivities]);

  function togglePointId(pointId) {
    setSelectedPointIds((prev) =>
      prev.includes(pointId)
        ? prev.filter((id) => id !== pointId)
        : [...prev, pointId]
    );
  }

  function canProceed() {
    switch (currentStep) {
      case 1:
        return selectedDate && selectedDay;
      case 2:
        return selectedUserId;
      case 3:
        return selectedCoinType;
      case 4:
        if (selectedCoinType === COIN_TYPES.TALENT_TOKEN) {
          return talentAmount > 0 && talentAmount % 10 === 0;
        }
        return selectedPointIds.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  }

  function goNext() {
    if (canProceed() && currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    }
  }

  function goBack() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  }

  function resetForm() {
    setCurrentStep(1);
    setSelectedDate('');
    setSelectedDay('');
    setSelectedUserId('');
    setUserSearchTerm('');
    setSelectedCoinType('');
    setSelectedPointIds([]);
    setTalentAmount(10);
    setSubmitSuccess(false);
    setError('');
  }

  async function handleAddActivity() {
    if (!newActivity.name || !newActivity.value) return;
    setAddingActivity(true);
    try {
      const record = {
        point_activity: newActivity.name,
        point_value: parseInt(newActivity.value, 10),
        point_coin_type: selectedCoinType,
        point_day: newActivity.day,
        point_role: newActivity.role,
      };
      const { error: insertErr } = await supabase.from('points').insert(record);
      if (insertErr) throw insertErr;
      setNewActivity({ name: '', value: '', day: 'All days', role: 'All' });
      setShowAddActivity(false);
      fetchPointActivities();
    } catch (err) {
      setError(err.message || 'Failed to add activity.');
    }
    setAddingActivity(false);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');

    try {
      const record = {
        coin_user_id: selectedUserId,
        coin_type_id: selectedCoinType,
        coin_date: new Date().toISOString(),
        coin_relationship_point_ref: selectedPointIds.length > 0 ? selectedPointIds : null,
        coin_relationship_date_rewarded: selectedDate,
        coin_relationship_day: selectedDay,
        coin_relationship_edge_keeper_id:
          profile?.user_role === ROLES.EDGE_KEEPER ? currentUserId : null,
        coin_relationship_forge_keeper_id:
          isForgeKeeper ? currentUserId : null,
        coin_relationship_talent_amount:
          selectedCoinType === COIN_TYPES.TALENT_TOKEN ? talentAmount : null,
      };

      const { error: insertErr } = await supabase
        .from('coin_relationships')
        .insert(record);

      if (insertErr) throw insertErr;

      setSubmitSuccess(true);
      fetchRecentAwards();
    } catch (err) {
      setError(err.message || 'Failed to award coins. Please try again.');
    }
    setSubmitting(false);
  }

  function getSelectedUserName() {
    const u = availableUsers.find((usr) => usr.user_id === selectedUserId);
    if (!u) return 'Unknown';
    return `${u.user_first_name} ${u.user_last_name}` + (u.user_name ? ` (${u.user_name})` : '');
  }

  function getPointsSummary() {
    return pointActivities.filter((p) => selectedPointIds.includes(p.point_id));
  }

  if (authLoading) {
    return (
      <div style={styles.page}>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (!isEdgeKeeper) {
    return (
      <div style={styles.page}>
        <div style={styles.accessDenied}>
          <div style={styles.accessDeniedIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" fill="var(--color-primary)" />
            </svg>
          </div>
          <h2 style={styles.accessDeniedTitle}>Access Denied</h2>
          <p style={styles.accessDeniedText}>
            You do not have permission to access this page. Only Edge Keepers, Forge Keepers, and Admins can award coins.
          </p>
        </div>
      </div>
    );
  }

  const filteredUsers = availableUsers.filter((u) => {
    if (!userSearchTerm) return true;
    const term = userSearchTerm.toLowerCase();
    return (
      `${u.user_first_name} ${u.user_last_name}`.toLowerCase().includes(term) ||
      (u.user_name || '').toLowerCase().includes(term) ||
      (u.user_email || '').toLowerCase().includes(term)
    );
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.heading}>Award Coins</h1>
          <p style={styles.subheading}>
            Recognize and reward community members for their faithfulness and participation.
          </p>
        </div>

        {/* Progress Steps */}
        <div style={styles.progressBar}>
          {['Date & Day', 'Select User', 'Coin Type', 'Activities', 'Review'].map((label, i) => {
            const stepNum = i + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            return (
              <div key={label} style={styles.progressStep}>
                <div style={{
                  ...styles.progressCircle,
                  ...(isActive ? styles.progressCircleActive : {}),
                  ...(isCompleted ? styles.progressCircleCompleted : {}),
                }}>
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span style={{
                  ...styles.progressLabel,
                  ...(isActive ? styles.progressLabelActive : {}),
                }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div style={styles.stepCard}>
          {/* Success Screen */}
          {submitSuccess ? (
            <div style={styles.successContainer}>
              <div style={styles.successIconWrap}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#16a34a" />
                </svg>
              </div>
              <h2 style={styles.successTitle}>Coins Awarded Successfully</h2>
              <p style={styles.successMessage}>
                {selectedCoinType} has been awarded to {getSelectedUserName()}.
              </p>
              <button style={styles.primaryBtn} onClick={resetForm}>
                Award Another
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Date & Day */}
              {currentStep === 1 && (
                <div>
                  <h3 style={styles.stepTitle}>Select Date and Day Type</h3>
                  <p style={styles.stepDesc}>
                    Choose the meeting date and day for which you are awarding coins.
                  </p>
                  <div style={styles.formGrid}>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Meeting Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Day</label>
                      <div style={styles.dayButtons}>
                        {MEETING_DAYS.map((day) => (
                          <button
                            key={day}
                            type="button"
                            style={{
                              ...styles.dayBtn,
                              ...(selectedDay === day ? styles.dayBtnActive : {}),
                            }}
                            onClick={() => setSelectedDay(day)}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Select User */}
              {currentStep === 2 && (
                <div>
                  <h3 style={styles.stepTitle}>Select User to Award</h3>
                  <p style={styles.stepDesc}>
                    {isForgeKeeper
                      ? 'Choose any user from the community to award coins to.'
                      : 'Choose from your assigned disciples to award coins to.'}
                  </p>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Search Users</label>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  {loadingUsers ? (
                    <p style={styles.loadingText}>Loading users...</p>
                  ) : filteredUsers.length === 0 ? (
                    <p style={styles.emptyText}>No users found.</p>
                  ) : (
                    <div style={styles.userList}>
                      {filteredUsers.map((u) => (
                        <button
                          key={u.user_id}
                          type="button"
                          style={{
                            ...styles.userOption,
                            ...(selectedUserId === u.user_id ? styles.userOptionSelected : {}),
                          }}
                          onClick={() => setSelectedUserId(u.user_id)}
                        >
                          <div style={styles.userOptionInfo}>
                            <span style={styles.userOptionName}>
                              {u.user_first_name} {u.user_last_name}
                            </span>
                            {u.user_name && (
                              <span style={styles.userOptionDetail}>@{u.user_name}</span>
                            )}
                          </div>
                          {u.user_role && (
                            <span style={styles.userOptionRole}>{u.user_role}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Coin Type */}
              {currentStep === 3 && (
                <div>
                  <h3 style={styles.stepTitle}>Select Coin Type</h3>
                  <p style={styles.stepDesc}>
                    Choose the type of coin to award.
                  </p>
                  <div style={styles.coinTypeGrid}>
                    {COIN_TYPE_OPTIONS.map((ct) => (
                      <label
                        key={ct.value}
                        style={{
                          ...styles.coinTypeCard,
                          ...(selectedCoinType === ct.value ? styles.coinTypeCardSelected : {}),
                        }}
                      >
                        <input
                          type="radio"
                          name="coinType"
                          value={ct.value}
                          checked={selectedCoinType === ct.value}
                          onChange={(e) => {
                            setSelectedCoinType(e.target.value);
                            setSelectedPointIds([]);
                            setTalentAmount(10);
                          }}
                          style={styles.radioHidden}
                        />
                        <div style={{
                          ...styles.coinTypeRadio,
                          ...(selectedCoinType === ct.value ? styles.coinTypeRadioSelected : {}),
                        }} />
                        <div>
                          <span style={styles.coinTypeName}>{ct.label}</span>
                          <span style={styles.coinTypeDesc}>
                            {ct.value === COIN_TYPES.CRUCIBLE_CREDIT && 'Awarded for meeting attendance and daily activities'}
                            {ct.value === COIN_TYPES.TALENT_TOKEN && 'Awarded in 10-minute increments for service and contribution'}
                            {ct.value === COIN_TYPES.KINGDOM_COIN && 'Awarded for Kingdom-building activities based on role'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Activities */}
              {currentStep === 4 && (
                <div>
                  <h3 style={styles.stepTitle}>
                    {selectedCoinType === COIN_TYPES.TALENT_TOKEN
                      ? 'Set Talent Amount'
                      : 'Select Activities'}
                  </h3>

                  {selectedCoinType === COIN_TYPES.TALENT_TOKEN ? (
                    <div>
                      <p style={styles.stepDesc}>
                        Enter the number of minutes to award in 10-minute increments.
                      </p>
                      <div style={styles.fieldGroup}>
                        <label style={styles.label}>Minutes (in increments of 10)</label>
                        <input
                          type="number"
                          min="10"
                          step="10"
                          value={talentAmount}
                          onChange={(e) => setTalentAmount(parseInt(e.target.value, 10) || 0)}
                          style={{ ...styles.input, maxWidth: '200px' }}
                        />
                      </div>
                      {talentAmount > 0 && talentAmount % 10 !== 0 && (
                        <p style={styles.validationHint}>Amount must be in increments of 10.</p>
                      )}
                    </div>
                  ) : loadingPoints ? (
                    <p style={styles.loadingText}>Loading activities...</p>
                  ) : pointActivities.length === 0 && !showAddActivity ? (
                    <div>
                      <p style={styles.emptyText}>No applicable activities found for the selected configuration.</p>
                      {isForgeKeeper && (
                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                          <button
                            style={styles.primaryBtn}
                            onClick={() => setShowAddActivity(true)}
                          >
                            Add Activity for {selectedCoinType}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p style={styles.stepDesc}>
                        Select the activities completed by this user.
                      </p>
                      <div style={styles.activityList}>
                        {pointActivities.map((point) => {
                          const pid = point.point_id;
                          const isChecked = selectedPointIds.includes(pid);
                          return (
                            <label
                              key={pid}
                              style={{
                                ...styles.activityItem,
                                ...(isChecked ? styles.activityItemChecked : {}),
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePointId(pid)}
                                style={styles.checkbox}
                              />
                              <span style={styles.activityName}>{point.point_activity}</span>
                              <span style={styles.activityValue}>+{point.point_value}</span>
                            </label>
                          );
                        })}
                      </div>
                      {isForgeKeeper && !showAddActivity && (
                        <div style={{ marginTop: '16px' }}>
                          <button
                            style={styles.addActivityToggleBtn}
                            onClick={() => setShowAddActivity(true)}
                          >
                            + Add New Activity
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add Activity Form */}
                  {showAddActivity && isForgeKeeper && (
                    <div style={styles.addActivityForm}>
                      <h4 style={styles.addActivityTitle}>Add New Activity for {selectedCoinType}</h4>
                      <div style={styles.addActivityFields}>
                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Activity Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Led a Bible study"
                            value={newActivity.name}
                            onChange={(e) => setNewActivity((prev) => ({ ...prev, name: e.target.value }))}
                            style={styles.input}
                          />
                        </div>
                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Point Value</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 10"
                            value={newActivity.value}
                            onChange={(e) => setNewActivity((prev) => ({ ...prev, value: e.target.value }))}
                            style={{ ...styles.input, maxWidth: '120px' }}
                          />
                        </div>
                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Day</label>
                          <select
                            value={newActivity.day}
                            onChange={(e) => setNewActivity((prev) => ({ ...prev, day: e.target.value }))}
                            style={styles.addActivitySelect}
                          >
                            <option value="All days">All Days</option>
                            {MEETING_DAYS.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                        <div style={styles.fieldGroup}>
                          <label style={styles.label}>Role</label>
                          <select
                            value={newActivity.role}
                            onChange={(e) => setNewActivity((prev) => ({ ...prev, role: e.target.value }))}
                            style={styles.addActivitySelect}
                          >
                            <option value="All">All Roles</option>
                            <option value="User">User</option>
                            <option value="Swordsman">Swordsman</option>
                            <option value="Edge Keeper">Edge Keeper</option>
                            <option value="Forge Keeper">Forge Keeper</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                      </div>
                      <div style={styles.addActivityActions}>
                        <button
                          style={styles.secondaryBtn}
                          onClick={() => { setShowAddActivity(false); setNewActivity({ name: '', value: '', day: 'All days', role: 'All' }); }}
                        >
                          Cancel
                        </button>
                        <button
                          style={{
                            ...styles.primaryBtn,
                            ...(!newActivity.name || !newActivity.value ? styles.primaryBtnDisabled : {}),
                          }}
                          onClick={handleAddActivity}
                          disabled={!newActivity.name || !newActivity.value || addingActivity}
                        >
                          {addingActivity ? 'Adding...' : 'Add Activity'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div>
                  <h3 style={styles.stepTitle}>Review and Submit</h3>
                  <p style={styles.stepDesc}>
                    Please review the details before awarding coins.
                  </p>
                  <div style={styles.reviewGrid}>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Date</span>
                      <span style={styles.reviewValue}>
                        {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString() : '--'}
                      </span>
                    </div>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Day</span>
                      <span style={styles.reviewValue}>{selectedDay}</span>
                    </div>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>User</span>
                      <span style={styles.reviewValue}>{getSelectedUserName()}</span>
                    </div>
                    <div style={styles.reviewItem}>
                      <span style={styles.reviewLabel}>Coin Type</span>
                      <span style={styles.reviewValue}>{selectedCoinType}</span>
                    </div>
                    {selectedCoinType === COIN_TYPES.TALENT_TOKEN ? (
                      <div style={styles.reviewItem}>
                        <span style={styles.reviewLabel}>Talent Amount</span>
                        <span style={styles.reviewValue}>{talentAmount} minutes</span>
                      </div>
                    ) : (
                      <div style={styles.reviewItem}>
                        <span style={styles.reviewLabel}>Activities</span>
                        <div style={styles.reviewActivities}>
                          {getPointsSummary().map((p) => (
                            <span key={p.point_id} style={styles.reviewActivityTag}>
                              {p.point_activity} (+{p.point_value})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div style={styles.errorBox}>{error}</div>
                  )}

                  <button
                    style={{
                      ...styles.primaryBtn,
                      ...(submitting ? styles.primaryBtnDisabled : {}),
                      marginTop: '24px',
                      width: '100%',
                    }}
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Awarding...' : 'Award Coins'}
                  </button>
                </div>
              )}

              {/* Navigation Buttons */}
              {!submitSuccess && (
                <div style={styles.stepNav}>
                  {currentStep > 1 && (
                    <button style={styles.secondaryBtn} onClick={goBack}>
                      Back
                    </button>
                  )}
                  {currentStep < TOTAL_STEPS && (
                    <button
                      style={{
                        ...styles.primaryBtn,
                        ...(canProceed() ? {} : styles.primaryBtnDisabled),
                        marginLeft: 'auto',
                      }}
                      onClick={goNext}
                      disabled={!canProceed()}
                    >
                      Continue
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Recent Awards */}
        <div style={styles.recentSection}>
          <h2 style={styles.recentTitle}>Recent Awards</h2>
          {loadingRecent ? (
            <p style={styles.loadingText}>Loading recent awards...</p>
          ) : recentAwards.length === 0 ? (
            <p style={styles.emptyText}>No recent awards found.</p>
          ) : (
            <div style={styles.recentList}>
              {recentAwards.map((award, index) => (
                <div key={award.coin_relationship_id || index} style={styles.recentItem}>
                  <div style={styles.recentItemInfo}>
                    <span style={styles.recentItemUser}>
                      {award.awarded_user
                        ? `${award.awarded_user.user_first_name} ${award.awarded_user.user_last_name}`
                        : 'Unknown User'}
                    </span>
                    <span style={styles.recentItemType}>{award.coin_type_id}</span>
                  </div>
                  <div style={styles.recentItemMeta}>
                    <span style={styles.recentItemDay}>{award.coin_relationship_day}</span>
                    <span style={styles.recentItemDate}>
                      {award.coin_relationship_date_rewarded
                        ? new Date(award.coin_relationship_date_rewarded + 'T00:00:00').toLocaleDateString()
                        : award.coin_date
                          ? new Date(award.coin_date).toLocaleDateString()
                          : '--'}
                    </span>
                  </div>
                </div>
              ))}
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
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '32px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '8px',
  },
  subheading: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    margin: 0,
  },
  loadingText: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    padding: '32px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    padding: '24px 0',
  },

  /* Access Denied */
  accessDenied: {
    maxWidth: '440px',
    margin: '80px auto',
    textAlign: 'center',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    padding: '48px 32px',
    border: '1px solid var(--color-border)',
  },
  accessDeniedIcon: {
    marginBottom: '16px',
  },
  accessDeniedTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '12px',
  },
  accessDeniedText: {
    fontSize: '15px',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.6',
    margin: 0,
  },

  /* Progress Bar */
  progressBar: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '28px',
    gap: '8px',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  },
  progressCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-bg)',
    border: '2px solid var(--color-border)',
    transition: 'all 0.2s',
  },
  progressCircleActive: {
    color: '#fff',
    backgroundColor: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
  },
  progressCircleCompleted: {
    color: '#fff',
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  progressLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  progressLabelActive: {
    color: 'var(--color-primary)',
  },

  /* Step Card */
  stepCard: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
    padding: '32px',
    marginBottom: '28px',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '8px',
  },
  stepDesc: {
    fontSize: '14px',
    color: 'var(--color-text-muted)',
    marginBottom: '24px',
    lineHeight: '1.5',
  },

  /* Form Elements */
  formGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    minWidth: '200px',
    marginBottom: '16px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
  },
  input: {
    padding: '10px 14px',
    fontSize: '14px',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },

  /* Day Buttons */
  dayButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  dayBtn: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-bg)',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  dayBtnActive: {
    color: '#fff',
    backgroundColor: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
  },

  /* User List */
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '360px',
    overflowY: 'auto',
    marginTop: '16px',
  },
  userOption: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: 'var(--color-bg)',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'left',
    width: '100%',
    fontSize: '14px',
  },
  userOptionSelected: {
    borderColor: 'var(--color-primary)',
    backgroundColor: 'rgba(220, 20, 60, 0.04)',
  },
  userOptionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  userOptionName: {
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  userOptionDetail: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  userOptionRole: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    padding: '3px 10px',
    backgroundColor: 'var(--color-bg-alt)',
    borderRadius: '999px',
  },

  /* Coin Type */
  coinTypeGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  coinTypeCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '18px 20px',
    backgroundColor: 'var(--color-bg)',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  coinTypeCardSelected: {
    borderColor: 'var(--color-primary)',
    backgroundColor: 'rgba(220, 20, 60, 0.04)',
  },
  radioHidden: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
  },
  coinTypeRadio: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid var(--color-border)',
    flexShrink: 0,
    marginTop: '2px',
    transition: 'all 0.15s',
    boxSizing: 'border-box',
  },
  coinTypeRadioSelected: {
    borderColor: 'var(--color-primary)',
    borderWidth: '6px',
  },
  coinTypeName: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text)',
    marginBottom: '4px',
  },
  coinTypeDesc: {
    display: 'block',
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    lineHeight: '1.4',
  },

  /* Activities */
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  activityItemChecked: {
    backgroundColor: 'rgba(220, 20, 60, 0.04)',
    borderColor: 'var(--color-primary)',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
    flexShrink: 0,
  },
  activityName: {
    flex: 1,
    fontSize: '14px',
    color: 'var(--color-text)',
  },
  activityValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    flexShrink: 0,
  },
  validationHint: {
    fontSize: '13px',
    color: 'var(--color-error)',
    marginTop: '8px',
  },

  /* Add Activity */
  addActivityToggleBtn: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-primary)',
    backgroundColor: 'rgba(220, 20, 60, 0.06)',
    border: '1px dashed var(--color-primary)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    width: '100%',
    textAlign: 'center',
  },
  addActivityForm: {
    marginTop: '20px',
    padding: '24px',
    backgroundColor: 'var(--color-bg-alt)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  },
  addActivityTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '20px',
  },
  addActivityFields: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  addActivitySelect: {
    padding: '10px 14px',
    fontSize: '14px',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  addActivityActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },

  /* Review */
  reviewGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '20px',
    backgroundColor: 'var(--color-bg-alt)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  },
  reviewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  reviewLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    flexShrink: 0,
    minWidth: '100px',
  },
  reviewValue: {
    fontSize: '15px',
    fontWeight: '500',
    color: 'var(--color-text)',
    textAlign: 'right',
  },
  reviewActivities: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    justifyContent: 'flex-end',
  },
  reviewActivityTag: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 10px',
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    color: 'var(--color-primary)',
    borderRadius: '999px',
  },

  /* Buttons */
  primaryBtn: {
    padding: '12px 28px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: 'var(--color-primary)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  primaryBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  secondaryBtn: {
    padding: '12px 28px',
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-bg)',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  stepNav: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid var(--color-border)',
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
    marginTop: '16px',
  },

  /* Success */
  successContainer: {
    textAlign: 'center',
    padding: '24px 0',
  },
  successIconWrap: {
    marginBottom: '16px',
  },
  successTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '12px',
  },
  successMessage: {
    fontSize: '15px',
    color: 'var(--color-text-secondary)',
    marginBottom: '28px',
    lineHeight: '1.5',
  },

  /* Recent Awards */
  recentSection: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
    padding: '28px',
  },
  recentTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '20px',
  },
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  recentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: 'var(--color-bg-alt)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
  },
  recentItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  recentItemUser: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  recentItemType: {
    fontSize: '12px',
    color: 'var(--color-primary)',
    fontWeight: '600',
  },
  recentItemMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  recentItemDay: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
  },
  recentItemDate: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
};
