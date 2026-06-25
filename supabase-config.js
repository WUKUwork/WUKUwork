const supabaseUrl = 'https://qrfflkfcmiybgtcysupg.supabase.co';
const supabaseKey = 'sb_publishable_WxEHfw7blMpchHp7EZOrRw_gGGQyo2H';

const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});