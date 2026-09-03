import React, { useState } from 'react';
import { useCalendarAvailability } from '../../hooks/useCalendarAvailability';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckSquare } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const FULL_DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];
const STATUS_OPTIONS = ['Open', 'Limited', 'Full', 'Blocked'];

export default function AdminAvailability() {
  const {
    weeklyAvailability,
    dateOverrides,
    getDateAvailability,
    setDatesStatus,
    updateWeeklyPatterns,
    loading
  } = useCalendarAvailability();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Date selection state
  const [selectedDates, setSelectedDates] = useState([]); // ['YYYY-MM-DD', ...]
  const [statusToApply, setStatusToApply] = useState('Open');
  const [savingDates, setSavingDates] = useState(false);
  const [dateStatusMsg, setDateStatusMsg] = useState({ message: '', type: '' });

  // Weekly baseline state
  const [localWeekly, setLocalWeekly] = useState(weeklyAvailability);
  const [savingWeekly, setSavingWeekly] = useState(false);
  const [weeklyStatusMsg, setWeeklyStatusMsg] = useState({ message: '', type: '' });

  // Sync weekly when loaded
  React.useEffect(() => {
    if (weeklyAvailability) setLocalWeekly(weeklyAvailability);
  }, [weeklyAvailability]);

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

  const toggleDateSelection = (dateStr) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  };

  const selectAllMonth = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const all = [];
    for (let d = 1; d <= daysInMonth; d++) {
      all.push(
        `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      );
    }
    setSelectedDates(all);
  };

  const clearSelection = () => setSelectedDates([]);

  const handleApplyDateStatus = async () => {
    if (selectedDates.length === 0) return;

    setSavingDates(true);
    setDateStatusMsg({ message: 'Saving…', type: '' });

    const entries = selectedDates.map((d) => ({
      date: d,
      status: statusToApply
    }));

    const res = await setDatesStatus(entries);

    if (res.success) {
      setDateStatusMsg({
        message: `Updated ${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} to "${statusToApply}" ✓`,
        type: 'ok'
      });
      setSelectedDates([]);
    } else {
      setDateStatusMsg({ message: `Save failed: ${res.error}`, type: 'err' });
    }

    setSavingDates(false);
  };

  const handleSaveWeekly = async () => {
    setSavingWeekly(true);
    setWeeklyStatusMsg({ message: 'Saving…', type: '' });

    const updates = localWeekly.map((w) => ({ id: w.id, status: w.status }));
    const res = await updateWeeklyPatterns(updates);

    if (res.success) {
      setWeeklyStatusMsg({ message: 'Weekly defaults saved ✓', type: 'ok' });
    } else {
      setWeeklyStatusMsg({ message: 'Save failed', type: 'err' });
    }

    setSavingWeekly(false);
  };

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push({ empty: true, id: `empty-${i}` });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(currentYear, currentMonth, day);
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = FULL_DAY_NAMES[d.getDay()];
    const status = getDateAvailability(dateStr, dayOfWeek);
    const hasOverride = Boolean(dateOverrides[dateStr]);

    calendarDays.push({
      empty: false,
      day,
      dateStr,
      dayOfWeek,
      status,
      hasOverride,
      id: dateStr
    });
  }

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarIcon size={18} color="var(--teal)" />
            <span>Calendar Date Availability</span>
          </h3>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '.85rem' }}>
            Click specific dates to customize availability (Open, Limited, Full, or Blocked/Off).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={selectAllMonth}
            style={{
              background: 'none',
              border: '1px solid var(--border-light)',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '0.78rem',
              color: 'var(--navy)',
              cursor: 'pointer'
            }}
          >
            Select All
          </button>
          {selectedDates.length > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              Clear ({selectedDates.length})
            </button>
          )}
        </div>
      </div>

      {/* Calendar Header Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '18px 0 12px' }}>
        <h4 style={{ fontSize: '1.05rem', margin: 0 }}>
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h4>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button type="button" onClick={prevMonth} className="calendar-nav-btn" aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={nextMonth} className="calendar-nav-btn" aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Weekdays */}
      <div className="calendar-weekdays">
        {WEEKDAYS.map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-days-grid">
        {calendarDays.map((cell) => {
          if (cell.empty) return <div key={cell.id} className="calendar-day-cell empty" />;

          const isSelected = selectedDates.includes(cell.dateStr);

          return (
            <button
              type="button"
              key={cell.id}
              onClick={() => toggleDateSelection(cell.dateStr)}
              className={`calendar-day-cell ${isSelected ? 'selected' : ''}`}
              style={{
                border: isSelected
                  ? '2px solid var(--coral)'
                  : cell.hasOverride
                  ? '1.5px solid var(--teal)'
                  : '1px solid #eef4f3',
                background: isSelected ? '#fdf0f2' : cell.hasOverride ? '#f2faf9' : 'white'
              }}
              title={`${cell.dateStr} (${cell.status}) - click to select`}
            >
              <span style={{ fontSize: '0.84rem' }}>{cell.day}</span>
              <span
                className="cal-badge"
                style={{
                  background:
                    cell.status === 'Open'
                      ? '#e5f8ee'
                      : cell.status === 'Limited'
                      ? '#fff4e0'
                      : cell.status === 'Full'
                      ? '#fde8e5'
                      : '#f0f4f4',
                  color:
                    cell.status === 'Open'
                      ? '#1c8a53'
                      : cell.status === 'Limited'
                      ? '#b5790a'
                      : cell.status === 'Full'
                      ? '#c0442c'
                      : '#7a9499'
                }}
              >
                {cell.status}
              </span>
            </button>
          );
        })}
      </div>

      {/* Date action bar */}
      <div
        style={{
          marginTop: '16px',
          padding: '14px 16px',
          background: selectedDates.length > 0 ? '#f0f7f6' : '#fafcfc',
          borderRadius: '12px',
          border: '1px solid #e3eeed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--navy)' }}>
            {selectedDates.length > 0 ? `Selected (${selectedDates.length}) → Set to:` : 'Select dates on calendar to edit:'}
          </span>
          <select
            value={statusToApply}
            onChange={(e) => setStatusToApply(e.target.value)}
            disabled={selectedDates.length === 0}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #d8e6e5',
              fontWeight: 600,
              fontSize: '0.82rem'
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="save-btn"
            onClick={handleApplyDateStatus}
            disabled={selectedDates.length === 0 || savingDates}
            style={{ padding: '8px 18px', fontSize: '0.84rem' }}
          >
            {savingDates ? 'Saving…' : 'Apply to Selected'}
          </button>
          {dateStatusMsg.message && (
            <span className={`status-msg ${dateStatusMsg.type}`}>{dateStatusMsg.message}</span>
          )}
        </div>
      </div>

      {/* Collapsible Weekly Default Patterns */}
      <details style={{ marginTop: '24px', borderTop: '1px solid #eef4f3', paddingTop: '16px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.92rem', color: 'var(--teal)' }}>
          ⚙️ Edit Weekly Default Route Patterns (Monday – Saturday)
        </summary>
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: '8px 0 14px' }}>
          These are the fallback statuses used for any calendar date that doesn't have a custom override.
        </p>
        <div>
          {localWeekly.map((day) => (
            <div className="avail-row" key={day.id || day.day_name}>
              <span className="name">{day.day_name}</span>
              <select
                value={day.status}
                onChange={(e) =>
                  setLocalWeekly((prev) =>
                    prev.map((d) => (d.id === day.id ? { ...d, status: e.target.value } : d))
                  )
                }
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="card-footer" style={{ marginTop: '12px' }}>
          <button className="save-btn" onClick={handleSaveWeekly} disabled={savingWeekly}>
            {savingWeekly ? 'Saving…' : 'Save Weekly Defaults'}
          </button>
          {weeklyStatusMsg.message && (
            <span className={`status-msg ${weeklyStatusMsg.type}`}>{weeklyStatusMsg.message}</span>
          )}
        </div>
      </details>
    </div>
  );
}
