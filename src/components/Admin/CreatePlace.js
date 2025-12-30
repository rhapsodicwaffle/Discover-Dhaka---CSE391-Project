import React, { useState } from 'react';
import apiClient from '../../api/client';

const CreatePlace = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    category: 'Historical',
    latitude: '',
    longitude: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['Historical', 'Restaurant', 'Park', 'Museum', 'Shopping', 'Religious', 'Entertainment', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('address', formData.address);
      data.append('category', formData.category);
      data.append('latitude', formData.latitude);
      data.append('longitude', formData.longitude);
      
      if (image) {
        data.append('image', image);
      }

      const response = await apiClient.post('/places', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert('Place created successfully!');
        onSuccess && onSuccess();
        onClose && onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create place');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Add New Place</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}>×</button>
          </div>

          {error && (
            <div style={{ padding: '12px', background: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Place Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="e.g., Lalbagh Fort"
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
                placeholder="Describe the place..."
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Full address"
                disabled={loading}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Latitude *</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="23.8103"
                  disabled={loading}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Longitude *</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="90.4125"
                  disabled={loading}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Place Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
                disabled={loading}
              />
              {image && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Selected: {image.name}
                </div>
              )}
            </div>

            <div style={{ padding: '12px', background: '#e3f2fd', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
              💡 <strong>Tip:</strong> You can find latitude and longitude by searching the place on Google Maps and right-clicking on the location.
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Creating...' : 'Create Place'}
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

export default CreatePlace;
