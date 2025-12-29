import React, { useState, useEffect } from 'react';
import { eventCategories } from '../../data/mockData';
import { eventsAPI } from '../../api/services';
import EventCard from './EventCard';

const EventList = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
      const response = await eventsAPI.getAll(params);
      if (response.success) {
        setEvents(response.data);
      }
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttend = async (eventId) => {
    try {
      const response = await eventsAPI.attend(eventId);
      if (response.success) {
        // Update the event in the list
        setEvents(events.map(e => 
          e._id === eventId ? response.data : e
        ));
      }
    } catch (err) {
      console.error('Failed to attend event:', err);
    }
  };

  const filteredEvents = events;

  return (
    <div className="rickshaw-pattern" style={{ minHeight: '100vh', paddingBottom: '40px' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))', padding: '40px 0', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div className="rickshaw-border"></div>
        <div className="container">
          <h1 className="animate-slide-in" style={{ color: 'white', marginBottom: '12px', fontSize: '36px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>🎉</span> Events in Dhaka
          </h1>
          <p className="animate-fade-in" style={{ color: 'white', opacity: 0.9, fontSize: '18px', animationDelay: '0.2s' }}>
            Discover exciting events, festivals, and cultural activities happening around the city
          </p>
        </div>
      </div>

      <div className="container">
        {error && (
          <div className="animate-slide-in" style={{ padding: '16px', background: '#fee', color: '#c33', borderRadius: '8px', marginBottom: '24px', border: '2px solid #c33' }}>
            ⚠️ {error}
          </div>
        )}
        
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Loading events...</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              {filteredEvents.map(event => (
                <EventCard key={event._id} event={event} onAttend={handleAttend} />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>No events found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try selecting a different category</p>
              </div>
            )}
          </

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
