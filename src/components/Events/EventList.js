import React, { useState, useEffect } from 'react';
import { eventCategories } from '../../data/mockData';
import { eventsAPI } from '../../api/services';
import EventCard from './EventCard';
import CreateEvent from './CreateEvent';

const EventList = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>🔍 Filter by Category</h3>
          <button 
            onClick={() => setShowCreateEvent(true)}
            className="btn btn-primary"
            style={{ padding: '10px 20px' }}
          >
            + Submit Event
          </button>
        </div>
        
        <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory('All')}
              className="animate-scale-in"
              style={{ 
                cursor: 'pointer', 
                padding: '10px 20px', 
                border: selectedCategory === 'All' ? '2px solid var(--primary)' : '2px solid transparent',
                fontSize: '14px',
                background: selectedCategory === 'All' ? 'var(--primary)' : '#f0f0f0',
                color: selectedCategory === 'All' ? 'white' : 'var(--text-primary)',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              All Events
            </button>
            {eventCategories.map((category, idx) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="animate-scale-in"
                style={{ 
                  cursor: 'pointer', 
                  padding: '10px 20px', 
                  border: selectedCategory === category ? '2px solid var(--primary)' : '2px solid transparent',
                  fontSize: '14px',
                  background: selectedCategory === category ? 'var(--primary)' : '#f0f0f0',
                  color: selectedCategory === category ? 'white' : 'var(--text-primary)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  animationDelay: `${(idx + 1) * 0.05}s`
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="card animate-pulse" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="rickshaw-wheel" style={{ margin: '0 auto 20px' }}></div>
            <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Loading events...</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              {filteredEvents.map((event, idx) => (
                <div key={event._id} className="animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <EventCard event={event} onAttend={handleAttend} />
                </div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="card animate-fade-in" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎪</div>
                <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>No events found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Try selecting a different category</p>
              </div>
            )}
          </>
        )}
        
        {showCreateEvent && (
          <CreateEvent
            onClose={() => setShowCreateEvent(false)}
            onSubmit={(newEvent) => {
              fetchEvents();
              setShowCreateEvent(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EventList;
