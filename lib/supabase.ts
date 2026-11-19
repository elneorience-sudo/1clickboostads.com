import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ktffbvofphhstlnjgjjo.supabase.co';
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_cWumcarcxCV4weKVJdHQ3w_0WwLj6sd';
export const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZmZidm9mcGhoc3RsbmpnampvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODk2NDY1MiwiZXhwIjoyMTA0NTQwNjUyfQ.Ju_mWgk_HfVvSchY0kbjE5yDyny5RcnBzNVZMbfFUNY';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
