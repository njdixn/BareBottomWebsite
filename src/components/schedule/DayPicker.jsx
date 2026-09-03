import React from 'react';

const SLOT_CLASS = {
  Open: 'slot-open',
  Limited: 'slot-limited',
  Full: 'slot-full'
};

export default function DayPicker({ availability = [], loading = false, error = null }) {
  if (loading) {
    return (
      <div className="day-picker">
        <p style={{ color: 'var(--muted)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '.85rem' }}>
          Loading availability…
        </p>
      </div>
    );
  }

  if (error || availability.length === 0) {
    return (
      <div className="day-picker">
        <p style={{ color: 'var(--muted)', fontSize: '.85rem' }}>
          Availability is currently unavailable — please call (509) 201-3467 to check openings.
        </p>
      </div>
    );
  }

  return (
    <div className="day-picker">
      {availability.map((day) => (
        <div className="day-row" key={day.id || day.day_name}>
          <span className="name">{day.day_name}</span>
          <span className={`slot-tag ${SLOT_CLASS[day.status] || 'slot-open'}`}>
            {day.status}
          </span>
        </div>
      ))}
    </div>
  );
}

