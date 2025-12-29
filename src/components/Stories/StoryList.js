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
    <div>
      <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '40px 0', marginBottom: '32px' }}>
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: '12px', fontSize: '36px', fontWeight: '700' }}>Community Stories</h1>
          <p style={{ color: 'white', opacity: 0.9, fontSize: '18px', marginBottom: '24px' }}>
            Share your experiences and discover stories from fellow explorers
          </p>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="btn"
            style={{ background: 'white', color: 'var(--primary)', fontSize: '16px', padding: '12px 32px' }}
          >
            + Share Your Story
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
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={selectedTag === tag ? 'badge badge-primary' : 'badge'}
              style={{ cursor: 'pointer', padding: '8px 16px', border: 'none', fontSize: '14px' }}
            >
              {tag === 'All' ? tag : `#${tag}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Loading stories...</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredStories.map(story => (
                <StoryCard key={story._id} story={story} onLike={handleLikeStory} />
              ))}
            </div>

            {filteredStories.length === 0 && (
              <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
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
