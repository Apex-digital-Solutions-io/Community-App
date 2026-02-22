import { useState, useEffect, useCallback, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { buildAvatarUrl } from '../../lib/constants';

/* ------------------------------------------------------------------ */
/*  Helper: build avatar src from a user row's avatar fields           */
/* ------------------------------------------------------------------ */
function avatarSrc(u) {
  if (!u) return null;
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

function displayName(u) {
  if (!u) return 'Unknown';
  if (u.user_first_name && u.user_last_name) return `${u.user_first_name} ${u.user_last_name}`;
  if (u.user_name) return u.user_name;
  return 'Unknown';
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */
export default function DisciplineDenPage() {
  const { user, profile, isAdmin } = useAuth();

  /* ---- posts state ---- */
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  /* ---- create-post form state ---- */
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [link, setLink] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  /* ---- per-post expanded comments + likes cache ---- */
  const [expandedComments, setExpandedComments] = useState({});   // postId -> bool
  const [commentsMap, setCommentsMap] = useState({});              // postId -> []
  const [likesMap, setLikesMap] = useState({});                    // postId -> []
  const [commentLikesMap, setCommentLikesMap] = useState({});      // commentId -> []
  const [commentText, setCommentText] = useState({});              // postId -> string
  const [loadingComments, setLoadingComments] = useState({});      // postId -> bool

  /* ================================================================ */
  /*  Data fetching                                                    */
  /* ================================================================ */
  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from('discipline_den')
      .select(
        '*, users!discipline_den_user(user_id, user_name, user_first_name, user_last_name, user_photo_source, user_photo_upload, skin_color, top, hair_color, accessories, facial_hair, facial_hair_color, clothes, clothe_color, graphic, eyes, eyebrow, mouth, background_or_transparent)'
      )
      .order('discipline_den_date_created', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
      // Pre-fetch likes for all returned posts
      const ids = (data || []).map((p) => p.discipline_den_id);
      if (ids.length) {
        const { data: allLikes } = await supabase
          .from('discipline_den_likes')
          .select('*')
          .in('discipline_den_post_ref', ids);
        if (allLikes) {
          const grouped = {};
          allLikes.forEach((l) => {
            const key = l.discipline_den_post_ref;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(l);
          });
          setLikesMap((prev) => ({ ...prev, ...grouped }));
          // Also ensure posts without likes have an empty array
          ids.forEach((id) => {
            if (!grouped[id]) grouped[id] = [];
          });
          setLikesMap((prev) => ({ ...prev, ...grouped }));
        }
      }
    }
    setLoadingPosts(false);
  }, []);

  const fetchComments = useCallback(async (postId) => {
    setLoadingComments((prev) => ({ ...prev, [postId]: true }));
    const { data, error } = await supabase
      .from('discipline_den_comments')
      .select(
        '*, users!discipline_den_comment_user_id(user_id, user_name, user_first_name, user_last_name)'
      )
      .eq('discipline_den_comment_parent_ref', postId)
      .order('discipline_den_comment_date', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setCommentsMap((prev) => ({ ...prev, [postId]: data || [] }));
      // Fetch likes for each comment
      const commentIds = (data || []).map((c) => c.discipline_den_comment_id);
      if (commentIds.length) {
        const { data: cLikes } = await supabase
          .from('discipline_den_likes')
          .select('*')
          .in('discipline_den_likes_comment_parent_ref', commentIds);
        if (cLikes) {
          const grouped = {};
          cLikes.forEach((l) => {
            const key = l.discipline_den_likes_comment_parent_ref;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(l);
          });
          setCommentLikesMap((prev) => ({ ...prev, ...grouped }));
        }
      }
    }
    setLoadingComments((prev) => ({ ...prev, [postId]: false }));
  }, []);

  const fetchLikesForPost = useCallback(async (postId) => {
    const { data } = await supabase
      .from('discipline_den_likes')
      .select('*')
      .eq('discipline_den_post_ref', postId);
    setLikesMap((prev) => ({ ...prev, [postId]: data || [] }));
  }, []);

  /* ================================================================ */
  /*  Initial load + realtime subscriptions                            */
  /* ================================================================ */
  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('discipline-den')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'discipline_den' }, () => {
        fetchPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'discipline_den_comments' }, (payload) => {
        const parentRef =
          payload.new?.discipline_den_comment_parent_ref ||
          payload.old?.discipline_den_comment_parent_ref;
        if (parentRef) {
          fetchComments(parentRef);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'discipline_den_likes' }, (payload) => {
        const postRef =
          payload.new?.discipline_den_post_ref || payload.old?.discipline_den_post_ref;
        const commentRef =
          payload.new?.discipline_den_likes_comment_parent_ref || payload.old?.discipline_den_likes_comment_parent_ref;
        if (postRef) {
          fetchLikesForPost(postRef);
        }
        if (commentRef) {
          // Re-fetch comment likes
          supabase
            .from('discipline_den_likes')
            .select('*')
            .eq('discipline_den_likes_comment_parent_ref', commentRef)
            .then(({ data }) => {
              setCommentLikesMap((prev) => ({ ...prev, [commentRef]: data || [] }));
            });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts, fetchComments, fetchLikesForPost]);

  /* ================================================================ */
  /*  Create post                                                      */
  /* ================================================================ */
  async function handleCreatePost(e) {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() && !caption.trim()) {
      setFormError('Please provide at least a title or caption.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    let imageUrl = null;

    // Upload image if provided
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('discipline-den-media')
        .upload(filePath, imageFile, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setFormError('Failed to upload image. Please try again.');
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('discipline-den-media')
        .getPublicUrl(filePath);
      imageUrl = urlData?.publicUrl || null;
    }

    const { error } = await supabase.from('discipline_den').insert({
      discipline_den_user: user.id,
      discipline_den_title: title.trim() || null,
      discipline_den_caption: caption.trim() || null,
      discipline_den_link: link.trim() || null,
      discipline_den_img: imageUrl,
      discipline_den_date_created: new Date().toISOString(),
    });

    if (error) {
      console.error('Error creating post:', error);
      setFormError('Failed to create post. Please try again.');
    } else {
      setTitle('');
      setCaption('');
      setLink('');
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    setSubmitting(false);
  }

  /* ================================================================ */
  /*  Like / unlike a post                                             */
  /* ================================================================ */
  async function handleTogglePostLike(postId) {
    if (!user) return;
    const postLikes = likesMap[postId] || [];
    const existing = postLikes.find(
      (l) => l.discipline_den_comment_user_id === user.id && !l.discipline_den_likes_comment_parent_ref
    );

    if (existing) {
      await supabase.from('discipline_den_likes').delete().eq('discipline_den_likes_id', existing.discipline_den_likes_id);
    } else {
      await supabase.from('discipline_den_likes').insert({
        discipline_den_post_ref: postId,
        discipline_den_comment_user_id: user.id,
      });
    }
    fetchLikesForPost(postId);
  }

  /* ================================================================ */
  /*  Like / unlike a comment                                          */
  /* ================================================================ */
  async function handleToggleCommentLike(commentId, postId) {
    if (!user) return;
    const cLikes = commentLikesMap[commentId] || [];
    const existing = cLikes.find((l) => l.discipline_den_comment_user_id === user.id);

    if (existing) {
      await supabase.from('discipline_den_likes').delete().eq('discipline_den_likes_id', existing.discipline_den_likes_id);
    } else {
      await supabase.from('discipline_den_likes').insert({
        discipline_den_likes_comment_parent_ref: commentId,
        discipline_den_post_ref: postId,
        discipline_den_comment_user_id: user.id,
      });
    }
    // Re-fetch comment likes
    const { data } = await supabase
      .from('discipline_den_likes')
      .select('*')
      .eq('discipline_den_likes_comment_parent_ref', commentId);
    setCommentLikesMap((prev) => ({ ...prev, [commentId]: data || [] }));
  }

  /* ================================================================ */
  /*  Add comment                                                      */
  /* ================================================================ */
  async function handleAddComment(postId) {
    if (!user) return;
    const text = (commentText[postId] || '').trim();
    if (!text) return;

    const { error } = await supabase.from('discipline_den_comments').insert({
      discipline_den_comment_parent_ref: postId,
      discipline_den_comment_user_id: user.id,
      discipline_den_comment_text: text,
    });

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setCommentText((prev) => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    }
  }

  /* ================================================================ */
  /*  Toggle comments visibility                                       */
  /* ================================================================ */
  function toggleComments(postId) {
    const isExpanded = expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: !isExpanded }));
    if (!isExpanded && !commentsMap[postId]) {
      fetchComments(postId);
    }
  }

  /* ================================================================ */
  /*  Delete post                                                      */
  /* ================================================================ */
  async function handleDeletePost(postId) {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    const { error } = await supabase
      .from('discipline_den')
      .delete()
      .eq('discipline_den_id', postId);

    if (error) {
      console.error('Error deleting post:', error);
    } else {
      setPosts((prev) => prev.filter((p) => p.discipline_den_id !== postId));
    }
  }

  /* ================================================================ */
  /*  Helpers for like state                                           */
  /* ================================================================ */
  function postLikeCount(postId) {
    return (likesMap[postId] || []).filter((l) => !l.discipline_den_likes_comment_parent_ref).length;
  }

  function userLikedPost(postId) {
    if (!user) return false;
    return (likesMap[postId] || []).some(
      (l) => l.discipline_den_comment_user_id === user.id && !l.discipline_den_likes_comment_parent_ref
    );
  }

  function commentLikeCount(commentId) {
    return (commentLikesMap[commentId] || []).length;
  }

  function userLikedComment(commentId) {
    if (!user) return false;
    return (commentLikesMap[commentId] || []).some(
      (l) => l.discipline_den_comment_user_id === user.id
    );
  }

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>Discipline Den</h1>
          <p style={styles.pageSubtitle}>
            Share devotional content, encouragements, and spiritual insights with the community.
          </p>
        </header>

        {/* ---- Create Post Form ---- */}
        {user && (
          <form onSubmit={handleCreatePost} style={styles.createPostCard}>
            <div style={styles.createPostHeader}>
              <div style={styles.createPostAvatar}>
                {profile && avatarSrc(profile) ? (
                  <img
                    src={avatarSrc(profile)}
                    alt="Your avatar"
                    style={styles.avatarImg}
                  />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    {profile?.user_first_name?.[0] || '?'}
                  </div>
                )}
              </div>
              <span style={styles.createPostName}>
                {profile ? displayName(profile) : 'Loading...'}
              </span>
            </div>

            <div style={styles.formFields}>
              <input
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
              />
              <textarea
                placeholder="What's on your heart today?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                style={styles.textarea}
              />
              <input
                type="url"
                placeholder="Link (optional)"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={styles.input}
              />
              <div style={styles.fileRow}>
                <label style={styles.fileLabel}>
                  Upload image
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    style={styles.fileInput}
                  />
                </label>
                {imageFile && (
                  <span style={styles.fileName}>{imageFile.name}</span>
                )}
              </div>
            </div>

            {formError && <div style={styles.errorBox}>{formError}</div>}

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitButton,
                ...(submitting ? styles.submitButtonDisabled : {}),
              }}
            >
              {submitting ? 'Posting...' : 'Share Post'}
            </button>
          </form>
        )}

        {/* ---- Posts Feed ---- */}
        {loadingPosts ? (
          <div style={styles.loadingText}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={styles.emptyText}>
            No posts yet. Be the first to share something!
          </div>
        ) : (
          <div style={styles.feed}>
            {posts.map((post) => {
              const postUser = post.users;
              const postId = post.discipline_den_id;
              const comments = commentsMap[postId] || [];
              const isExpanded = expandedComments[postId] || false;

              return (
                <article key={postId} style={styles.postCard}>
                  {/* Post header: avatar + name + date */}
                  <div style={styles.postHeader}>
                    <div style={styles.postAuthorSection}>
                      <div style={styles.postAvatar}>
                        {postUser && avatarSrc(postUser) ? (
                          <img
                            src={avatarSrc(postUser)}
                            alt={displayName(postUser)}
                            style={styles.avatarImg}
                          />
                        ) : (
                          <div style={styles.avatarPlaceholder}>
                            {postUser?.user_first_name?.[0] || '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={styles.postAuthorName}>
                          {displayName(postUser)}
                        </div>
                        <div style={styles.postDate}>
                          {post.discipline_den_date_created
                            ? formatDistanceToNow(
                                new Date(post.discipline_den_date_created),
                                { addSuffix: true }
                              )
                            : ''}
                        </div>
                      </div>
                    </div>
                    {(post.discipline_den_user === user?.id || isAdmin) && (
                      <button
                        onClick={() => handleDeletePost(postId)}
                        style={styles.deleteButton}
                        title="Delete post"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  {/* Post body */}
                  <div style={styles.postBody}>
                    {post.discipline_den_title && (
                      <h2 style={styles.postTitle}>{post.discipline_den_title}</h2>
                    )}
                    {post.discipline_den_caption && (
                      <p style={styles.postCaption}>{post.discipline_den_caption}</p>
                    )}
                    {post.discipline_den_img && (
                      <div style={styles.postImageWrapper}>
                        <img
                          src={post.discipline_den_img}
                          alt={post.discipline_den_title || 'Post media'}
                          style={styles.postImage}
                          loading="lazy"
                        />
                      </div>
                    )}
                    {post.discipline_den_link && (
                      <a
                        href={post.discipline_den_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.postLink}
                      >
                        {post.discipline_den_link}
                      </a>
                    )}
                  </div>

                  {/* Actions: flame + comments toggle */}
                  <div style={styles.postActions}>
                    <button
                      onClick={() => handleTogglePostLike(postId)}
                      style={{
                        ...styles.flameButton,
                        ...(userLikedPost(postId) ? styles.flameLiked : {}),
                      }}
                      title={userLikedPost(postId) ? 'Remove flame' : 'Add flame'}
                    >
                      <span role="img" aria-label="flame">
                        {'\uD83D\uDD25'}
                      </span>{' '}
                      {postLikeCount(postId) > 0 && (
                        <span style={styles.flameCount}>{postLikeCount(postId)}</span>
                      )}
                    </button>

                    <button
                      onClick={() => toggleComments(postId)}
                      style={styles.commentsToggle}
                    >
                      {isExpanded ? 'Hide Comments' : 'Comments'}
                      {comments.length > 0 && ` (${comments.length})`}
                    </button>
                  </div>

                  {/* Comments section */}
                  {isExpanded && (
                    <div style={styles.commentsSection}>
                      {loadingComments[postId] ? (
                        <div style={styles.commentsLoading}>Loading comments...</div>
                      ) : comments.length === 0 ? (
                        <div style={styles.noComments}>
                          No comments yet. Start the conversation!
                        </div>
                      ) : (
                        <div style={styles.commentsList}>
                          {comments.map((comment) => (
                            <div key={comment.discipline_den_comment_id} style={styles.commentItem}>
                              <div style={styles.commentHeader}>
                                <span style={styles.commentAuthor}>
                                  {displayName(comment.users)}
                                </span>
                                <span style={styles.commentDate}>
                                  {comment.discipline_den_comment_date
                                    ? formatDistanceToNow(new Date(comment.discipline_den_comment_date), {
                                        addSuffix: true,
                                      })
                                    : ''}
                                </span>
                              </div>
                              <p style={styles.commentText}>
                                {comment.discipline_den_comment_text}
                              </p>
                              <button
                                onClick={() =>
                                  handleToggleCommentLike(comment.discipline_den_comment_id, postId)
                                }
                                style={{
                                  ...styles.commentFlameButton,
                                  ...(userLikedComment(comment.discipline_den_comment_id)
                                    ? styles.flameLiked
                                    : {}),
                                }}
                                title={
                                  userLikedComment(comment.discipline_den_comment_id)
                                    ? 'Remove flame'
                                    : 'Add flame'
                                }
                              >
                                <span role="img" aria-label="flame">
                                  {'\uD83D\uDD25'}
                                </span>{' '}
                                {commentLikeCount(comment.discipline_den_comment_id) > 0 && (
                                  <span style={styles.flameCount}>
                                    {commentLikeCount(comment.discipline_den_comment_id)}
                                  </span>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add comment input */}
                      {user && (
                        <div style={styles.addCommentRow}>
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText[postId] || ''}
                            onChange={(e) =>
                              setCommentText((prev) => ({
                                ...prev,
                                [postId]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddComment(postId);
                              }
                            }}
                            style={styles.commentInput}
                          />
                          <button
                            onClick={() => handleAddComment(postId)}
                            style={styles.commentSubmitButton}
                            disabled={!(commentText[postId] || '').trim()}
                          >
                            Post
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Styles                                                             */
/* ================================================================== */
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg-alt, #f5f5f5)',
    fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    padding: '24px 16px',
  },
  container: {
    maxWidth: '680px',
    margin: '0 auto',
  },

  /* Header */
  header: {
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--color-text, #1a1a1a)',
    margin: '0 0 4px 0',
  },
  pageSubtitle: {
    fontSize: '15px',
    color: 'var(--color-text-muted, #6b7280)',
    margin: 0,
    lineHeight: '1.5',
  },

  /* Create Post Card */
  createPostCard: {
    backgroundColor: 'var(--color-bg, #ffffff)',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    border: '1px solid var(--color-border, #e5e7eb)',
    padding: '20px',
    marginBottom: '24px',
  },
  createPostHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  createPostAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
  },
  createPostName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text, #1a1a1a)',
  },
  formFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '15px',
    lineHeight: '1.5',
    color: 'var(--color-text, #1a1a1a)',
    backgroundColor: 'var(--color-bg, #ffffff)',
    border: '1px solid var(--color-border, #e5e7eb)',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '15px',
    lineHeight: '1.5',
    color: 'var(--color-text, #1a1a1a)',
    backgroundColor: 'var(--color-bg, #ffffff)',
    border: '1px solid var(--color-border, #e5e7eb)',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
  },
  fileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  fileLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-primary, #DC143C)',
    backgroundColor: 'transparent',
    border: '1px solid var(--color-primary, #DC143C)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  fileInput: {
    display: 'none',
  },
  fileName: {
    fontSize: '13px',
    color: 'var(--color-text-muted, #6b7280)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '200px',
  },
  errorBox: {
    padding: '10px 14px',
    fontSize: '14px',
    color: 'var(--color-error, #ef4444)',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    marginBottom: '12px',
    lineHeight: '1.4',
  },
  submitButton: {
    width: '100%',
    padding: '12px 20px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'var(--color-primary, #DC143C)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },

  /* Feed */
  feed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  loadingText: {
    textAlign: 'center',
    padding: '40px 0',
    fontSize: '15px',
    color: 'var(--color-text-muted, #6b7280)',
  },
  emptyText: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '16px',
    color: 'var(--color-text-muted, #6b7280)',
    backgroundColor: 'var(--color-bg, #ffffff)',
    borderRadius: '12px',
    border: '1px solid var(--color-border, #e5e7eb)',
  },

  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    lineHeight: 1,
    color: 'var(--color-text-muted, #6b7280)',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'color 0.15s ease, background-color 0.15s ease',
  },

  /* Post Card */
  postCard: {
    backgroundColor: 'var(--color-bg, #ffffff)',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    border: '1px solid var(--color-border, #e5e7eb)',
    overflow: 'hidden',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px 0 20px',
  },
  postAuthorSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  postAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: 'var(--color-bg-alt, #f5f5f5)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    backgroundColor: 'var(--color-primary, #DC143C)',
    borderRadius: '50%',
  },
  postAuthorName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-text, #1a1a1a)',
    lineHeight: '1.3',
  },
  postDate: {
    fontSize: '13px',
    color: 'var(--color-text-muted, #6b7280)',
    lineHeight: '1.3',
  },

  /* Post Body */
  postBody: {
    padding: '12px 20px 4px 20px',
  },
  postTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-text, #1a1a1a)',
    margin: '0 0 8px 0',
    lineHeight: '1.4',
  },
  postCaption: {
    fontSize: '15px',
    color: 'var(--color-text, #1a1a1a)',
    margin: '0 0 12px 0',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  postImageWrapper: {
    margin: '0 -20px 12px -20px',
    maxHeight: '500px',
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
    maxHeight: '500px',
  },
  postLink: {
    display: 'inline-block',
    fontSize: '14px',
    color: 'var(--color-primary, #DC143C)',
    textDecoration: 'none',
    wordBreak: 'break-all',
    marginBottom: '8px',
    fontWeight: '500',
  },

  /* Post Actions */
  postActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 20px 12px 20px',
    borderTop: '1px solid var(--color-border, #e5e7eb)',
    marginTop: '4px',
  },
  flameButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 14px',
    fontSize: '15px',
    fontWeight: '500',
    color: 'var(--color-text-muted, #6b7280)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease',
  },
  flameLiked: {
    color: 'var(--color-primary, #DC143C)',
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
  },
  flameCount: {
    fontSize: '14px',
    fontWeight: '600',
  },
  commentsToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 14px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--color-text-muted, #6b7280)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },

  /* Comments Section */
  commentsSection: {
    borderTop: '1px solid var(--color-border, #e5e7eb)',
    padding: '12px 20px 16px 20px',
    backgroundColor: 'var(--color-bg-alt, #fafafa)',
  },
  commentsLoading: {
    textAlign: 'center',
    padding: '12px 0',
    fontSize: '14px',
    color: 'var(--color-text-muted, #6b7280)',
  },
  noComments: {
    textAlign: 'center',
    padding: '12px 0',
    fontSize: '14px',
    color: 'var(--color-text-muted, #6b7280)',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '12px',
  },
  commentItem: {
    padding: '10px 14px',
    backgroundColor: 'var(--color-bg, #ffffff)',
    borderRadius: '10px',
    border: '1px solid var(--color-border, #e5e7eb)',
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  commentAuthor: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text, #1a1a1a)',
  },
  commentDate: {
    fontSize: '12px',
    color: 'var(--color-text-muted, #6b7280)',
  },
  commentText: {
    fontSize: '14px',
    color: 'var(--color-text, #1a1a1a)',
    margin: '0 0 6px 0',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  commentFlameButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    padding: '4px 10px',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--color-text-muted, #6b7280)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease',
  },

  /* Add Comment */
  addCommentRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    padding: '9px 14px',
    fontSize: '14px',
    color: 'var(--color-text, #1a1a1a)',
    backgroundColor: 'var(--color-bg, #ffffff)',
    border: '1px solid var(--color-border, #e5e7eb)',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  commentSubmitButton: {
    padding: '9px 18px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'var(--color-primary, #DC143C)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    flexShrink: 0,
  },
};
