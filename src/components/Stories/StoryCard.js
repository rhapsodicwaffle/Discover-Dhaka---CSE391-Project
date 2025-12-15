import React, { useState } from 'react';

const StoryCard = ({ story, onLike }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story.likes);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(likeCount + 1);
      onLike && onLike(story.id);
    }
  };

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <img 
        src={story.image} 
        alt={story.title}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>{story.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px' }}>
            {story.author[0]}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{story.author}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{story.placeName}</div>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
          {story.content}
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {story.tags.map(tag => (
            <span key={tag} className="badge badge-secondary" style={{ fontSize: '12px' }}>
              #{tag}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={handleLike}
            className="btn btn-outline"
            style={{ 
              padding: '8px 16px', 
              fontSize: '14px',
              background: liked ? 'var(--primary)' : 'transparent',
              color: liked ? 'white' : 'var(--text-primary)',
              borderColor: liked ? 'var(--primary)' : 'var(--border)'
            }}
          >
            {liked ? '' : ''} {likeCount}
          </button>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{story.date}</span>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
