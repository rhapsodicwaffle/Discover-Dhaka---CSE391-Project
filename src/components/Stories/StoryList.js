import React, { useState, useEffect } from 'react';
import { storiesAPI } from '../../api/services';
import StoryCard from './StoryCard';
import CreateStory from './CreateStory';
import { useAuth } from '../../contexts/AuthContext';

const StoryList = () => {
  const { isAuthenticated } = useAuth();
  const [stories, setStories] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allTags = ['All', ...new Set(stories.flatMap(story => story.tags || []))];

  useEffect(() => {
    fetchStories();
  }, [selectedTag]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const params = selectedTag !== 'All' ? { tag: selectedTag } : {};
      const response = await storiesAPI.getAll(params);
      if (response.success) {
        setStories(response.data);
      }
    } catch (err) {
      setError('Failed to load stories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = stories;

  const handleNewStory = (newStory) => {
    setStories([newStory, ...stories]);
  };

  const handleLikeStory = async (storyId) => {
    if (!isAuthenticated) {
      alert('Please login to like stories');
      return;
    }
    try {
      const response = await storiesAPI.like(storyId);
      if (response.success) {
        // Update the story in the list
        setStories(stories.map(s => 
          s._id === storyId ? response.data : s
        ));
      }
    } catch (err) {
      console.error('Failed to like story:', err);
    }
  };

  return (
    <div className="rickshaw-pattern" style={{ minHeight: '100vh', paddingBottom: '40px' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '40px 0', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div className="rickshaw-border"></div>
        <div className="container">
          <h1 className="animate-slide-in" style={{ color: 'white', marginBottom: '12px', fontSize: '36px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>📖</span> Community Stories
          </h1>
          <p className="animate-fade-in" style={{ color: 'white', opacity: 0.9, fontSize: '18px', marginBottom: '24px', animationDelay: '0.2s' }}>
            Share your experiences and discover stories from fellow explorers
          </p>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="btn hover-lift animate-slide-up"
            style={{ background: 'white', color: 'var(--primary)', fontSize: '16px', padding: '12px 32px', animationDelay: '0.4s' }}
          >
            + Share Your Story
          </button>
        </div>
      </div>

      <div className="container">
        {error && (
          <div className="animate-slide-in" style={{ padding: '16px', background: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '24px', border: '2px solid #c33' }}>
            ⚠️ {error}
          </div>
        )}
        
        <div className="animate-fade-in" style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {allTags.map((tag, idx) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`animate-scale-in ${selectedTag === tag ? 'badge badge-primary' : 'badge'}`}
              style={{ 
                cursor: 'pointer', 
                padding: '8px 16px', 
                border: selectedTag === tag ? '2px solid var(--primary)' : '2px solid transparent',
                fontSize: '14px',
                background: selectedTag === tag ? 'var(--primary)' : '#f0f0f0',
                color: selectedTag === tag ? 'white' : 'var(--text-primary)',
                transition: 'all 0.3s ease',
                animationDelay: `${idx * 0.05}s`
              }}
            >
              {tag === 'All' ? tag : `#${tag}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="card animate-pulse" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="rickshaw-wheel" style={{ margin: '0 auto 20px' }}></div>
            <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Loading stories...</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredStories.map((story, idx) => (
                <div key={story._id} className="animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <StoryCard story={story} onLike={handleLikeStory} />
                </div>
              ))}
            </div>

            {filteredStories.length === 0 && (
              <div className="card animate-fade-in" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>No stories found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try selecting a different tag</p>
              </div>
            )}
          </>
        )}
      </div>

      {showCreateForm && (
        <CreateStory 
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleNewStory}
        />
      )}
    </div>
  );
};

export default StoryList;
