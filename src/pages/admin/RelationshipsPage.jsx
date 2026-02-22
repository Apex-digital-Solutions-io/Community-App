import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { ROLES } from '../../lib/constants';

export default function RelationshipsPage() {
  const { isForgeKeeper, loading: authLoading } = useAuth();

  const [relationships, setRelationships] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingRelationships, setLoadingRelationships] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  /* Add relationship form */
  const [mentorId, setMentorId] = useState('');
  const [discipleId, setDiscipleId] = useState('');
  const [relationshipDate, setRelationshipDate] = useState('');
  const [addingRelationship, setAddingRelationship] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const [message, setMessage] = useState(null);

  const fetchRelationships = useCallback(async () => {
    setLoadingRelationships(true);
    const { data, error } = await supabase
      .from('relationships')
      .select(
        '*, mentor:users!mentor_id(user_id, user_name, user_first_name, user_last_name, user_role), disciple:users!disciple_id(user_id, user_name, user_first_name, user_last_name, user_role)'
      );

    if (error) {
      console.error('Error fetching relationships:', error);
    } else {
      setRelationships(data || []);
    }
    setLoadingRelationships(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('user_first_name');

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setAllUsers(data || []);
    }
    setLoadingUsers(false);
  }, []);

  useEffect(() => {
    if (isForgeKeeper) {
      fetchRelationships();
      fetchUsers();
    }
  }, [isForgeKeeper, fetchRelationships, fetchUsers]);

  function showMessage(text, type = 'success') {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  }

  function formatUserName(user) {
    if (!user) return 'Unknown';
    const name = `${user.user_first_name} ${user.user_last_name}`;
    return user.user_name ? `${name} (${user.user_name})` : name;
  }

  /* Group relationships by mentor */
  function getGroupedRelationships() {
    const groups = {};
    relationships.forEach((rel) => {
      const mentorKey = rel.mentor?.user_id || rel.mentor_id || 'unknown';
      if (!groups[mentorKey]) {
        groups[mentorKey] = {
          mentor: rel.mentor,
          disciples: [],
        };
      }
      groups[mentorKey].disciples.push({
        ...rel,
        discipleInfo: rel.disciple,
      });
    });
    return Object.values(groups);
  }

  const mentorEligibleUsers = allUsers.filter(
    (u) =>
      u.user_role === ROLES.EDGE_KEEPER ||
      u.user_role === ROLES.FORGE_KEEPER ||
      u.user_role === ROLES.ADMIN
  );

  async function handleAddRelationship(e) {
    e.preventDefault();

    if (!mentorId || !discipleId) {
      showMessage('Please select both a mentor and a disciple.', 'error');
      return;
    }

    if (mentorId === discipleId) {
      showMessage('A user cannot be their own mentor.', 'error');
      return;
    }

    const duplicate = relationships.find(
      (r) =>
        (r.mentor_id === mentorId || r.mentor?.user_id === mentorId) &&
        (r.disciple_id === discipleId || r.disciple?.user_id === discipleId)
    );
    if (duplicate) {
      showMessage('This mentor-disciple relationship already exists.', 'error');
      return;
    }

    setAddingRelationship(true);

    const record = {
      mentor_id: mentorId,
      disciple_id: discipleId,
    };
    if (relationshipDate) {
      record.date_of_relationship = relationshipDate;
    }

    const { error } = await supabase.from('relationships').insert(record);

    if (error) {
      showMessage('Failed to create relationship: ' + error.message, 'error');
    } else {
      showMessage('Relationship created successfully.');
      setMentorId('');
      setDiscipleId('');
      setRelationshipDate('');
      fetchRelationships();
    }
    setAddingRelationship(false);
  }

  async function handleRemoveRelationship(relationshipId) {
    setRemovingId(relationshipId);
    const { error } = await supabase
      .from('relationships')
      .delete()
      .eq('relationship_id', relationshipId);

    if (error) {
      showMessage('Failed to remove relationship: ' + error.message, 'error');
    } else {
      showMessage('Relationship removed successfully.');
      fetchRelationships();
    }
    setRemovingId(null);
  }

  if (authLoading) {
    return (
      <div style={styles.page}>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (!isForgeKeeper) {
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
            You do not have permission to access this page. Only Forge Keepers and Admins can manage relationships.
          </p>
        </div>
      </div>
    );
  }

  const grouped = getGroupedRelationships();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.heading}>Mentor-Disciple Relationships</h1>
          <p style={styles.subheading}>
            View and manage mentor-disciple pairings across the community.
          </p>
        </div>

        {/* Message Toast */}
        {message && (
          <div
            style={{
              ...styles.toast,
              ...(message.type === 'error' ? styles.toastError : styles.toastSuccess),
            }}
          >
            {message.text}
          </div>
        )}

        {/* Add Relationship Form */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Add New Relationship</h2>
          <form onSubmit={handleAddRelationship} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Mentor</label>
                <select
                  value={mentorId}
                  onChange={(e) => setMentorId(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select a mentor...</option>
                  {mentorEligibleUsers.map((u) => (
                    <option key={u.user_id} value={u.user_id}>
                      {u.user_first_name} {u.user_last_name} ({u.user_role})
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Disciple</label>
                <select
                  value={discipleId}
                  onChange={(e) => setDiscipleId(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select a disciple...</option>
                  {allUsers.map((u) => (
                    <option key={u.user_id} value={u.user_id}>
                      {u.user_first_name} {u.user_last_name}
                      {u.user_role ? ` (${u.user_role})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Start Date</label>
                <input
                  type="date"
                  value={relationshipDate}
                  onChange={(e) => setRelationshipDate(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={addingRelationship || loadingUsers}
              style={{
                ...styles.submitBtn,
                ...(addingRelationship ? styles.submitBtnDisabled : {}),
              }}
            >
              {addingRelationship ? 'Creating...' : 'Create Relationship'}
            </button>
          </form>
        </div>

        {/* Relationship Tree */}
        <div style={styles.treeSection}>
          <h2 style={styles.treeSectionTitle}>
            Current Relationships
            {relationships.length > 0 && (
              <span style={styles.countBadge}>{relationships.length}</span>
            )}
          </h2>

          {loadingRelationships ? (
            <p style={styles.loadingText}>Loading relationships...</p>
          ) : grouped.length === 0 ? (
            <p style={styles.emptyText}>
              No mentor-disciple relationships have been created yet.
            </p>
          ) : (
            <div style={styles.treeContainer}>
              {grouped.map((group, groupIdx) => (
                <div key={group.mentor?.user_id || groupIdx} style={styles.mentorGroup}>
                  {/* Mentor Header */}
                  <div style={styles.mentorHeader}>
                    <div style={styles.mentorAvatar}>
                      {(group.mentor?.user_first_name || 'M')[0]}
                    </div>
                    <div style={styles.mentorInfo}>
                      <span style={styles.mentorName}>
                        {formatUserName(group.mentor)}
                      </span>
                      <span style={styles.mentorRole}>
                        {group.mentor?.user_role || 'Mentor'}
                      </span>
                    </div>
                    <span style={styles.discipleCount}>
                      {group.disciples.length} disciple
                      {group.disciples.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Disciples */}
                  <div style={styles.discipleList}>
                    {group.disciples.map((rel) => (
                      <div key={rel.relationship_id} style={styles.discipleRow}>
                        <div style={styles.treeLine}>
                          <div style={styles.treeLineVertical} />
                          <div style={styles.treeLineHorizontal} />
                        </div>
                        <div style={styles.discipleCard}>
                          <div style={styles.discipleAvatar}>
                            {(rel.discipleInfo?.user_first_name || 'D')[0]}
                          </div>
                          <div style={styles.discipleInfo}>
                            <span style={styles.discipleName}>
                              {formatUserName(rel.discipleInfo)}
                            </span>
                            <span style={styles.discipleMeta}>
                              {rel.discipleInfo?.user_role || 'User'}
                              {rel.date_of_relationship && (
                                <>
                                  {' '}
                                  &middot; Since{' '}
                                  {new Date(
                                    rel.date_of_relationship + 'T00:00:00'
                                  ).toLocaleDateString()}
                                </>
                              )}
                            </span>
                          </div>
                          <button
                            style={{
                              ...styles.removeBtn,
                              ...(removingId === rel.relationship_id
                                ? styles.removeBtnDisabled
                                : {}),
                            }}
                            onClick={() => handleRemoveRelationship(rel.relationship_id)}
                            disabled={removingId === rel.relationship_id}
                            title="Remove relationship"
                          >
                            {removingId === rel.relationship_id ? (
                              '...'
                            ) : (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                                  fill="currentColor"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
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
    maxWidth: '900px',
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
    padding: '40px 0',
  },
  emptyText: {
    fontSize: '15px',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    padding: '40px 0',
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

  /* Toast */
  toast: {
    padding: '14px 20px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '24px',
  },
  toastSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: '#16a34a',
    border: '1px solid rgba(34, 197, 94, 0.25)',
  },
  toastError: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    color: 'var(--color-error)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },

  /* Form Card */
  formCard: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
    padding: '28px',
    marginBottom: '28px',
  },
  formTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    minWidth: '200px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
  },
  select: {
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
  input: {
    padding: '10px 14px',
    fontSize: '14px',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitBtn: {
    padding: '12px 28px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: 'var(--color-primary)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    alignSelf: 'flex-start',
  },
  submitBtnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },

  /* Tree Section */
  treeSection: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
    padding: '28px',
  },
  treeSectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  countBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '24px',
    height: '24px',
    padding: '0 8px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#fff',
    backgroundColor: 'var(--color-primary)',
    borderRadius: '999px',
  },

  /* Tree */
  treeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  mentorGroup: {
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    overflow: 'hidden',
  },
  mentorHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 20px',
    backgroundColor: 'rgba(220, 20, 60, 0.04)',
    borderBottom: '1px solid var(--color-border)',
  },
  mentorAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700',
    flexShrink: 0,
  },
  mentorInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  mentorName: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  mentorRole: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  discipleCount: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    padding: '4px 12px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: '999px',
    border: '1px solid var(--color-border)',
    flexShrink: 0,
  },

  /* Disciple List */
  discipleList: {
    padding: '8px 0',
  },
  discipleRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 20px 6px 24px',
  },
  treeLine: {
    display: 'flex',
    alignItems: 'center',
    width: '32px',
    height: '100%',
    flexShrink: 0,
    position: 'relative',
  },
  treeLineVertical: {
    position: 'absolute',
    left: '8px',
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: 'var(--color-border)',
  },
  treeLineHorizontal: {
    position: 'absolute',
    left: '8px',
    top: '50%',
    width: '20px',
    height: '2px',
    backgroundColor: 'var(--color-border)',
  },
  discipleCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    padding: '10px 14px',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    transition: 'background-color 0.15s',
  },
  discipleAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: 'rgba(220, 20, 60, 0.12)',
    color: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    flexShrink: 0,
  },
  discipleInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  discipleName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  discipleMeta: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  },
  removeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    flexShrink: 0,
    padding: 0,
    fontSize: '12px',
  },
  removeBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};
