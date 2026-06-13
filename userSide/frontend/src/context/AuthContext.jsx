/**
 * AuthContext.jsx
 * Place at: src/context/AuthContext.jsx
 *
 * Wrap your app in AuthProvider in main.jsx:
 * import { AuthProvider } from './context/AuthContext';
 * <AuthProvider><App /></AuthProvider>
 */

import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // User state — null means not logged in
  const [user, setUser] = useState(null);
  // Token state
  const [token, setToken] = useState(null);
  // Loading state — true while checking localStorage on app start
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  /**
   * On app start — check if user was already logged in
   * Read token and user from localStorage
   */
  useEffect(() => {
    console.log('AuthContext: Checking localStorage for existing session...');
    const savedToken = localStorage.getItem('butterBowlToken');
    const savedUser = localStorage.getItem('butterBowlUser');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        console.log('AuthContext: Found existing session for:', parsedUser.name);
      } catch {
        // If localStorage data is corrupted, clear it
        console.log('AuthContext: Corrupted session data, clearing...');
        localStorage.removeItem('butterBowlToken');
        localStorage.removeItem('butterBowlUser');
      }
    } else {
      console.log('AuthContext: No existing session found');
    }

    // Done checking
    setIsAuthLoading(false);
  }, []);

  /**
   * Login function — call this after successful login/register API call
   * Saves token and user to state and localStorage
   */
  const login = (newToken, newUser) => {
    console.log('AuthContext: Logging in user:', newUser.name);
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('butterBowlToken', newToken);
    localStorage.setItem('butterBowlUser', JSON.stringify(newUser));
  };

  /**
   * Logout function — clears everything
   */
  const logout = () => {
    console.log('AuthContext: Logging out user');
    setToken(null);
    setUser(null);
    localStorage.removeItem('butterBowlToken');
    localStorage.removeItem('butterBowlUser');
  };

  // isLoggedIn — true if user and token both exist
  const isLoggedIn = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        isAuthLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth hook — use this in any component to access auth state
 * Example: const { user, isLoggedIn, logout } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;