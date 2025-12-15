import React from 'react';

const EventCard = ({ event }) => {
  const handleAddToCalendar = () => {
    alert(`Adding "${event.name}" to calendar!`);
  };

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <img 
        src={event.imageUrl} 
        alt={event.name}
        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
      />
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <span className="badge badge-secondary" style={{ fontSize: '12px' }}>
            {event.category}
          </span>
        </div>
        
        <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600' }}>{event.name}</h3>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <span></span>
            <span>{event.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <span></span>
            <span>{event.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <span></span>
            <span>{event.venue}</span>
          </div>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
          {event.description}
        </p>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleAddToCalendar}
            className="btn"
            style={{ flex: 1, fontSize: '14px', padding: '10px' }}
          >
            Add to Calendar
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
