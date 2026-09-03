import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useSpecials(activeOnly = false) {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpecials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let query = supabase
        .from('specials')
        .select('*')
        .order('sort_order', { ascending: true });

      if (activeOnly) {
        query = query.eq('active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSpecials(data || []);
    } catch (err) {
      console.error('Error fetching specials:', err);
      setError(err.message || 'Failed to load specials');
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  const addSpecial = async (newSpecial = { title: 'New special', description: 'Describe the offer here.', active: false, sort_order: 99 }) => {
    try {
      const { data, error } = await supabase.from('specials').insert([newSpecial]).select();
      if (error) throw error;
      await fetchSpecials();
      return { success: true, data };
    } catch (err) {
      console.error('Error adding special:', err);
      return { success: false, error: err.message };
    }
  };

  const updateSpecials = async (updatedSpecials) => {
    try {
      const promises = updatedSpecials.map(({ id, title, description, active }) =>
        supabase.from('specials').update({ title, description, active }).eq('id', id)
      );
      const results = await Promise.all(promises);
      const failed = results.find(r => r.error);
      if (failed) throw failed.error;
      await fetchSpecials();
      return { success: true };
    } catch (err) {
      console.error('Error updating specials:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteSpecial = async (id) => {
    try {
      const { error } = await supabase.from('specials').delete().eq('id', id);
      if (error) throw error;
      await fetchSpecials();
      return { success: true };
    } catch (err) {
      console.error('Error deleting special:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchSpecials();
  }, [fetchSpecials]);

  return {
    specials,
    loading,
    error,
    refetch: fetchSpecials,
    addSpecial,
    updateSpecials,
    deleteSpecial
  };
}

