import React, { useState } from 'react';
import { mockStories } from '../../data/mockData';
import StoryCard from './StoryCard';
import CreateStory from './CreateStory';

const StoryList = () => {
  const [stories, setStories] = useState(mockStories);
  const [selectedTag, setSelectedTag] = useState('All');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const allTags = ['All', ...new Set(mockStories.flatMap(story => story.tags))];

  const filteredStories = selectedTag === 'All' 
    ? stories 
    : stories.filter(story => story.tags.includes(selectedTag));

  const handleNewStory = (newStory) => {
    setStories([newStory, ...stories]);
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>No stories found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try selecting a different tag</p>
          </div>
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
