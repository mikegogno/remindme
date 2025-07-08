import supabase, * as supabaseApi from './supabaseClient';
import localStorageClient, * as localStorageApi from './localStorageClient';

// This can be toggled by the application or set via environment variables
// For now, we'll initialize it to false since Supabase is disabled
let useSupabase = false;

// Function to toggle which backend we're using
export const setUseSupabase = (value) => {
  useSupabase = !!value;
  console.log(`Storage adapter set to use ${useSupabase ? 'Supabase' : 'localStorage'}`);
  return useSupabase;
};

export const isUsingSupabase = () => useSupabase;

// Re-export all API functions with automatic switching based on useSupabase flag
export const getCurrentUser = async () => {
  return useSupabase
    ? await supabaseApi.getCurrentUser()
    : await localStorageApi.getCurrentUser();
};

export const getCurrentSession = async () => {
  return useSupabase
    ? await supabaseApi.getCurrentSession()
    : await localStorageApi.getCurrentSession();
};

export const signIn = async (email, password) => {
  return useSupabase
    ? await supabaseApi.signIn(email, password)
    : await localStorageApi.signIn(email, password);
};

export const signUp = async (email, password) => {
  return useSupabase
    ? await supabaseApi.signUp(email, password)
    : await localStorageApi.signUp(email, password);
};

export const signOut = async () => {
  return useSupabase
    ? await supabaseApi.signOut()
    : await localStorageApi.signOut();
};

export const getReminders = async (userId) => {
  return useSupabase
    ? await supabaseApi.getReminders(userId)
    : await localStorageApi.getReminders(userId);
};

export const createReminder = async (reminder) => {
  return useSupabase
    ? await supabaseApi.createReminder(reminder)
    : await localStorageApi.createReminder(reminder);
};

export const updateReminder = async (id, updates) => {
  return useSupabase
    ? await supabaseApi.updateReminder(id, updates)
    : await localStorageApi.updateReminder(id, updates);
};

export const deleteReminder = async (id) => {
  return useSupabase
    ? await supabaseApi.deleteReminder(id)
    : await localStorageApi.deleteReminder(id);
};

// Default export is either the supabase client or localStorage client
const storageClient = {
  get client() {
    return useSupabase ? supabase : localStorageClient;
  },
  // Pass through methods for auth
  auth: {
    getUser: async () => {
      return useSupabase
        ? await supabase.auth.getUser()
        : await localStorageClient.auth.getUser();
    },
    getSession: async () => {
      return useSupabase
        ? await supabase.auth.getSession()
        : await localStorageClient.auth.getSession();
    },
    signInWithPassword: async (credentials) => {
      return useSupabase
        ? await supabase.auth.signInWithPassword(credentials)
        : await localStorageClient.auth.signInWithPassword(credentials);
    },
    signUp: async (credentials) => {
      return useSupabase
        ? await supabase.auth.signUp(credentials)
        : await localStorageClient.auth.signUp(credentials);
    },
    signOut: async () => {
      return useSupabase
        ? await supabase.auth.signOut()
        : await localStorageClient.auth.signOut();
    },
    onAuthStateChange: (callback) => {
      return useSupabase
        ? supabase.auth.onAuthStateChange(callback)
        : localStorageClient.auth.onAuthStateChange(callback);
    }
  },
  // Method to access tables
  from: (tableName) => {
    return useSupabase
      ? supabase.from(tableName)
      : localStorageClient.from(tableName);
  }
};

export default storageClient;