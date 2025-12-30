import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { storiesAPI, placesAPI } from '../../api/services';

const CreateStory = ({ onClose, onSubmit }) => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    placeName: '',
    tags: '',
    place: '' // Optional place ID
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await placesAPI.getAll();
        if (response.success) {
          setPlaces(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch places:', err);
      }
    };
    fetchPlaces();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Max 5 images
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const storyData = {
        title: formData.title,
        content: formData.content,
        placeName: formData.placeName,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images
      };
      
      // Only include place if it's selected
      if (formData.place && formData.place !== '') {
        storyData.place = formData.place;
      }
      
      const response = await storiesAPI.create(storyData);
      if (response.success) {
        await refreshUser(); // Refresh user to get updated XP and badges
        onSubmit && onSubmit(response.data);
        onClose && onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create story');
    } finally {
      setLoading(false);
    }
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
          
          {error && (
            <div style={{ padding: '12px', background: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '16px' }}>
              {error}
            </div>
          )}
          
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
                disabled={loading}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Location</label>
              <input
                type="text"
                name="placeName"
                value={formData.placeName}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Where did this happen?"
                disabled={loading}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Link to Place (Optional)</label>
              <select
                name="place"
                value={formData.place}
                onChange={handleChange}
                className="form-input"
                disabled={loading}
              >
                <option value="">-- No place selected --</option>
                {places.map(place => (
                  <option key={place._id} value={place._id}>
                    {place.name} ({place.category})
                  </option>
                ))}
              </select>
              <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Link your story to a specific place in Dhaka
              </div>
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
                disabled={loading}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="food, culture, history..."
                disabled={loading}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Images (up to 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-input"
                disabled={loading}
              />
              {images.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {images.length} image(s) selected
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Sharing...' : 'Share Story (+50 XP)'}
              </button>
              <button 
                type="button" 
                onClick={onClose}
                className="btn btn-outline" 
                style={{ flex: 1 }}
                disabled={loading}
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
