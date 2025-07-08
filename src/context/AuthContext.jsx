import React, { createContext, useContext, useEffect, useState } from 'react';
import storageClient, { 
  getCurrentUser, 
  getCurrentSession, 
  signOut, 
  isUsingSupabase,
  setUseSupabase
} from '../lib/storageAdapter';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session from the storage adapter
    const getInitialSession = async () => {
      try {
        const currentSession = await getCurrentSession();
        const currentUser = await getCurrentUser();
        
        setSession(currentSession);
        setUser(currentUser);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = storageClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add ability to toggle storage backend in the context
  const toggleStorageBackend = (useSupabase) => {
    setUseSupabase(useSupabase);
  };

  const value = {
    user,
    session,
    loading,
    logout,
    isAuthenticated: !!user,
    isUsingSupabase: isUsingSupabase(),
    toggleStorageBackend
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};