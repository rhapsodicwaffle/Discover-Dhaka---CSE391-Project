import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const CreateRoute = ({ onClose }) => {
  const { user, saveRoute } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedPlaces: []
  });

  const handleTogglePlace = (place) => {
    setFormData(prev => ({
      ...prev,
      selectedPlaces: prev.selectedPlaces.some(p => p.id === place.id)
        ? prev.selectedPlaces.filter(p => p.id !== place.id)
        : [...prev.selectedPlaces, place]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.selectedPlaces.length < 2) {
      alert('Please select at least 2 places for your route');
      return;
    }

    const newRoute = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      places: formData.selectedPlaces,
      duration: `${formData.selectedPlaces.length * 30} mins`,
      createdAt: new Date().toISOString()
    };

    saveRoute(newRoute);
    onClose();
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Create Custom Route</h2>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Route Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input"
                placeholder="e.g., My Historic Dhaka Tour"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows="3"
                placeholder="Describe your route..."
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '14px' }}>
                Select Places ({formData.selectedPlaces.length} selected)
              </label>
              {user?.savedPlaces?.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px' }}>
                  {user.savedPlaces.map(place => (
                    <label
                      key={place.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        marginBottom: '4px',
                        background: formData.selectedPlaces.some(p => p.id === place.id) ? 'var(--bg)' : 'white'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedPlaces.some(p => p.id === place.id)}
                        onChange={() => handleTogglePlace(place)}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{place.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{place.category}</div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', background: 'var(--bg)', borderRadius: '8px' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>No saved places yet. Save some places from the map first!</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                disabled={formData.selectedPlaces.length < 2}
              >
                Create Route
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

export default CreateRoute;
