import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useAvailability() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .order('day_order', { ascending: true });

      if (error) throw error;
      setAvailability(data || []);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError(err.message || 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAvailability = async (updates) => {
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
      console.error('Error updating availability:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return { availability, loading, error, refetch: fetchAvailability, updateAvailability };
}

