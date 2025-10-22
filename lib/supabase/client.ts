import { createClient as createClientOriginal, SupabaseClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase';

// Environment variable validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment configuration.');
}

// Singleton instance to prevent multiple GoTrueClient warnings
let supabaseInstance: SupabaseClient<Database> | null = null;

// Export the Supabase client
export const createClient = () => {
  // Return existing instance if available (browser only)
  if (typeof window !== 'undefined' && supabaseInstance) {
    return supabaseInstance;
  }

  // Create new instance
  const client = createClientOriginal<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce', // Use PKCE flow for better security
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'docverse-auth',
    }
  });

  // Store instance for reuse (browser only)
  if (typeof window !== 'undefined') {
    supabaseInstance = client;
  }

  return client;
};
