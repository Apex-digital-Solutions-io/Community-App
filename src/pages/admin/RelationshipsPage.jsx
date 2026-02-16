import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Users, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const styles = {
  page: { padding: 24, maxWidth: 900, margin: '0 auto' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 },
  subtitle: { color: 'var(--color-text-secondary)', marginBottom: 32 },
  denied: { textAlign: 'center', padding: 60, color: 'var(--color-error)', fontWeight: 600 },
  addCard: { background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 24, marginBottom: 32, boxShadow: 'var(--shadow-sm)' },
  addTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  formRow: { display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' },
  fieldGroup: { flex: 1, minWidth: 200 },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' },
  select: { width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.95rem', background: '#fff' },
  input: { width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.95rem' },
  addBtn: { padding: '8px 20px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  error: { color: 'var(--color-error)', marginBottom: 12, fontSize: '0.9rem' },
  mentorGroup: { marginBottom: 24 },
  mentorHeader: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 700, fontSize: '1.05rem' },
  mentorRole: { fontSize: '0.8rem', fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: '#ede9fe', color: '#7c3aed' },
  discipleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 10px 40px', borderBottom: '1px solid var(--color-border)' },
  discipleName: { fontWeight: 600 },
  discipleRole: { fontSize: '0.8rem', color: 'var(--color-text-secondary)' },
  discipleDate: { fontSize: '0.85rem', color: 'var(--color-text-secondary)' },
  removeBtn: { padding: '4px 8px', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' },
  empty: { textAlign: 'center', padding: 40, color: 'var(--color-text-secondary)' },
  loading: { textAlign: 'center', padding: 60, color: 'var(--color-text-secondary)' },
};

export default function RelationshipsPage() {
  const { profile, isForgeKeeper } = useAuth();
  const [relationships, setRelationships] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedMentors, setExpandedMentors] = useState({});

  const [newMentorId, setNewMentorId] = useState('');
  const [newDiscipleId, setNewDiscipleId] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!profile || !isForgeKeeper) return;
    fetchData();
  }, [profile, isForgeKeeper]);

  async function fetchData() {
    setLoading(true);
    const [relsRes, usersRes] = await Promise.all([
      supabase.from('relationships').select(`
        *,
        mentor:users!mentor_id(user_id, user_first_name, user_last_name, user_name, user_role),
        disciple:users!disciple_id(user_id, user_first_name, user_last_name, user_name, user_role)
      `).order('date_of_relationship', { ascending: false }),
      supabase.from('users').select('user_id, user_first_name, user_last_name, user_name, user_role').order('user_first_name'),
    ]);

    setRelationships(relsRes.data || []);
    setAllUsers(usersRes.data || []);
    const expanded = {};
    (relsRes.data || []).forEach(r => { expanded[r.mentor_id] = true; });
    setExpandedMentors(expanded);
    setLoading(false);
  }

  if (!isForgeKeeper) {
    return <div style={styles.denied}>Access Denied — Forge Keeper or Admin role required.</div>;
  }

  const grouped = {};
  relationships.forEach(rel => {
    const mid = rel.mentor_id;
    if (!grouped[mid]) {
      grouped[mid] = { mentor: rel.mentor, disciples: [] };
    }
    grouped[mid].disciples.push({ ...rel, disciple: rel.disciple });
  });

  const mentors = allUsers.filter(u => u.user_role === 'Edge Keeper' || u.user_role === 'Forge Keeper' || u.user_role === 'Admin');

  async function handleAdd() {
    setError('');
    if (!newMentorId || !newDiscipleId) {
      setError('Please select both a mentor and a disciple.');
      return;
    }
    if (newMentorId === newDiscipleId) {
      setError('Mentor and disciple cannot be the same person.');
      return;
    }

    const { error: insertError } = await supabase.from('relationships').insert({
      mentor_id: newMentorId,
      disciple_id: newDiscipleId,
      date_of_relationship: newDate,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setNewMentorId('');
      setNewDiscipleId('');
      fetchData();
    }
  }

  async function handleRemove(relationshipId) {
    const { error: deleteError } = await supabase.from('relationships').delete().eq('relationship_id', relationshipId);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      fetchData();
    }
  }

  function toggleMentor(mentorId) {
    setExpandedMentors(prev => ({ ...prev, [mentorId]: !prev[mentorId] }));
  }

  if (loading) return <div style={styles.loading}>Loading relationships...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Mentor-Disciple Relationships</h1>
      <p style={styles.subtitle}>Manage who mentors whom in the discipleship pipeline.</p>

      <div style={styles.addCard}>
        <div style={styles.addTitle}>
          <Plus size={18} color="var(--color-primary)" />
          Add New Relationship
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.formRow}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Mentor (Edge Keeper+)</label>
            <select style={styles.select} value={newMentorId} onChange={e => setNewMentorId(e.target.value)}>
              <option value="">Select mentor...</option>
              {mentors.map(u => (
                <option key={u.user_id} value={u.user_id}>
                  {u.user_first_name} {u.user_last_name} ({u.user_role})
                </option>
              ))}
            </select>
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Disciple</label>
            <select style={styles.select} value={newDiscipleId} onChange={e => setNewDiscipleId(e.target.value)}>
              <option value="">Select disciple...</option>
              {allUsers.map(u => (
                <option key={u.user_id} value={u.user_id}>
                  {u.user_first_name} {u.user_last_name} ({u.user_role})
                </option>
              ))}
            </select>
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Start Date</label>
            <input type="date" style={styles.input} value={newDate} onChange={e => setNewDate(e.target.value)} />
          </div>
          <button style={styles.addBtn} onClick={handleAdd}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div style={styles.empty}>No relationships found. Add one above to get started.</div>
      ) : (
        Object.entries(grouped).map(([mentorId, group]) => (
          <div key={mentorId} style={styles.mentorGroup}>
            <div style={styles.mentorHeader} onClick={() => toggleMentor(mentorId)}>
              {expandedMentors[mentorId] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <Users size={18} color="var(--color-primary)" />
              {group.mentor.user_first_name} {group.mentor.user_last_name}
              <span style={styles.mentorRole}>{group.mentor.user_role}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                ({group.disciples.length} disciple{group.disciples.length !== 1 ? 's' : ''})
              </span>
            </div>
            {expandedMentors[mentorId] && group.disciples.map(rel => (
              <div key={rel.relationship_id} style={styles.discipleRow}>
                <div>
                  <span style={styles.discipleName}>{rel.disciple.user_first_name} {rel.disciple.user_last_name}</span>
                  <span style={styles.discipleRole}> — {rel.disciple.user_role}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={styles.discipleDate}>Since {rel.date_of_relationship}</span>
                  <button style={styles.removeBtn} onClick={() => handleRemove(rel.relationship_id)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
