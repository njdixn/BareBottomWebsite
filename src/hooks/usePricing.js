import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function usePricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPricing = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Ensure active and show_price default to true if missing/null
      const formatted = (data || []).map((p) => ({
        ...p,
        short_name: p.short_name || p.plan_name?.split(' ')[0] || 'Plan',
        active: p.active !== false,
        show_price: p.show_price !== false
      }));

      setPlans(formatted);
    } catch (err) {
      console.error('Error fetching pricing:', err);
      setError(err.message || 'Failed to load pricing');
    } finally {
      setLoading(false);
    }
  }, []);

  const addPlan = async (customPlan) => {
    try {
      const nextSortOrder = plans.length > 0 ? Math.max(...plans.map(p => p.sort_order || 0)) + 1 : 1;
      const newPlan = {
        plan_name: customPlan?.plan_name || `New Plan ${nextSortOrder}`,
        short_name: customPlan?.short_name || customPlan?.plan_name?.split(' ')[0] || `Plan ${nextSortOrder}`,
        price: customPlan?.price ?? 99,
        price_suffix: customPlan?.price_suffix || '/mo',
        features: customPlan?.features || ['Weekly skim & vacuum', 'Chemical test & balance'],
        featured: false,
        active: true,
        show_price: true,
        sort_order: nextSortOrder
      };

      // Try inserting with active, show_price, and short_name first
      let { data, error } = await supabase.from('pricing').insert([newPlan]).select();

      if (error && (error.message?.includes('active') || error.message?.includes('show_price') || error.message?.includes('short_name'))) {
        // Fallback without newly-added columns if not yet run in Supabase
        const { active, show_price, short_name, ...fallbackPlan } = newPlan;
        const res = await supabase.from('pricing').insert([fallbackPlan]).select();
        data = res.data;
        error = res.error;
      }

      if (error) throw error;
      await fetchPricing();
      return { success: true, data };
    } catch (err) {
      console.error('Error adding pricing plan:', err);
      return { success: false, error: err.message };
    }
  };

  const deletePlan = async (id) => {
    try {
      const { error } = await supabase.from('pricing').delete().eq('id', id);
      if (error) throw error;
      await fetchPricing();
      return { success: true };
    } catch (err) {
      console.error('Error deleting plan:', err);
      return { success: false, error: err.message };
    }
  };

  const updatePricingPlans = async (updatedPlans) => {
    try {
      let schemaNotice = false;

      const promises = updatedPlans.map(async (plan) => {
        const payload = {
          plan_name: plan.plan_name?.trim() || 'Untitled Plan',
          short_name: plan.short_name?.trim() || plan.plan_name?.split(' ')[0]?.trim() || 'Plan',
          price: parseFloat(plan.price) || 0,
          price_suffix: plan.price_suffix?.trim() || '/mo',
          featured: Boolean(plan.featured),
          active: plan.active !== false,
          show_price: plan.show_price !== false,
          features: Array.isArray(plan.features) ? plan.features : []
        };

        let { error } = await supabase.from('pricing').update(payload).eq('id', plan.id);

        if (error && (error.message?.includes('active') || error.message?.includes('show_price') || error.message?.includes('short_name'))) {
          schemaNotice = true;
          const { active, show_price, short_name, ...fallbackPayload } = payload;
          const res = await supabase.from('pricing').update(fallbackPayload).eq('id', plan.id);
          error = res.error;
        }

        return { error };
      });

      const results = await Promise.all(promises);
      const failed = results.find(r => r.error);
      if (failed) throw failed.error;

      await fetchPricing();
      return {
        success: true,
        schemaNotice
      };
    } catch (err) {
      console.error('Error updating pricing:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  return {
    plans,
    loading,
    error,
    refetch: fetchPricing,
    addPlan,
    deletePlan,
    updatePricingPlans
  };
}
