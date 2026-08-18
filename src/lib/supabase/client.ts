import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return null or placeholder if credentials are missing
    return createBrowserClient(
      'https://placeholder-project.supabase.co',
      'placeholder-key'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
