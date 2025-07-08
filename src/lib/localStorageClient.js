// LocalStorage client to mimic Supabase API functionality when Supabase is not available
// This provides a consistent API surface for the application to use

// Unique prefix for all localStorage keys to avoid conflicts
const LS_PREFIX = 'remindme_app_';

// Helper to generate unique IDs
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Auth-related functions
export const getCurrentUser = async () => {
  const userJson = localStorage.getItem(`${LS_PREFIX}user`);
  return userJson ? JSON.parse(userJson) : null;
};

export const getCurrentSession = async () => {
  const sessionJson = localStorage.getItem(`${LS_PREFIX}session`);
  return sessionJson ? JSON.parse(sessionJson) : null;
};

export const signIn = async (email, password) => {
  // Check if user exists
  const usersJson = localStorage.getItem(`${LS_PREFIX}users`) || '{}';
  const users = JSON.parse(usersJson);
  
  if (users[email] && users[email].password === password) {
    const user = {
      id: users[email].id,
      email,
      user_metadata: users[email].user_metadata || {}
    };
    
    // Create a session
    const session = {
      access_token: `fake-token-${generateUniqueId()}`,
      user
    };
    
    // Store current user and session
    localStorage.setItem(`${LS_PREFIX}user`, JSON.stringify(user));
    localStorage.setItem(`${LS_PREFIX}session`, JSON.stringify(session));
    
    return { data: { user, session }, error: null };
  } else {
    return { data: null, error: { message: 'Invalid login credentials' } };
  }
};

export const signUp = async (email, password) => {
  // Check if user already exists
  const usersJson = localStorage.getItem(`${LS_PREFIX}users`) || '{}';
  const users = JSON.parse(usersJson);
  
  if (users[email]) {
    return { data: null, error: { message: 'User already exists' } };
  }
  
  // Create new user
  const userId = generateUniqueId();
  const newUser = {
    id: userId,
    email,
    password,
    user_metadata: {},
    created_at: new Date().toISOString()
  };
  
  users[email] = newUser;
  localStorage.setItem(`${LS_PREFIX}users`, JSON.stringify(users));
  
  // Create user data container
  localStorage.setItem(`${LS_PREFIX}reminders_${userId}`, JSON.stringify([]));
  
  // Auto sign-in after registration
  return signIn(email, password);
};

export const signOut = async () => {
  localStorage.removeItem(`${LS_PREFIX}user`);
  localStorage.removeItem(`${LS_PREFIX}session`);
  return { error: null };
};

// Database operations
export const getReminders = async (userId) => {
  try {
    const remindersJson = localStorage.getItem(`${LS_PREFIX}reminders_${userId}`) || '[]';
    const reminders = JSON.parse(remindersJson);
    return { data: reminders, error: null };
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return { data: null, error };
  }
};

export const createReminder = async (reminder) => {
  try {
    const { user_id } = reminder;
    const remindersJson = localStorage.getItem(`${LS_PREFIX}reminders_${user_id}`) || '[]';
    const reminders = JSON.parse(remindersJson);
    
    const newReminder = {
      ...reminder,
      id: generateUniqueId(),
      created_at: new Date().toISOString()
    };
    
    reminders.unshift(newReminder); // Add to beginning for reverse chronological order
    localStorage.setItem(`${LS_PREFIX}reminders_${user_id}`, JSON.stringify(reminders));
    
    return { data: newReminder, error: null };
  } catch (error) {
    console.error('Error creating reminder:', error);
    return { data: null, error };
  }
};

export const updateReminder = async (id, updates) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }
    
    const userId = user.id;
    const remindersJson = localStorage.getItem(`${LS_PREFIX}reminders_${userId}`) || '[]';
    const reminders = JSON.parse(remindersJson);
    
    const reminderIndex = reminders.findIndex(r => r.id === id);
    if (reminderIndex === -1) {
      return { data: null, error: { message: 'Reminder not found' } };
    }
    
    const updatedReminder = {
      ...reminders[reminderIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    reminders[reminderIndex] = updatedReminder;
    localStorage.setItem(`${LS_PREFIX}reminders_${userId}`, JSON.stringify(reminders));
    
    return { data: updatedReminder, error: null };
  } catch (error) {
    console.error('Error updating reminder:', error);
    return { data: null, error };
  }
};

export const deleteReminder = async (id) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }
    
    const userId = user.id;
    const remindersJson = localStorage.getItem(`${LS_PREFIX}reminders_${userId}`) || '[]';
    const reminders = JSON.parse(remindersJson);
    
    const updatedReminders = reminders.filter(r => r.id !== id);
    localStorage.setItem(`${LS_PREFIX}reminders_${userId}`, JSON.stringify(updatedReminders));
    
    return { data: { id }, error: null };
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return { data: null, error };
  }
};

// Mock Supabase client object structure for compatibility
const localStorageClient = {
  auth: {
    getUser: async () => {
      const user = await getCurrentUser();
      return { data: { user }, error: null };
    },
    getSession: async () => {
      const session = await getCurrentSession();
      return { data: { session }, error: null };
    },
    signInWithPassword: async ({ email, password }) => {
      return signIn(email, password);
    },
    signUp: async ({ email, password }) => {
      return signUp(email, password);
    },
    signOut: async () => {
      return signOut();
    },
    onAuthStateChange: () => {
      // This is a simplified version that doesn't actually listen for changes
      // In a real implementation, we would use events
      const subscription = {
        unsubscribe: () => {}
      };
      return { data: { subscription } };
    }
  },
  from: (table) => ({
    select: () => ({
      eq: (column, value) => ({
        order: () => ({
          async then(resolve) {
            if (table === 'app_8eq3vd_reminders' && column === 'user_id') {
              const { data, error } = await getReminders(value);
              resolve({ data, error });
            } else {
              resolve({ data: [], error: null });
            }
          }
        })
      })
    }),
    insert: (items) => ({
      select: () => ({
        single: async () => {
          if (table === 'app_8eq3vd_reminders') {
            return createReminder(items[0]);
          }
          return { data: null, error: { message: 'Operation not supported' } };
        }
      })
    }),
    update: (updates) => ({
      eq: (column, value) => ({
        select: () => ({
          single: async () => {
            if (table === 'app_8eq3vd_reminders' && column === 'id') {
              return updateReminder(value, updates);
            }
            return { data: null, error: { message: 'Operation not supported' } };
          }
        })
      })
    }),
    delete: () => ({
      eq: (column, value) => {
        if (table === 'app_8eq3vd_reminders' && column === 'id') {
          return deleteReminder(value);
        }
        return { data: null, error: { message: 'Operation not supported' } };
      }
    })
  })
};

export default localStorageClient;