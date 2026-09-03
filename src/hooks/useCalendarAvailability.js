import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Default weekly fallback if db is empty
const DEFAULT_WEEKLY = [
  { id: 1, day_name: 'Monday', day_order: 1, status: 'Limited' },
  { id: 2, day_name: 'Tuesday', day_order: 2, status: 'Open' },
  { id: 3, day_name: 'Wednesday', day_order: 3, status: 'Open' },
  { id: 4, day_name: 'Thursday', day_order: 4, status: 'Full' },
  { id: 5, day_name: 'Friday', day_order: 5, status: 'Open' },
  { id: 6, day_name: 'Saturday', day_order: 6, status: 'Limited' },
  { id: 7, day_name: 'Sunday', day_order: 7, status: 'Blocked' }
];

export function useCalendarAvailability() {
  const [weeklyAvailability, setWeeklyAvailability] = useState(DEFAULT_WEEKLY);
  const [dateOverrides, setDateOverrides] = useState({}); // { 'YYYY-MM-DD': { status, note } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch weekly defaults
      const { data: weeklyData } = await supabase
        .from('availability')
        .select('*')
        .order('day_order', { ascending: true });

      if (weeklyData && weeklyData.length > 0) {
        setWeeklyAvailability(weeklyData);
      }

      // 2. Fetch specific date overrides
      const { data: dateData, error: dateErr } = await supabase
        .from('date_availability')
        .select('*');

      if (!dateErr && dateData) {
        const map = {};
        dateData.forEach((item) => {
          map[item.date] = { status: item.status, note: item.note, id: item.id };
        });
        setDateOverrides(map);
      }
    } catch (err) {
      console.error('Error loading calendar availability:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to determine status of any specific date (YYYY-MM-DD)
  const getDateAvailability = useCallback((dateStr, dayOfWeek) => {
    // Check specific date override first
    if (dateOverrides[dateStr]) {
      return dateOverrides[dateStr].status;
    }

    // Sunday is blocked by default unless specified
    if (dayOfWeek === 'Sunday') {
      const sun = weeklyAvailability.find(w => w.day_name === 'Sunday');
      return sun ? sun.status : 'Blocked';
    }

    // Check weekly pattern baseline
    const match = weeklyAvailability.find(w => w.day_name === dayOfWeek);
    return match ? match.status : 'Open';
  }, [dateOverrides, weeklyAvailability]);

  // Set status for specific dates
  const setDatesStatus = async (dateEntries) => {
    try {
      const promises = dateEntries.map(async ({ date, status, note = '' }) => {
        // Upsert into date_availability
        const { error } = await supabase
          .from('date_availability')
          .upsert({ date, status, note }, { onConflict: 'date' });
        return { error };
      });

      const results = await Promise.all(promises);
      const failed = results.find(r => r.error);
      if (failed && !failed.error?.message?.includes('does not exist')) {
        throw failed.error;
      }

      // Local optimistic update
      setDateOverrides((prev) => {
        const next = { ...prev };
        dateEntries.forEach(e => {
          next[e.date] = { status: e.status, note: e.note || '' };
        });
        return next;
      });

      return { success: true };
    } catch (err) {
      console.error('Error setting date status:', err);
      return { success: false, error: err.message };
    }
  };

  // Update weekly baseline patterns
  const updateWeeklyPatterns = async (updates) => {
    try {
      const promises = updates.map(({ id, status }) =>
        supabase.from('availability').update({ status }).eq('id', id)
      );
      const results = await Promise.all(promises);
      const failed = results.find(r => r.error);
      if (failed) throw failed.error;
      await fetchAvailability();
      return { success: true };
    } catch (err) {
      console.error('Error updating weekly patterns:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return {
    weeklyAvailability,
    dateOverrides,
    loading,
    error,
    getDateAvailability,
    setDatesStatus,
    updateWeeklyPatterns,
    refetch: fetchAvailability
  };
}

