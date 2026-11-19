import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ktffbvofphhstlnjgjjo.supabase.co';
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_cWumcarcxCV4weKVJdHQ3w_0WwLj6sd';

// Client-safe Supabase client (only uses anon key, respects Row Level Security)
export const supabase = createClient(supabaseUrl, supabaseKey);
