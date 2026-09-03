import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitLead = async (leadData) => {
    try {
      const { data, error } = await supabase.from('leads').insert([leadData]).select();
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error('Error submitting lead:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { leads, loading, error, refetch: fetchLeads, submitLead };
}

