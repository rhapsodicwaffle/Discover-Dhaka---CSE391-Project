import React, { useState } from 'react';
import { mockEvents, eventCategories } from '../../data/mockData';
import EventCard from './EventCard';

const EventList = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredEvents = selectedCategory === 'All' 
    ? mockEvents 
    : mockEvents.filter(event => event.category === selectedCategory);

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))', padding: '40px 0', marginBottom: '32px' }}>
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: '12px', fontSize: '36px', fontWeight: '700' }}>Events in Dhaka</h1>
          <p style={{ color: 'white', opacity: 0.9, fontSize: '18px' }}>
            Discover exciting events, festivals, and cultural activities happening around the city
          </p>
        </div>
      </div>

      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Filter by Category</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('All')}
              className={selectedCategory === 'All' ? 'badge badge-primary' : 'badge'}
              style={{ cursor: 'pointer', padding: '10px 20px', border: 'none', fontSize: '14px' }}
            >
              All Events
            </button>
            {eventCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'badge badge-primary' : 'badge'}
                style={{ cursor: 'pointer', padding: '10px 20px', border: 'none', fontSize: '14px' }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>No events found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
