import { createClient } from '@supabase/supabase-js';

const supabaseURL = process.env.PROJECT_API_URL;
const supabaseKey = process.env.ANON_KEY;

export const supabase = createClient(supabaseURL, supabaseKey);