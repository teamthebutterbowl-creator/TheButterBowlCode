import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const BASE_URL = 'http://localhost:5000';

const defaultSettings = {
  restaurant: {
    name: 'The Rustic Table',
    phone: '(415) 555-0123',
    logo: null,
  },
  admin: {
    name: '',
    email: '',
  },
  theme: 'light',
  codEnabled: true, 
};

const SettingsContext = createContext(null);

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
};

const getToken = () => localStorage.getItem('token');

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    ...defaultSettings,
    theme: localStorage.getItem('theme') || 'light',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    localStorage.setItem('theme', settings.theme);
  }, [settings.theme]);

  // ── Fetch admin info on mount ──────────────────────────────────────────────
  useEffect(() => {
    const fetchAdmin = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.data) return;
        setSettings((prev) => ({
          ...prev,
          admin: { name: data.data.name, email: data.data.email },
        }));
      } catch (err) {
        console.error('Failed to fetch admin info:', err);
      }
    };
    fetchAdmin();
  }, []);

  useEffect(() => {
    const fetchCOD = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/cod-status`);
        if (!res.ok) return;
        const data = await res.json();
        setSettings((prev) => ({ ...prev, codEnabled: data.data.codEnabled }));
      } catch (err) {
        console.error('Failed to fetch COD status:', err);
      }
    };
    fetchCOD();
  }, []);

  // ── Update local settings (theme, restaurant — local only for now) ─────────
  const updateSettings = useCallback((section, data) => {
    setSettings((prev) => {
      if (section === 'theme') return { ...prev, theme: data };
      return { ...prev, [section]: { ...prev[section], ...data } };
    });
  }, []);

  // ── Update admin profile (name + email) → hits backend ────────────────────
  const updateAdminProfile = useCallback(async ({ name, email }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      setSettings((prev) => ({
        ...prev,
        admin: { name: data.data.name, email: data.data.email },
      }));

      // Keep localStorage 'user' in sync so Header (and other components) reflect changes
      try {
        const storedUser = localStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : {};
        const updatedUser = { ...parsedUser, name: data.data.name, email: data.data.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('user-updated'));
      } catch (e) {
        console.error('Failed to sync localStorage user:', e);
      }

      return { success: true, message: 'Profile updated successfully' };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleCOD = useCallback(async (enabled) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/cod-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update COD');
      setSettings((prev) => ({ ...prev, codEnabled: enabled }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Change password → hits backend ────────────────────────────────────────
  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');
      return { success: true, message: 'Password changed successfully' };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch(`${BASE_URL}/api/admin/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }, []);

  // ── Delete account ─────────────────────────────────────────────────────────
  const deleteAccount = useCallback(async ({ password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete account');
      localStorage.removeItem('token');
      window.location.href = '/login';
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateAdminProfile,
        changePassword,
        logout,
        deleteAccount,
        toggleCOD, 
        loading,
        error,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;