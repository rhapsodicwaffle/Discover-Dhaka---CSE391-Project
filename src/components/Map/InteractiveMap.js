import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mockPlaces, categories } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const InteractiveMap = () => {
  const { user, savePlace, unsavePlace } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const isPlaceSaved = (placeId) => {
    return user?.savedPlaces?.some(p => p.id === placeId) || false;
  };

  const handleSavePlace = (place) => {
    if (isPlaceSaved(place.id)) {
      unsavePlace(place.id);
    } else {
      savePlace(place);
    }
  };

  const filteredPlaces = mockPlaces.filter(place => {
    const matchesCategory = selectedCategory === 'All' || place.category === selectedCategory;
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            </button>
          ))}
        </div>
      </div>
      
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'var(--secondary)' }}>⭐</span>
                    <span style={{ fontWeight: '600' }}>{place.rating}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSavePlace(place)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: isPlaceSaved(place.id) ? 'var(--primary)' : 'white',
                    color: isPlaceSaved(place.id) ? 'white' : 'var(--primary)',
                    border: `1px solid var(--primary)`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
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
