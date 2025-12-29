import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { categories } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { placesAPI } from '../../api/services';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const InteractiveMap = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, [selectedCategory, searchQuery]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      const response = await placesAPI.getAll(params);
      if (response.success) {
        setPlaces(response.data);
      }
    } catch (err) {
      setError('Failed to load places');
      console.error(err);
    } finally {
      se{error && (
          <div style={{ padding: '12px', background: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        tLoading(false);
    }
  };

  const isPlaceSaved = (placeId) => {
    return user?.savedPlaces?.some(p => p._id === placeId) || false;
  };

  const handleSavePlace = async (place) => {
    if (!isAuthenticated) {
      alert('Please login to save places');
      return;
    }
    // This would need a save place API endpoint - for now just show message
    alert('Save place feature - API endpoint pending');
  };

  const filteredPlaces = places;

  return (
    <div style={{ height: '100%' }}>
      <div style={{ padding: '20px', background: 'white', borderBottom: '1px solid var(--border)' }}>
        <input
          type="text"
          placeholder="Search places..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ marginBottom: '16px', width: '100%' }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('All')}
            className={selectedCategory === 'All' ? 'badge badge-primary' : 'badge'}
            style={{ cursor: 'pointer', padding: '8px 16px', border: 'none', fontSize: '14px' }}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'badge badge-primary' : 'badge'}
              style={{ cursor: 'pointer', padding: '8px 16px', border: 'none', fontSize: '14px' }}
            >
              {category}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 260px)' }}>
          <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Loading places...</div>
        </div>
      ) : (
        <MapContainer
          center={[23.8103, 90.4125]}
          zoom={12}
          style={{ height: 'calc(100vh - 260px)', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredPlaces.map(place => (
            <Marker key={place._id} position={[place.lat, place.lng]}>
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredPlaces.map(place => (
          <Marker key={place.id} position={[place.lat, place.lng]}>
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <img
                  src={place.image}
                  alt={place.name}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                />
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>{place.name}</h3>
                <span className="badge badge-secondary" style={{ marginBottom: '8px', display: 'inline-block' }}>
                  {place.category}
                </span>
                <p style={{ margin: '8px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {place.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', al_id) ? 'var(--primary)' : 'white',
                    color: isPlaceSaved(place._id) ? 'white' : 'var(--primary)',
                    border: `1px solid var(--primary)`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  {isPlaceSaved(place._id) ? '✓ Saved' : '+ Save Place'}
                </button>
              </div>
            </Popup>
          </Marker>
          ))}
        </MapContainer>
      )}ontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  {isPlaceSaved(place.id) ? '✓ Saved' : '+ Save Place'}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
