import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const FULL_DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function CalendarPicker({
  getDateAvailability,
  selectedDate,
  onSelectDate,
  loading = false
}) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)

  const calendarDays = [];
  // Leading empty slots
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push({ empty: true, id: `empty-${i}` });
  }

  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(currentYear, currentMonth, day);
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = FULL_DAY_NAMES[d.getDay()];
    const status = getDateAvailability ? getDateAvailability(dateStr, dayOfWeek) : 'Open';

    // Is it in past?
    const isPast = new Date(currentYear, currentMonth, day, 23, 59, 59) < today;
    const isToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    calendarDays.push({
      empty: false,
      day,
      dateStr,
      dayOfWeek,
      status,
      isPast,
      isToday,
      id: dateStr
    });
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <span className="cal-badge" style={{ background: '#e5f8ee', color: '#1c8a53' }}>Open</span>;
      case 'Limited':
        return <span className="cal-badge" style={{ background: '#fff4e0', color: '#b5790a' }}>Few</span>;
      case 'Full':
        return <span className="cal-badge" style={{ background: '#fde8e5', color: '#c0442c' }}>Full</span>;
      case 'Blocked':
      default:
        return <span className="cal-badge" style={{ background: '#f0f4f4', color: '#7a9499' }}>Off</span>;
    }
  };

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <div>
          <h3>{MONTH_NAMES[currentMonth]} {currentYear}</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
            Select an open date to request service
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button type="button" onClick={prevMonth} className="calendar-nav-btn" aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={nextMonth} className="calendar-nav-btn" aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '30px 0', fontSize: '0.85rem' }}>
          Loading calendar availability…
        </p>
      ) : (
        <>
          <div className="calendar-weekdays">
            {WEEKDAYS.map((wd) => (
              <div key={wd}>{wd}</div>
            ))}
          </div>

          <div className="calendar-days-grid">
            {calendarDays.map((cell) => {
              if (cell.empty) {
                return <div key={cell.id} className="calendar-day-cell empty" />;
              }

              const isSelected = selectedDate === cell.dateStr;
              const isClickable = !cell.isPast && cell.status !== 'Blocked';

              return (
                <button
                  type="button"
                  key={cell.id}
                  onClick={() => isClickable && onSelectDate && onSelectDate(cell.dateStr, cell.status, cell.dayOfWeek)}
                  className={`calendar-day-cell ${cell.isPast ? 'disabled' : ''} ${cell.status === 'Blocked' ? 'blocked' : ''} ${isSelected ? 'selected' : ''} ${cell.isToday ? 'today' : ''}`}
                  disabled={!isClickable}
                  title={`${cell.dayOfWeek}, ${cell.dateStr} - ${cell.status}`}
                >
                  <span style={{ fontSize: '0.86rem' }}>{cell.day}</span>
                  {!cell.isPast && getStatusBadge(cell.status)}
                </button>
              );
            })}
          </div>

          <div className="cal-legend">
            <div className="legend-item">
              <span className="cal-tag-open" /> <span>Open</span>
            </div>
            <div className="legend-item">
              <span className="cal-tag-limited" /> <span>Limited</span>
            </div>
            <div className="legend-item">
              <span className="cal-tag-full" /> <span>Full</span>
            </div>
            <div className="legend-item">
              <span className="cal-tag-blocked" /> <span>Unavailable</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

