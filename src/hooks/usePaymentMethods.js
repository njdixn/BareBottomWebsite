import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_PAYMENTS = [
  {
    id: 'venmo',
    title: 'Venmo',
    handle: '@barebottomspa',
    instructions: 'Please include your service invoice number or address in payment note.',
    active: true,
    sort_order: 1
  },
  {
    id: 'paypal',
    title: 'PayPal',
    handle: 'barebottomspa@gmail.com',
    instructions: 'Send via Friends & Family or standard invoice link.',
    active: true,
    sort_order: 2
  },
  {
    id: 'zelle',
    title: 'Zelle',
    handle: '509-201-3467',
    instructions: 'Direct bank-to-bank transfer to Bare Bottom Pool & Spa.',
    active: true,
    sort_order: 3
  },
  {
    id: 'check',
    title: 'Check / Cash',
    handle: 'In person or by mail',
    instructions: 'Payable to Bare Bottom Pool & Spa LLC upon service visit.',
    active: true,
    sort_order: 4
  }
];

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState(DEFAULT_PAYMENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('Using default payment methods (table not found):', error.message);
      } else if (data && data.length > 0) {
        setPaymentMethods(data);
      }
    } catch (err) {
      console.warn('Error fetching payment methods:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPaymentMethod = async (newMethod = { title: 'CashApp', handle: '$barebottomspa', instructions: '', active: true }) => {
    try {
      const nextSort = paymentMethods.length + 1;
      const item = { ...newMethod, sort_order: nextSort };

      const { data, error } = await supabase.from('payment_methods').insert([item]).select();
      if (!error && data) {
        await fetchPaymentMethods();
        return { success: true, data };
      } else {
        setPaymentMethods((prev) => [...prev, { id: Date.now(), ...item }]);
        return { success: true };
      }
    } catch (err) {
      console.error('Error adding payment method:', err);
      return { success: false, error: err.message };
    }
  };

  const updatePaymentMethods = async (updatedList) => {
    try {
      setPaymentMethods(updatedList);

      const promises = updatedList.map(async (method) => {
        if (typeof method.id === 'number') {
          return supabase.from('payment_methods').update({
            title: method.title,
            handle: method.handle,
            instructions: method.instructions,
            active: method.active
          }).eq('id', method.id);
        } else {
          return supabase.from('payment_methods').upsert({
            title: method.title,
            handle: method.handle,
            instructions: method.instructions,
            active: method.active,
            sort_order: method.sort_order || 1
          });
        }
      });

      await Promise.all(promises);
      await fetchPaymentMethods();
      return { success: true };
    } catch (err) {
      console.error('Error updating payment methods:', err);
      return { success: false, error: err.message };
    }
  };

  const deletePaymentMethod = async (id) => {
    try {
      if (typeof id === 'number') {
        await supabase.from('payment_methods').delete().eq('id', id);
      }
      setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting payment method:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  return {
    paymentMethods,
    loading,
    error,
    addPaymentMethod,
    updatePaymentMethods,
    deletePaymentMethod,
    refetch: fetchPaymentMethods
  };
}

