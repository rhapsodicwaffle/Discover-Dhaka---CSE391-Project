import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const StoryCard = ({ story, onLike }) => {
  const { user } = useAuth();
  const isLiked = user && story.likes?.includes(user._id);
  const [localLiked, setLocalLiked] = useState(isLiked);

  const handleLike = () => {
    setLocalLiked(!localLiked);
    onLike && onLike(story._id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x200';
    if (imagePath.startsWith('http')) return imagePath;
    // Legacy support for old /uploads/ paths
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="card hover-lift" style={{ overflow: 'hidden', border: '3px solid transparent', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <img 
        src={getImageUrl(story.images?.[0] || story.image)} 
        alt={story.title}
        style={{ width: '100%', height: '200px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>{story.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px' }}>
            {story.author?.name?.[0] || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{story.author?.name || 'Anonymous'}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📍 {story.placeName}</div>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
          {story.content}
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {story.tags?.map(tag => (
            <span key={tag} className="badge badge-secondary" style={{ fontSize: '12px', background: '#FFD93D', color: '#333' }}>
              #{tag}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
          <button 
            onClick={handleLike}
            className="btn btn-outline hover-pulse"
            style={{ 
              padding: '8px 16px', 
              fontSize: '14px',
              background: localLiked ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : 'transparent',
              color: localLiked ? 'white' : 'var(--text-primary)',
              borderColor: localLiked ? 'var(--primary)' : '#e0e0e0',
              transition: 'all 0.3s ease'
            }}
          >
            {localLiked ? '❤️' : '🤍'} {story.likesCount || 0}
          </button>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            🕒 {formatDate(story.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
