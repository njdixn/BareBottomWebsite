import React, { useState, useEffect } from 'react';
import { useCalendarAvailability } from '../hooks/useCalendarAvailability';
import CalendarPicker from '../components/schedule/CalendarPicker';
import ScheduleForm from '../components/forms/ScheduleForm';

export default function SchedulePage() {
  const { weeklyAvailability, getDateAvailability, loading } = useCalendarAvailability();
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleSelectDate = (dateStr, status, dayOfWeek) => {
    setSelectedDate(`${dayOfWeek}, ${dateStr} (${status})`);
  };

  return (
    <section className="section" id="schedule">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Service schedule</span>
          <h2>Choose your service day.</h2>
          <p>
            We route by neighborhood to ensure consistent, reliable service rain or shine.
            Pick an open date on our calendar to book your visit.
          </p>
        </div>

        <div className="schedule-grid">
          <div>
            <CalendarPicker
              getDateAvailability={getDateAvailability}
              selectedDate={selectedDate.split(' ')[1] || ''}
              onSelectDate={handleSelectDate}
              loading={loading}
            />
          </div>

          <div>
            <ScheduleForm
              availability={weeklyAvailability}
              selectedDate={selectedDate}
              onClearDate={() => setSelectedDate('')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
