import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/client';

const CreateEvent = ({ onClose, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Other',
    description: '',
    date: '',
    time: '',
    venue: '',
    ticketLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['Music', 'Art', 'Tech', 'Food', 'Sports', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/events', formData);
      if (response.data.success) {
        onSubmit && onSubmit(response.data.data);
        onClose && onClose();
        alert('Event submitted for admin approval!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Submit Event</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
          </div>
          
          {error && (
            <div style={{ padding: '12px', background: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '16px' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Event Name *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-input"
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-input"
                disabled={loading}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="form-input"
                rows="4"
                disabled={loading}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={loading}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Venue *</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Event location"
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Ticket Link (Optional)</label>
              <input
                type="url"
                name="ticketLink"
                value={formData.ticketLink}
                onChange={handleChange}
                className="form-input"
                placeholder="https://..."
                disabled={loading}
              />
            </div>

            <div style={{ padding: '12px', background: '#fff3cd', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
              ℹ️ Your event will be reviewed by an admin before appearing publicly.
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Event'}
              </button>
              <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
