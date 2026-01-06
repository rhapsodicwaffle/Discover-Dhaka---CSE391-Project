import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { forumAPI } from '../../api/services';
import { useAuth } from '../../contexts/AuthContext';

const ThreadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    try {
      setLoading(true);
      const response = await forumAPI.getThreadById(id);
      if (response.success) {
        setThread(response.data.thread);
        setReplies(response.data.replies || []);
      }
    } catch (err) {
      setError('Failed to load thread');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }
    try {
      const response = await forumAPI.upvoteThread(id);
      if (response.success) {
        setThread(response.data);
      }
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const handleDownvote = async () => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }
    try {
      const response = await forumAPI.downvoteThread(id);
      if (response.success) {
        setThread(response.data);
      }
    } catch (err) {
      console.error('Failed to downvote:', err);
    }
  };

  const handleUpvoteReply = async (replyId) => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }
    try {
      const response = await forumAPI.upvoteReply(replyId);
      if (response.success) {
        setReplies(replies.map(r => 
          r.id === replyId ? response.data : r
        ));
      }
    } catch (err) {
      console.error('Failed to upvote reply:', err);
    }
  };

  const handleDownvoteReply = async (replyId) => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }
    try {
      const response = await forumAPI.downvoteReply(replyId);
      if (response.success) {
        setReplies(replies.map(r => 
          r.id === replyId ? response.data : r
        ));
      }
    } catch (err) {
      console.error('Failed to downvote reply:', err);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to reply');
      return;
    }
    if (!replyContent.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      setSubmitting(true);
      const response = await forumAPI.replyToThread(id, { content: replyContent });
      if (response.success) {
        setReplies([...replies, response.data]);
        setReplyContent('');
      }
    } catch (err) {
      alert('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const hasUserUpvoted = (item) => {
    return user && item?.upvotes?.includes(user.id);
  };

  const hasUserDownvoted = (item) => {
    return user && item?.downvotes?.includes(user.id);
  };

  const getVoteScore = (item) => {
    return (item?.upvotes?.length || 0) - (item?.downvotes?.length || 0);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="rickshaw-wheel animate-pulse"></div>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '16px' }}>❌ {error || 'Thread not found'}</h2>
        <button onClick={() => navigate('/forum')} className="btn btn-primary">
          ← Back to Forum
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '40px 0' }}>
        <div className="container">
          <button 
            onClick={() => navigate('/forum')} 
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: '1px solid white', 
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '16px',
              fontSize: '14px'
            }}
          >
            ← Back to Forum
          </button>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.3)', color: 'white', border: 'none' }}>
              {thread.category}
            </span>
            {thread.isPinned && (
              <span className="badge" style={{ background: 'var(--accent)', color: 'var(--text)' }}>
                📌 Pinned
              </span>
            )}
            {thread.isLocked && (
              <span className="badge" style={{ background: '#999', color: 'white' }}>
                🔒 Locked
              </span>
            )}
          </div>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>
            {thread.title}
          </h1>
          <div style={{ color: 'white', opacity: 0.9, display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '14px' }}>
            <span>👤 {thread.author?.name || 'Unknown'}</span>
            <span>👁️ {thread.views || 0} views</span>
            <span>💬 {replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
            <span>📅 {new Date(thread.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 20px', maxWidth: '900px' }}>
        {/* Main Thread Post */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Vote Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleUpvote}
                disabled={!isAuthenticated}
                style={{
                  background: hasUserUpvoted(thread) ? 'var(--primary)' : 'transparent',
                  border: '2px solid var(--border)',
                  borderRadius: '6px',
                  width: '40px',
                  height: '40px',
                  cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.2s',
                  color: hasUserUpvoted(thread) ? 'white' : 'var(--text)'
                }}
                title={isAuthenticated ? 'Upvote' : 'Login to vote'}
              >
                ▲
              </button>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '700',
                color: getVoteScore(thread) > 0 ? 'var(--primary)' : getVoteScore(thread) < 0 ? 'var(--danger)' : 'var(--text)'
              }}>
                {getVoteScore(thread)}
              </div>
              <button
                onClick={handleDownvote}
                disabled={!isAuthenticated}
                style={{
                  background: hasUserDownvoted(thread) ? 'var(--danger)' : 'transparent',
                  border: '2px solid var(--border)',
                  borderRadius: '6px',
                  width: '40px',
                  height: '40px',
                  cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.2s',
                  color: hasUserDownvoted(thread) ? 'white' : 'var(--text)'
                }}
                title={isAuthenticated ? 'Downvote' : 'Login to vote'}
              >
                ▼
              </button>
            </div>

            {/* Content Section */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '20px'
                  }}>
                    {thread.author?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '16px' }}>
                      {thread.author?.name || 'Unknown User'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {new Date(thread.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ 
                fontSize: '15px', 
                lineHeight: '1.7', 
                color: 'var(--text)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {thread.content}
              </div>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>
          
          {replies.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px', 
              background: 'white', 
              borderRadius: '12px',
              border: '2px dashed var(--border)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
              <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
                No replies yet. Be the first to respond!
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {replies.map((reply, index) => (
                <div key={reply.id} className="card">
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Vote Section for Reply */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleUpvoteReply(reply.id)}
                        disabled={!isAuthenticated}
                        style={{
                          background: hasUserUpvoted(reply) ? 'var(--primary)' : 'transparent',
                          border: '2px solid var(--border)',
                          borderRadius: '6px',
                          width: '36px',
                          height: '36px',
                          cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          color: hasUserUpvoted(reply) ? 'white' : 'var(--text)'
                        }}
                      >
                        ▲
                      </button>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '600',
                        color: getVoteScore(reply) > 0 ? 'var(--primary)' : getVoteScore(reply) < 0 ? 'var(--danger)' : 'var(--text)'
                      }}>
                        {getVoteScore(reply)}
                      </div>
                      <button
                        onClick={() => handleDownvoteReply(reply.id)}
                        disabled={!isAuthenticated}
                        style={{
                          background: hasUserDownvoted(reply) ? 'var(--danger)' : 'transparent',
                          border: '2px solid var(--border)',
                          borderRadius: '6px',
                          width: '36px',
                          height: '36px',
                          cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          color: hasUserDownvoted(reply) ? 'white' : 'var(--text)'
                        }}
                      >
                        ▼
                      </button>
                    </div>

                    {/* Reply Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '700',
                          fontSize: '16px'
                        }}>
                          {reply.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '15px' }}>
                            {reply.user?.name || 'Unknown User'}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {new Date(reply.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '15px', 
                        lineHeight: '1.6', 
                        color: 'var(--text)',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {reply.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply Form */}
        {isAuthenticated && !thread.isLocked ? (
          <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              Post a Reply
            </h3>
            <form onSubmit={handleSubmitReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="form-input"
                rows="5"
                style={{ 
                  width: '100%', 
                  marginBottom: '16px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting || !replyContent.trim()}
                style={{ opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
            </form>
          </div>
        ) : !isAuthenticated ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Please login to post a reply
            </div>
            <Link to="/login">
              <button className="btn btn-primary">Login</button>
            </Link>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', background: '#f9f9f9' }}>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
              🔒 This thread is locked. No new replies can be added.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadDetail;
