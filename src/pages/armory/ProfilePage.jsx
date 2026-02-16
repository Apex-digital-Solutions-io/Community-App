import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { AVATAR_OPTIONS, buildAvatarUrl } from '../../lib/constants';

const AVATAR_FIELD_LABELS = {
  Skin_Color: 'Skin Color',
  Top: 'Hair / Head',
  HairColor: 'Hair Color',
  Accessories: 'Accessories',
  FacialHair: 'Facial Hair',
  FacialHairColor: 'Facial Hair Color',
  Clothes: 'Clothes',
  ClotheColor: 'Clothes Color',
  Graphic: 'Graphic',
  Eyes: 'Eyes',
  Eyebrow: 'Eyebrow',
  Mouth: 'Mouth',
  Background_or_Transparent: 'Background',
};

const AVATAR_FIELDS = Object.keys(AVATAR_OPTIONS);

function getDefaultAvatarState() {
  const state = {};
  for (const field of AVATAR_FIELDS) {
    state[field] = AVATAR_OPTIONS[field][0];
  }
  return state;
}

export default function ProfilePage() {
  const { profile, user, refreshProfile } = useAuth();

  const [photoSource, setPhotoSource] = useState('Avatar');
  const [avatarOptions, setAvatarOptions] = useState(getDefaultAvatarState);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [state, setState] = useState('');
  const [clan, setClan] = useState('');
  const [faithDate, setFaithDate] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!profile) return;

    setPhotoSource(profile.User_Photo_Source || 'Avatar');
    setFirstName(profile.first_name || '');
    setLastName(profile.last_name || '');
    setDisplayName(profile.User_Name || '');
    setNotificationEmail(profile.notification_email || '');
    setState(profile.state || '');
    setClan(profile.clan || '');
    setFaithDate(profile.faith_profession_date || '');

    const avatarState = {};
    for (const field of AVATAR_FIELDS) {
      avatarState[field] = profile[field] || AVATAR_OPTIONS[field][0];
    }
    setAvatarOptions(avatarState);

    if (profile.User_Photo_Source === 'Photo' && profile.photo_url) {
      setPhotoPreviewUrl(profile.photo_url);
    }
  }, [profile]);

  function handleAvatarChange(field, value) {
    setAvatarOptions((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhotoFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreviewUrl(objectUrl);
  }

  function getGravatarUrl(email) {
    if (!email) return '';
    const trimmed = email.trim().toLowerCase();
    return `https://www.gravatar.com/avatar/${trimmed}?s=200&d=identicon`;
  }

  function getCurrentPhotoUrl() {
    if (photoSource === 'Avatar') {
      return buildAvatarUrl(avatarOptions);
    }
    if (photoSource === 'Gravatar') {
      return getGravatarUrl(user?.email);
    }
    if (photoSource === 'Photo') {
      return photoPreviewUrl || '';
    }
    return '';
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      let uploadedPhotoUrl = profile?.photo_url || '';

      if (photoSource === 'Photo' && photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const filePath = `${user.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, photoFile, { upsert: true });

        if (uploadError) {
          throw new Error(`Photo upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        uploadedPhotoUrl = urlData.publicUrl;
      }

      const updateData = {
        User_Photo_Source: photoSource,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        User_Name: displayName.trim(),
        notification_email: notificationEmail.trim(),
        state: state.trim(),
        clan: clan.trim(),
        faith_profession_date: faithDate || null,
      };

      for (const field of AVATAR_FIELDS) {
        updateData[field] = avatarOptions[field];
      }

      if (photoSource === 'Photo') {
        updateData.photo_url = uploadedPhotoUrl;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error(`Profile update failed: ${updateError.message}`);
      }

      await refreshProfile();
      setSuccessMessage('Profile saved successfully.');
      setPhotoFile(null);
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  }

  const avatarPreviewUrl = buildAvatarUrl(avatarOptions);
  const currentPhotoUrl = getCurrentPhotoUrl();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.pageHeading}>My Profile</h1>

        <form onSubmit={handleSave}>
          {/* Profile Photo Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Profile Photo</h2>

            <div style={styles.photoArea}>
              {currentPhotoUrl && (
                <img
                  src={currentPhotoUrl}
                  alt="Profile"
                  style={styles.profileImage}
                />
              )}
              {!currentPhotoUrl && photoSource === 'Photo' && (
                <div style={styles.photoPlaceholder}>No photo uploaded</div>
              )}
            </div>

            <div style={styles.radioGroup}>
              {['Avatar', 'Gravatar', 'Photo'].map((source) => (
                <label key={source} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="photoSource"
                    value={source}
                    checked={photoSource === source}
                    onChange={(e) => setPhotoSource(e.target.value)}
                    style={styles.radioInput}
                  />
                  {source}
                </label>
              ))}
            </div>
          </div>

          {/* Avatar Builder */}
          {photoSource === 'Avatar' && (
            <div style={styles.section}>
              <h2 style={styles.sectionHeading}>Avatar Builder</h2>

              <div style={styles.avatarBuilderLayout}>
                <div style={styles.avatarPreviewContainer}>
                  <img
                    src={avatarPreviewUrl}
                    alt="Avatar preview"
                    style={styles.avatarPreview}
                  />
                </div>

                <div style={styles.avatarFieldsGrid}>
                  {AVATAR_FIELDS.map((field) => (
                    <div key={field} style={styles.fieldGroup}>
                      <label
                        htmlFor={`avatar-${field}`}
                        style={styles.label}
                      >
                        {AVATAR_FIELD_LABELS[field]}
                      </label>
                      <select
                        id={`avatar-${field}`}
                        value={avatarOptions[field]}
                        onChange={(e) => handleAvatarChange(field, e.target.value)}
                        style={styles.select}
                      >
                        {AVATAR_OPTIONS[field].map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Photo Upload */}
          {photoSource === 'Photo' && (
            <div style={styles.section}>
              <h2 style={styles.sectionHeading}>Upload Photo</h2>
              <div style={styles.fieldGroup}>
                <label htmlFor="photo-upload" style={styles.label}>
                  Choose an image file
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  style={styles.fileInput}
                />
              </div>
            </div>
          )}

          {/* Profile Fields */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Personal Information</h2>

            <div style={styles.formGrid}>
              <div style={styles.fieldGroup}>
                <label htmlFor="profile-firstName" style={styles.label}>
                  First Name
                </label>
                <input
                  id="profile-firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="profile-lastName" style={styles.label}>
                  Last Name
                </label>
                <input
                  id="profile-lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="profile-displayName" style={styles.label}>
                  Display Name
                </label>
                <input
                  id="profile-displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display name"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="profile-loginEmail" style={styles.label}>
                  Login Email
                </label>
                <input
                  id="profile-loginEmail"
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  style={{ ...styles.input, ...styles.inputReadOnly }}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="profile-notifEmail" style={styles.label}>
                  Notification Email
                </label>
                <input
                  id="profile-notifEmail"
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  placeholder="Notification email"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="profile-state" style={styles.label}>
                  State
                </label>
                <input
                  id="profile-state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Texas"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="profile-clan" style={styles.label}>
                  Clan
                </label>
                <input
                  id="profile-clan"
                  type="text"
                  value={clan}
                  onChange={(e) => setClan(e.target.value)}
                  placeholder="Clan name"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="profile-faithDate" style={styles.label}>
                  Faith Profession Date
                </label>
                <input
                  id="profile-faithDate"
                  type="date"
                  value={faithDate}
                  onChange={(e) => setFaithDate(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Messages */}
          {successMessage && (
            <div style={styles.successBox} role="status">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div style={styles.errorBox} role="alert">
              {errorMessage}
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            style={{
              ...styles.saveButton,
              ...(saving ? styles.saveButtonDisabled : {}),
            }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
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
  pageHeading: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '28px',
  },
  section: {
    backgroundColor: 'var(--color-bg)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
    padding: '28px',
    marginBottom: '24px',
  },
  sectionHeading: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text)',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--color-border)',
  },
  photoArea: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-alt)',
  },
  photoPlaceholder: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-alt)',
    border: '2px dashed var(--color-border)',
    color: 'var(--color-text-muted)',
    fontSize: '13px',
    textAlign: 'center',
  },
  radioGroup: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text)',
    cursor: 'pointer',
  },
  radioInput: {
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
  },
  avatarBuilderLayout: {
    display: 'flex',
    gap: '28px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  avatarPreviewContainer: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  avatarPreview: {
    width: '200px',
    height: '200px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-alt)',
  },
  avatarFieldsGrid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '14px',
    minWidth: '0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '18px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '15px',
    lineHeight: '1.5',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  },
  inputReadOnly: {
    backgroundColor: 'var(--color-bg-alt)',
    color: 'var(--color-text-muted)',
    cursor: 'not-allowed',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  fileInput: {
    fontSize: '14px',
    color: 'var(--color-text)',
    padding: '8px 0',
  },
  saveButton: {
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'var(--color-primary)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, opacity 0.2s ease',
  },
  saveButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  successBox: {
    padding: '12px 14px',
    fontSize: '14px',
    color: 'var(--color-success)',
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: 'var(--radius-sm)',
    lineHeight: '1.4',
    marginBottom: '20px',
    textAlign: 'center',
  },
  errorBox: {
    padding: '12px 14px',
    fontSize: '14px',
    color: 'var(--color-error)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 'var(--radius-sm)',
    lineHeight: '1.4',
    marginBottom: '20px',
    textAlign: 'center',
  },
};
