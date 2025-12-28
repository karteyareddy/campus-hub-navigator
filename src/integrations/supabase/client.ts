import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://izkehvmmnufmvkfvhekx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6a2Vodm1tbnVmbXZrZnZoZWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4ODgxNzEsImV4cCI6MjA4MjQ2NDE3MX0.iUlJQ3TpFhcu7ILB-FePGw356lOFQFwD5Zj5rrAb1pg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
