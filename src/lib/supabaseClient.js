import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://oqoxyqldekhpaneeivnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xb3h5cWxkZWtocGFuZWVpdm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODU2MzQsImV4cCI6MjA2MjU2MTYzNH0.8Hl23O77ZCbHF3n19MAjf-JpBscWjSQtSTpP93fesns';

// Create the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email, password) => {
  return await supabase.auth.signUp({ 
    email, 
    password, 
    options: { 
      emailRedirectTo: window.location.origin 
    } 
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Database operations
export const getReminders = async (userId) => {
  const { data, error } = await supabase
    .from('app_8eq3vd_reminders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const createReminder = async (reminder) => {
  const { data, error } = await supabase
    .from('app_8eq3vd_reminders')
    .insert([reminder])
    .select()
    .single();
  
  return { data, error };
};

export const updateReminder = async (id, updates) => {
  const { data, error } = await supabase
    .from('app_8eq3vd_reminders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

export const deleteReminder = async (id) => {
  const { data, error } = await supabase
    .from('app_8eq3vd_reminders')
    .delete()
    .eq('id', id);
  
  return { data, error };
};

export { supabase };
export default supabase;