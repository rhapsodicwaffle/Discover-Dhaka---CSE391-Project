import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const EventCard = ({ event, onAttend }) => {
  const { user, isAuthenticated } = useAuth();
  const isAttending = user && event.attendees?.includes(user._id);

  const handleAddToCalendar = () => {
    alert(`Adding "${event.title}" to calendar!`);
  };

  const handleAttend = () => {
    if (!isAuthenticated) {
      alert('Please login to attend events');
      return;
    }
    onAttend && onAttend(event._id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="card hover-lift" style={{ overflow: 'hidden', border: '3px solid transparent', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <img 
        src={event.image || event.imageUrl || 'https://via.placeholder.com/400x180'} 
        alt={event.title || event.name}
        style={{ width: '100%', height: '180px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <span className="badge badge-secondary" style={{ fontSize: '12px' }}>
            {event.category}
          </span>
        </div>
        
        <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600' }}>{event.title || event.name}</h3>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <span>📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <span>🕒</span>
            <span>{event.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <span>📍</span>
            <span>{event.venue}</span>
          </div>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
          {event.description}
        </p>
        
        <div style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {event.attendees?.length || 0} attending
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleAttend}
            className="btn"
            style={{ 
              flex: 1, 
              fontSize: '14px', 
              padding: '10px',
              background: isAttending ? 'var(--primary)' : 'white',
              color: isAttending ? 'white' : 'var(--primary)',
              border: `1px solid var(--primary)`
            }}
          >
            {isAttending ? '✓ Attending' : 'Attend'}
          </button>
          {event.ticketLink && (
            <a 
              href={event.ticketLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, textDecoration: 'none' }}
            >
              <button 
                className="btn btn-outline"
                style={{ width: '100%', fontSize: '14px', padding: '10px' }}
              >
                Get Tickets
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
