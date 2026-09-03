import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_SOCIALS = [
  { id: 'fb', platform: 'Facebook', url: 'https://facebook.com', active: true, sort_order: 1 },
  { id: 'ig', platform: 'Instagram', url: 'https://instagram.com', active: true, sort_order: 2 },
  { id: 'x', platform: 'X (Twitter)', url: 'https://x.com', active: true, sort_order: 3 },
  { id: 'tt', platform: 'TikTok', url: 'https://tiktok.com', active: true, sort_order: 4 }
];

export function useSocialLinks() {
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIALS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSocialLinks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        // Table might not exist yet; use local fallback without erroring out
        console.warn('Using default social links (table not found):', error.message);
      } else if (data && data.length > 0) {
        setSocialLinks(data);
      }
    } catch (err) {
      console.warn('Error fetching social links:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSocialLink = async (newLink = { platform: 'New Platform', url: 'https://', active: true }) => {
    try {
      const nextSort = socialLinks.length + 1;
      const item = { ...newLink, sort_order: nextSort };

      const { data, error } = await supabase.from('social_links').insert([item]).select();
      if (!error && data) {
        await fetchSocialLinks();
        return { success: true, data };
      } else {
        // Local fallback update
        setSocialLinks((prev) => [...prev, { id: Date.now(), ...item }]);
        return { success: true };
      }
    } catch (err) {
      console.error('Error adding social link:', err);
      return { success: false, error: err.message };
    }
  };

  const updateSocialLinks = async (updatedList) => {
    try {
      setSocialLinks(updatedList);

      const promises = updatedList.map(async (link) => {
        if (typeof link.id === 'number') {
          return supabase.from('social_links').update({
            platform: link.platform,
            url: link.url,
            active: link.active
          }).eq('id', link.id);
        } else {
          return supabase.from('social_links').upsert({
            platform: link.platform,
            url: link.url,
            active: link.active,
            sort_order: link.sort_order || 1
          });
        }
      });

      await Promise.all(promises);
      await fetchSocialLinks();
      return { success: true };
    } catch (err) {
      console.error('Error updating social links:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteSocialLink = async (id) => {
    try {
      if (typeof id === 'number') {
        await supabase.from('social_links').delete().eq('id', id);
      }
      setSocialLinks((prev) => prev.filter((l) => l.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting social link:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, [fetchSocialLinks]);

  return {
    socialLinks,
    loading,
    error,
    addSocialLink,
    updateSocialLinks,
    deleteSocialLink,
    refetch: fetchSocialLinks
  };
}

