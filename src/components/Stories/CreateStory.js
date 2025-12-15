import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const CreateStory = ({ onClose, onSubmit }) => {
  const { user, addStory } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    tags: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStory = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      placeName: formData.location,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      author: user?.name || 'Anonymous',
      image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366',
      likes: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    addStory(newStory);
    onSubmit && onSubmit(newStory);
    onClose && onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Share Your Story</h2>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Story Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Give your story a catchy title..."
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Where did this happen?"
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Your Story</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                className="form-input"
                rows="6"
                placeholder="Share your experience in Dhaka..."
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="food, culture, history..."
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn" style={{ flex: 1 }}>
                Share Story
              </button>
              <button 
                type="button" 
                onClick={onClose}
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
  );
};

export default CreateStory;
