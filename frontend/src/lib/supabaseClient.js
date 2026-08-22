import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sgrhibwrogtutmxhzlmp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// The Supabase JS SDK requires the JWT anon key (starts with eyJ...).
// The sb_publishable_ key is NOT compatible and will cause 400 errors on every API call.
if (supabaseAnonKey.startsWith('sb_publishable_')) {
  console.error(
    '❌ [GlobeTrotter] VITE_SUPABASE_ANON_KEY is set to a publishable key (sb_publishable_...) ' +
    'which is NOT valid for the Supabase JS SDK. ' +
    'Use the JWT anon key (eyJ...) from Supabase Dashboard → Project Settings → API → anon/public.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
