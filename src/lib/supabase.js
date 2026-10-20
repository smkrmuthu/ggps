import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kpfnodbbmguqblbhrzqj.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZm5vZGJibWd1cWJsYmhyenFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NzQzNjAsImV4cCI6MjEwNzA1MDM2MH0.t4vu2PukFarWMpz3bt5Bvt7DelaoXoknSwQjwJn8DOg';

export const sb = SUPABASE_URL && SUPABASE_URL.startsWith('http')
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;
