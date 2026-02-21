import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { BIBLE_BOOKS, getBibleUrl } from '../../lib/constants';

const FILTER_OPTIONS = ['All', 'Active', 'Complete'];

const EMPTY_FORM = {
  book: BIBLE_BOOKS[0],
  chapter: '',
  verse_start: '',
  verse_end: '',
  verse_text: '',
  tags: '',
  due_date: '',
};

export default function ScriptureMemoryPage() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('All');
  const [bookFilter, setBookFilter] = useState('All Books');
  const [sortBy, setSortBy] = useState('due_date');

  useEffect(() => {
    if (profile?.user_id) {
      fetchEntries();
    }
  }, [profile?.user_id]);

  async function fetchEntries() {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('scripture_memory')
        .select('*')
        .eq('scripture_user', profile.user_id);

      if (fetchError) throw fetchError;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching scripture entries:', err);
      setError('Failed to load scripture entries.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!formData.book || !formData.chapter || !formData.verse_start || !formData.verse_text) {
      setError('Please fill in Book, Chapter, Verse Start, and Verse Text.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const record = {
        scripture_user: profile.user_id,
        scripture_book: formData.book,
        scripture_chapter: parseInt(formData.chapter, 10),
        scripture_verse_start: parseInt(formData.verse_start, 10),
        scripture_verse_end: formData.verse_end ? parseInt(formData.verse_end, 10) : null,
        scripture_verse: formData.verse_text,
        scripture_tag: tagsArray,
        scripture_due_date: formData.due_date || null,
        scripture_hide_verse: false,
      };

      const { data, error: insertError } = await supabase
        .from('scripture_memory')
        .insert(record)
        .select()
        .single();

      if (insertError) throw insertError;

      setEntries((prev) => [...prev, data]);
      setFormData(EMPTY_FORM);
      setShowModal(false);
    } catch (err) {
      console.error('Error adding scripture entry:', err);
      setError('Failed to add scripture entry.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this scripture entry?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('scripture_memory')
        .delete()
        .eq('scripture_id', id);

      if (deleteError) throw deleteError;
      setEntries((prev) => prev.filter((entry) => entry.scripture_id !== id));
    } catch (err) {
      console.error('Error deleting scripture entry:', err);
      setError('Failed to delete scripture entry.');
    }
  }

  async function toggleHideVerse(entry) {
    const newValue = !entry.scripture_hide_verse;
    try {
      const { error: updateError } = await supabase
        .from('scripture_memory')
        .update({ scripture_hide_verse: newValue })
        .eq('scripture_id', entry.scripture_id);

      if (updateError) throw updateError;
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.scripture_id ? { ...e, scripture_hide_verse: newValue } : e))
      );
    } catch (err) {
      console.error('Error toggling verse visibility:', err);
      setError('Failed to update verse visibility.');
    }
  }

  function getDueStatus(dueDate) {
    if (!dueDate) return 'none';
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + 'T00:00:00');
    if (due < now) return 'overdue';
    const threeDaysOut = new Date(now);
    threeDaysOut.setDate(threeDaysOut.getDate() + 3);
    if (due <= threeDaysOut) return 'upcoming';
    return 'future';
  }

  function isComplete(dueDate) {
    if (!dueDate) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + 'T00:00:00');
    return due < now;
  }

  function formatDueDate(dateStr) {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const booksInUse = useMemo(() => {
    const books = new Set(entries.map((e) => e.scripture_book));
    return ['All Books', ...Array.from(books).sort()];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = [...entries];

    if (filter === 'Active') {
      result = result.filter((e) => !isComplete(e.scripture_due_date));
    } else if (filter === 'Complete') {
      result = result.filter((e) => isComplete(e.scripture_due_date));
    }

    if (bookFilter !== 'All Books') {
      result = result.filter((e) => e.scripture_book === bookFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'due_date') {
        if (!a.scripture_due_date && !b.scripture_due_date) return 0;
        if (!a.scripture_due_date) return 1;
        if (!b.scripture_due_date) return -1;
        return new Date(a.scripture_due_date) - new Date(b.scripture_due_date);
      }
      if (sortBy === 'book') {
        const bookCompare = (a.scripture_book || '').localeCompare(b.scripture_book || '');
        if (bookCompare !== 0) return bookCompare;
        return (a.scripture_chapter || 0) - (b.scripture_chapter || 0);
      }
      return 0;
    });

    return result;
  }, [entries, filter, bookFilter, sortBy]);

  function getReference(entry) {
    const { scripture_book, scripture_chapter, scripture_verse_start, scripture_verse_end } = entry;
    const verseRange = scripture_verse_end
      ? `${scripture_verse_start}-${scripture_verse_end}`
      : `${scripture_verse_start}`;
    return `${scripture_book} ${scripture_chapter}:${verseRange}`;
  }

  function handleFormChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const dueStatusColors = {
    overdue: '#ef4444',
    upcoming: '#f59e0b',
    future: 'var(--color-text-muted)',
    none: 'var(--color-text-muted)',
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading scripture entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Scripture Memory</h1>
            <p style={styles.subtitle}>
              {entries.length} {entries.length === 1 ? 'verse' : 'verses'} in your collection
            </p>
          </div>
          <button style={styles.addButton} onClick={() => setShowModal(true)}>
            + Add Scripture
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div style={styles.errorBox} role="alert">
            {error}
            <button
              style={styles.errorDismiss}
              onClick={() => setError('')}
              aria-label="Dismiss error"
            >
              x
            </button>
          </div>
        )}

        {/* Filters */}
        <div style={styles.filterBar}>
          <div style={styles.filterGroup}>
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option}
                style={{
                  ...styles.filterChip,
                  ...(filter === option ? styles.filterChipActive : {}),
                }}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div style={styles.filterRight}>
            <select
              style={styles.select}
              value={bookFilter}
              onChange={(e) => setBookFilter(e.target.value)}
            >
              {booksInUse.map((book) => (
                <option key={book} value={book}>
                  {book}
                </option>
              ))}
            </select>

            <select
              style={styles.select}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="due_date">Sort by Due Date</option>
              <option value="book">Sort by Book</option>
            </select>
          </div>
        </div>

        {/* Card Grid */}
        {filteredEntries.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              {entries.length === 0
                ? 'No scripture entries yet. Add your first verse to get started.'
                : 'No entries match the current filters.'}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredEntries.map((entry) => {
              const dueStatus = getDueStatus(entry.scripture_due_date);
              const complete = isComplete(entry.scripture_due_date);
              const bibleUrl = getBibleUrl(
                entry.scripture_book,
                entry.scripture_chapter,
                entry.scripture_verse_start,
                entry.scripture_verse_end
              );

              return (
                <div key={entry.scripture_id} style={styles.card}>
                  {/* Card Header */}
                  <div style={styles.cardHeader}>
                    <div style={styles.cardTitleRow}>
                      {bibleUrl ? (
                        <a
                          href={bibleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.referenceLink}
                        >
                          {getReference(entry)}
                        </a>
                      ) : (
                        <span style={styles.reference}>{getReference(entry)}</span>
                      )}
                      {complete && <span style={styles.completeBadge}>Verse Complete</span>}
                    </div>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(entry.scripture_id)}
                      aria-label={`Delete ${getReference(entry)}`}
                      title="Delete entry"
                    >
                      x
                    </button>
                  </div>

                  {/* Verse Text */}
                  <div style={styles.verseSection}>
                    {entry.scripture_hide_verse ? (
                      <p style={styles.hiddenVerse}>Verse hidden for practice</p>
                    ) : (
                      <p style={styles.verseText}>{entry.scripture_verse}</p>
                    )}
                    <button
                      style={styles.toggleButton}
                      onClick={() => toggleHideVerse(entry)}
                    >
                      {entry.scripture_hide_verse ? 'Show Verse' : 'Hide Verse'}
                    </button>
                  </div>

                  {/* Tags */}
                  {entry.scripture_tag && entry.scripture_tag.length > 0 && (
                    <div style={styles.tagsRow}>
                      {entry.scripture_tag.map((tag, idx) => (
                        <span key={idx} style={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Due Date */}
                  <div style={styles.cardFooter}>
                    <span
                      style={{
                        ...styles.dueDate,
                        color: dueStatusColors[dueStatus],
                      }}
                    >
                      {entry.scripture_due_date
                        ? `Due: ${formatDueDate(entry.scripture_due_date)}`
                        : 'No due date'}
                    </span>
                    {dueStatus === 'overdue' && !complete && (
                      <span style={styles.overdueBadge}>Overdue</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add Scripture</h2>
              <button
                style={styles.modalClose}
                onClick={() => {
                  setShowModal(false);
                  setFormData(EMPTY_FORM);
                  setError('');
                }}
                aria-label="Close modal"
              >
                x
              </button>
            </div>

            <form onSubmit={handleAdd} style={styles.form}>
              {/* Book */}
              <div style={styles.fieldGroup}>
                <label htmlFor="scripture-book" style={styles.label}>
                  Book
                </label>
                <select
                  id="scripture-book"
                  style={styles.input}
                  value={formData.book}
                  onChange={(e) => handleFormChange('book', e.target.value)}
                  required
                >
                  {BIBLE_BOOKS.map((book) => (
                    <option key={book} value={book}>
                      {book}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter / Verse Row */}
              <div style={styles.formRow}>
                <div style={styles.fieldGroup}>
                  <label htmlFor="scripture-chapter" style={styles.label}>
                    Chapter
                  </label>
                  <input
                    id="scripture-chapter"
                    type="number"
                    min="1"
                    style={styles.input}
                    value={formData.chapter}
                    onChange={(e) => handleFormChange('chapter', e.target.value)}
                    placeholder="e.g. 8"
                    required
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <label htmlFor="scripture-verse-start" style={styles.label}>
                    Verse Start
                  </label>
                  <input
                    id="scripture-verse-start"
                    type="number"
                    min="1"
                    style={styles.input}
                    value={formData.verse_start}
                    onChange={(e) => handleFormChange('verse_start', e.target.value)}
                    placeholder="e.g. 28"
                    required
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <label htmlFor="scripture-verse-end" style={styles.label}>
                    Verse End
                  </label>
                  <input
                    id="scripture-verse-end"
                    type="number"
                    min="1"
                    style={styles.input}
                    value={formData.verse_end}
                    onChange={(e) => handleFormChange('verse_end', e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Verse Text */}
              <div style={styles.fieldGroup}>
                <label htmlFor="scripture-text" style={styles.label}>
                  Verse Text
                </label>
                <textarea
                  id="scripture-text"
                  style={styles.textarea}
                  value={formData.verse_text}
                  onChange={(e) => handleFormChange('verse_text', e.target.value)}
                  placeholder="Enter the scripture text..."
                  rows={4}
                  required
                />
              </div>

              {/* Tags */}
              <div style={styles.fieldGroup}>
                <label htmlFor="scripture-tags" style={styles.label}>
                  Tags (comma-separated)
                </label>
                <input
                  id="scripture-tags"
                  type="text"
                  style={styles.input}
                  value={formData.tags}
                  onChange={(e) => handleFormChange('tags', e.target.value)}
                  placeholder="e.g. faith, hope, salvation"
                />
              </div>

              {/* Due Date */}
              <div style={styles.fieldGroup}>
                <label htmlFor="scripture-due" style={styles.label}>
                  Due Date
                </label>
                <input
                  id="scripture-due"
                  type="date"
                  style={styles.input}
                  value={formData.due_date}
                  onChange={(e) => handleFormChange('due_date', e.target.value)}
                />
              </div>

              {/* Actions */}
              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => {
                    setShowModal(false);
                    setFormData(EMPTY_FORM);
                    setError('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.submitButton,
                    ...(submitting ? styles.submitButtonDisabled : {}),
                  }}
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Scripture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
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
  addButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'var(--color-primary)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    whiteSpace: 'nowrap',
  },

  /* Error */
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    fontSize: '14px',
    color: 'var(--color-error)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '16px',
    lineHeight: '1.4',
  },
  errorDismiss: {
    background: 'none',
    border: 'none',
    color: 'var(--color-error)',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '0 4px',
    lineHeight: '1',
    flexShrink: 0,
    marginLeft: '12px',
  },

  /* Filters */
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
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
    backgroundColor: 'var(--color-bg)',
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
  filterRight: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  select: {
    padding: '8px 12px',
    fontSize: '13px',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    outline: 'none',
  },

  /* Grid */
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px',
  },

  /* Card */
  card: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    transition: 'box-shadow 0.2s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  referenceLink: {
    fontSize: '17px',
    fontWeight: '700',
    color: 'var(--color-primary)',
    textDecoration: 'none',
  },
  reference: {
    fontSize: '17px',
    fontWeight: '700',
    color: 'var(--color-text)',
  },
  completeBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'var(--color-success)',
    borderRadius: '12px',
    lineHeight: '1.6',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '2px 6px',
    lineHeight: '1',
    borderRadius: 'var(--radius-sm)',
    transition: 'color 0.2s ease',
    flexShrink: 0,
  },

  /* Verse */
  verseSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  verseText: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: 'var(--color-text-secondary)',
    margin: 0,
    fontStyle: 'italic',
  },
  hiddenVerse: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: 'var(--color-text-muted)',
    margin: 0,
    fontStyle: 'italic',
    padding: '16px 0',
    textAlign: 'center',
    backgroundColor: 'var(--color-bg-alt)',
    borderRadius: 'var(--radius-sm)',
  },
  toggleButton: {
    alignSelf: 'flex-start',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-bg-alt)',
    border: '1px solid var(--color-border)',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  /* Tags */
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tag: {
    display: 'inline-block',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: '500',
    color: 'var(--color-primary)',
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderRadius: '12px',
    lineHeight: '1.5',
  },

  /* Footer */
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '10px',
    borderTop: '1px solid var(--color-border)',
    marginTop: 'auto',
  },
  dueDate: {
    fontSize: '13px',
    fontWeight: '500',
  },
  overdueBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'var(--color-error)',
    borderRadius: '10px',
    lineHeight: '1.5',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
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

  /* Modal */
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '24px',
  },
  modal: {
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: '28px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--color-text)',
    margin: 0,
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    padding: '4px 8px',
    lineHeight: '1',
    borderRadius: 'var(--radius-sm)',
  },

  /* Form */
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '12px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'var(--font-family)',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '4px',
  },
  cancelButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'var(--color-primary)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, opacity 0.2s ease',
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
};
