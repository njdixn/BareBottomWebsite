// ============================================
// Shared Supabase client for the public site.
// The anon/public key is safe to expose in client-side code —
// it only allows what the database's row-level security policies permit.
// ============================================

const SUPABASE_URL = 'https://lqtavczcxfivertfanif.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__eIIFUFHCyso4jruBxNV7A_aoCDFkYh';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
