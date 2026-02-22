import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { ROLES, buildAvatarUrl } from '../../lib/constants';

const ROLE_OPTIONS = [ROLES.USER, ROLES.EDGE_KEEPER, ROLES.FORGE_KEEPER, ROLES.ADMIN];

export default function ManageUsersPage() {
  const { isForgeKeeper, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('user_first_name');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }
    setLoadingUsers(false);
  }, []);

  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    const { data, error } = await supabase
      .from('user_requests')
      .select('*')
      .eq('user_request_status', 'New Request');
    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      setRequests(data || []);
    }
    setLoadingRequests(false);
  }, []);

  useEffect(() => {
    if (isForgeKeeper) {
      fetchUsers();
      fetchRequests();
    }
  }, [isForgeKeeper, fetchUsers, fetchRequests]);

  function showMessage(text, type = 'success') {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  }

  function handleRowClick(user) {
    if (expandedUserId === user.user_id) {
      setExpandedUserId(null);
      setEditData({});
    } else {
      setExpandedUserId(user.user_id);
      setEditData({
        user_role: user.user_role || ROLES.USER,
        user_clan: user.user_clan || '',
      });
    }
  }

  async function handleSaveUser(userId) {
    setSaving(true);
    const { error } = await supabase
      .from('users')
      .update({
        user_role: editData.user_role,
        user_clan: editData.user_clan,
      })
      .eq('user_id', userId);

    if (error) {
      showMessage('Failed to update user: ' + error.message, 'error');
    } else {
      showMessage('User updated successfully.');
      setExpandedUserId(null);
      setEditData({});
      fetchUsers();
    }
    setSaving(false);
  }

  async function handleResetPassword(userEmail, userName) {
    if (!userEmail) {
      showMessage('No email address found for this user.', 'error');
      return;
    }
    setResettingPassword(userEmail);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: window.location.origin + '/armory',
      });
      if (error) throw error;
      showMessage(`Password reset email sent to ${userName || userEmail}.`);
    } catch (err) {
      showMessage('Failed to send reset email: ' + err.message, 'error');
    }
    setResettingPassword(null);
  }

  async function handleApproveRequest(request) {
    setActionLoading(request.user_request_id);
    try {
      // Sign up creates an auth user and sends a confirmation email
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: request.user_request_email,
        password: crypto.randomUUID(), // temporary password; user resets via email
      });

      if (authError) throw authError;

      const { error: userError } = await supabase.from('users').insert({
        user_id: authData.user.id,
        user_first_name: request.user_request_first_name,
        user_last_name: request.user_request_last_name,
        user_email: request.user_request_email,
        user_name: request.user_request_first_name + ' ' + request.user_request_last_name,
        user_role: ROLES.USER,
        user_start_date: new Date().toISOString().split('T')[0],
      });

      if (userError) throw userError;

      const { error: statusError } = await supabase
        .from('user_requests')
        .update({ user_request_status: 'Approved' })
        .eq('user_request_id', request.user_request_id);

      if (statusError) throw statusError;

      showMessage(`${request.user_request_first_name} ${request.user_request_last_name} has been approved.`);
      fetchRequests();
      fetchUsers();
    } catch (err) {
      showMessage('Failed to approve request: ' + err.message, 'error');
    }
    setActionLoading(null);
  }

  async function handleDenyRequest(request) {
    setActionLoading(request.user_request_id);
    const { error } = await supabase
      .from('user_requests')
      .update({ user_request_status: 'Denied' })
      .eq('user_request_id', request.user_request_id);

    if (error) {
      showMessage('Failed to deny request: ' + error.message, 'error');
    } else {
      showMessage(`Request from ${request.user_request_first_name} ${request.user_request_last_name} has been denied.`);
      fetchRequests();
    }
    setActionLoading(null);
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
            You do not have permission to access this page. Only Forge Keepers and Admins can manage users.
          </p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchTerm ||
      `${u.user_first_name} ${u.user_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.user_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.user_role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.heading}>Manage Users</h1>
          <p style={styles.subheading}>
            View, search, and manage all community members and pending access requests.
          </p>
        </div>

        {/* Message Toast */}
        {message && (
          <div style={{
            ...styles.toast,
            ...(message.type === 'error' ? styles.toastError : styles.toastSuccess),
          }}>
            {message.text}
          </div>
        )}

        {/* Pending Requests Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Pending Requests
            {requests.length > 0 && (
              <span style={styles.badge}>{requests.length}</span>
            )}
          </h2>

          {loadingRequests ? (
            <p style={styles.loadingText}>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p style={styles.emptyText}>No pending requests.</p>
          ) : (
            <div style={styles.requestsGrid}>
              {requests.map((req) => (
                <div key={req.user_request_id} style={styles.requestCard}>
                  <div style={styles.requestInfo}>
                    <p style={styles.requestName}>
                      {req.user_request_first_name} {req.user_request_last_name}
                    </p>
                    <p style={styles.requestDetail}>{req.user_request_email}</p>
                    {req.user_request_state && (
                      <p style={styles.requestDetail}>State: {req.user_request_state}</p>
                    )}
                    {req.user_request_invited_by && (
                      <p style={styles.requestDetail}>Invited by: {req.user_request_invited_by}</p>
                    )}
                  </div>
                  <div style={styles.requestActions}>
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleApproveRequest(req)}
                      disabled={actionLoading === req.user_request_id}
                    >
                      {actionLoading === req.user_request_id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      style={styles.denyBtn}
                      onClick={() => handleDenyRequest(req)}
                      disabled={actionLoading === req.user_request_id}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Users Table Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>All Users</h2>

          {/* Filters */}
          <div style={styles.filters}>
            <div style={styles.searchWrap}>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="All">All Roles</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {loadingUsers ? (
            <p style={styles.loadingText}>Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p style={styles.emptyText}>No users found matching your filters.</p>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Avatar</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Display Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Clan</th>
                    <th style={styles.th}>Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <UserRow
                      key={user.user_id}
                      user={user}
                      isExpanded={expandedUserId === user.user_id}
                      editData={editData}
                      setEditData={setEditData}
                      onRowClick={() => handleRowClick(user)}
                      onSave={() => handleSaveUser(user.user_id)}
                      saving={saving}
                      onResetPassword={() => handleResetPassword(user.user_email, `${user.user_first_name} ${user.user_last_name}`)}
                      resettingPassword={resettingPassword === user.user_email}
                    />
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

function getUserAvatarUrl(u) {
  if (u.user_photo_source === 'Photo' && u.user_photo_upload) return u.user_photo_upload;
  if (u.top) {
    return buildAvatarUrl({
      Background_or_Transparent: u.background_or_transparent || 'Circle',
      Top: u.top || 'ShortHairShortFlat',
      Accessories: u.accessories || 'Blank',
      HairColor: u.hair_color || 'Brown',
      FacialHair: u.facial_hair || 'Blank',
      FacialHairColor: u.facial_hair_color || 'Brown',
      ClotheColor: u.clothe_color || 'Black',
      Clothes: u.clothes || 'ShirtCrewNeck',
      Graphic: u.graphic || 'Bat',
      Eyes: u.eyes || 'Default',
      Eyebrow: u.eyebrow || 'Default',
      Mouth: u.mouth || 'Default',
      Skin_Color: u.skin_color || 'Light',
    });
  }
  return null;
}

function UserRow({ user, isExpanded, editData, setEditData, onRowClick, onSave, saving, onResetPassword, resettingPassword }) {
  const avatarSrc = getUserAvatarUrl(user);

  return (
    <>
      <tr
        style={{
          ...styles.tr,
          ...(isExpanded ? styles.trExpanded : {}),
          cursor: 'pointer',
        }}
        onClick={onRowClick}
      >
        <td style={styles.td}>
          {avatarSrc ? (
            <img src={avatarSrc} alt="" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {(user.user_first_name || '?')[0]}
            </div>
          )}
        </td>
        <td style={styles.td}>
          {user.user_first_name} {user.user_last_name}
        </td>
        <td style={styles.td}>{user.user_name || '--'}</td>
        <td style={styles.td}>{user.user_email || '--'}</td>
        <td style={styles.td}>
          <span style={{
            ...styles.roleBadge,
            background: getRoleBadgeColor(user.user_role),
          }}>
            {user.user_role || 'User'}
          </span>
        </td>
        <td style={styles.td}>{user.user_clan || '--'}</td>
        <td style={styles.td}>
          {user.user_start_date
            ? new Date(user.user_start_date).toLocaleDateString()
            : '--'}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7} style={styles.expandedCell}>
            <div style={styles.editPanel}>
              <h4 style={styles.editPanelTitle}>
                Edit {user.user_first_name} {user.user_last_name}
              </h4>
              <div style={styles.editFields}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Role</label>
                  <select
                    value={editData.user_role || ''}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, user_role: e.target.value }))
                    }
                    style={styles.editSelect}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Clan</label>
                  <input
                    type="text"
                    value={editData.user_clan || ''}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, user_clan: e.target.value }))
                    }
                    placeholder="Enter clan name"
                    style={styles.editInput}
                  />
                </div>
                <button
                  style={{
                    ...styles.saveBtn,
                    ...(saving ? styles.saveBtnDisabled : {}),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave();
                  }}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  style={{
                    ...styles.resetPasswordBtn,
                    ...(resettingPassword ? styles.saveBtnDisabled : {}),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onResetPassword();
                  }}
                  disabled={resettingPassword}
                >
                  {resettingPassword ? 'Sending...' : 'Reset Password'}
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function getRoleBadgeColor(role) {
  switch (role) {
    case ROLES.ADMIN:
      return 'rgba(220, 20, 60, 0.15)';
    case ROLES.FORGE_KEEPER:
      return 'rgba(168, 85, 247, 0.15)';
    case ROLES.EDGE_KEEPER:
      return 'rgba(59, 130, 246, 0.15)';
    default:
      return 'rgba(107, 114, 128, 0.12)';
  }
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg-alt)',
    padding: '32px 24px',
    fontFamily: 'var(--font-family)',
  },
  container: {
    maxWidth: '1200px',
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
    padding: '32px 0',
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

  /* Section */
  section: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
    padding: '28px',
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  badge: {
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

  /* Pending Requests */
  requestsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  requestCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: 'var(--color-bg-alt)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  requestInfo: {
    flex: 1,
    minWidth: '200px',
  },
  requestName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text)',
    margin: '0 0 4px 0',
  },
  requestDetail: {
    fontSize: '13px',
    color: 'var(--color-text-muted)',
    margin: '2px 0',
  },
  requestActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  approveBtn: {
    padding: '8px 18px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#16a34a',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  denyBtn: {
    padding: '8px 18px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#dc2626',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },

  /* Filters */
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchWrap: {
    flex: 1,
    minWidth: '220px',
  },
  searchInput: {
    width: '100%',
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
  filterSelect: {
    padding: '10px 14px',
    fontSize: '14px',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '150px',
  },

  /* Table */
  tableWrap: {
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
    fontWeight: '600',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid var(--color-border)',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid var(--color-border)',
    transition: 'background-color 0.15s',
  },
  trExpanded: {
    backgroundColor: 'rgba(220, 20, 60, 0.03)',
  },
  td: {
    padding: '12px 14px',
    color: 'var(--color-text)',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
  },

  /* Avatar */
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid var(--color-border)',
  },
  avatarPlaceholder: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
  },

  /* Role Badge */
  roleBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '999px',
    color: 'var(--color-text)',
  },

  /* Expanded Edit Panel */
  expandedCell: {
    padding: 0,
    borderBottom: '1px solid var(--color-border)',
  },
  editPanel: {
    padding: '20px 24px',
    backgroundColor: 'var(--color-bg-alt)',
    borderTop: '1px dashed var(--color-border)',
  },
  editPanelTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text)',
    marginBottom: '16px',
  },
  editFields: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '180px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
  },
  editSelect: {
    padding: '8px 12px',
    fontSize: '14px',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    cursor: 'pointer',
  },
  editInput: {
    padding: '8px 12px',
    fontSize: '14px',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    boxSizing: 'border-box',
  },
  saveBtn: {
    padding: '8px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: 'var(--color-primary)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    whiteSpace: 'nowrap',
    alignSelf: 'flex-end',
  },
  saveBtnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  resetPasswordBtn: {
    padding: '8px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: 'var(--color-warning)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    whiteSpace: 'nowrap',
    alignSelf: 'flex-end',
  },
};
