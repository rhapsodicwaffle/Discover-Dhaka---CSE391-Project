import React, { useState, useEffect } from 'react';
import { forumAPI } from '../../api/services';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Forum = () => {
  const { isAuthenticated } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '', category: 'General' });

  const categories = ['All', 'General', 'Tips', 'Questions', 'Events', 'Food', 'Culture'];

  useEffect(() => {
    fetchThreads();
  }, [selectedCategory]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
      const response = await forumAPI.getThreads(params);
      if (response.success) {
        setThreads(response.data);
      }
    } catch (err) {
      setError('Failed to load forum threads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to create threads');
      return;
    }
    
    try {
      const response = await forumAPI.createThread(newThread);
      if (response.success) {
        setThreads([response.data, ...threads]);
        setShowCreateForm(false);
        setNewThread({ title: '', content: '', category: 'General' });
      }
    } catch (err) {
      alert('Failed to create thread');
    }
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '40px 0', marginBottom: '32px' }}>
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: '12px', fontSize: '36px', fontWeight: '700' }}>Community Forum</h1>
          <p style={{ color: 'white', opacity: 0.9, fontSize: '18px', marginBottom: '24px' }}>
            Ask questions, share tips, and connect with fellow explorers
          </p>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="btn"
            style={{ background: 'white', color: 'var(--primary)', fontSize: '16px', padding: '12px 32px' }}
          >
            + New Thread
          </button>
        </div>
      </div>

      <div className="container">
        {error && (
          <div style={{ padding: '16px', background: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'badge badge-primary' : 'badge'}
              style={{ cursor: 'pointer', padding: '10px 20px', border: 'none', fontSize: '14px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Loading threads...</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {threads.map(thread => (
              <div key={thread._id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    {thread.isPinned && (
                      <span style={{ fontSize: '12px', color: 'var(--secondary)', marginRight: '8px' }}>📌 Pinned</span>
                    )}
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
                      {thread.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <span>By {thread.author?.name || 'Anonymous'}</span>
                      <span>•</span>
                      <span className="badge badge-secondary" style={{ fontSize: '11px' }}>{thread.category}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <div>{thread.replies?.length || 0} replies</div>
                    <div>{thread.views || 0} views</div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
                  {thread.content.substring(0, 150)}{thread.content.length > 150 ? '...' : ''}
                </p>
                <Link 
                  to={`/forum/${thread._id}`}
                  style={{ 
                    color: 'var(--primary)', 
                    textDecoration: 'none', 
                    fontSize: '14px', 
                    fontWeight: '600' 
                  }}
                >
                  View Thread →
                </Link>
              </div>
            ))}

            {threads.length === 0 && (
              <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>No threads found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Be the first to start a discussion!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showCreateForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Create New Thread</h2>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateThread}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Category</label>
                  <select
                    value={newThread.category}
                    onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                    className="form-input"
                    required
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Title</label>
                  <input
                    type="text"
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    required
                    className="form-input"
                    placeholder="What's on your mind?"
                  />
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Content</label>
                  <textarea
                    value={newThread.content}
                    onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                    required
                    className="form-input"
                    rows="6"
                    placeholder="Share your thoughts..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn" style={{ flex: 1 }}>
                    Create Thread
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-outline" 
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
