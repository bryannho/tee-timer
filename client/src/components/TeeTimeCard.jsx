import React from 'react';
import { format } from 'date-fns';

const TeeTimeCard = ({ teeTime, course, onBook, isManagement = false, onEdit }) => {
  const formattedTime = format(new Date(teeTime.start_time), 'MMMM d, yyyy h:mm a');
  const isAvailable = teeTime.status === 'available';

  return (
    <div className="card" style={{
      borderLeft: isAvailable ? '4px solid var(--success-color)' : '4px solid var(--accent-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3>{course?.name || 'Golf Course'}</h3>
          <p>{course?.location || 'Location'}</p>
          <p style={{ fontWeight: 'bold' }}>{formattedTime}</p>
        </div>
        <div>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              backgroundColor: isAvailable ? 'var(--success-color)' : 'var(--accent-color)',
              color: 'white'
            }}
          >
            {teeTime.status}
          </span>
        </div>
      </div>

      {isManagement ? (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          {teeTime.user_id && <p>Booked by User ID: {teeTime.user_id}</p>}
          <button
            className="btn btn-secondary"
            onClick={() => onEdit && onEdit(teeTime)}
            style={{ marginLeft: 'auto' }}
          >
            Edit
          </button>
        </div>
      ) : (
        isAvailable && (
          <button className="btn" onClick={() => onBook && onBook(teeTime)}>
            Book Now
          </button>
        )
      )}
    </div>
  );
};

export default TeeTimeCard;