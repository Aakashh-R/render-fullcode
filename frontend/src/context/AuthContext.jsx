// src/context/AuthContext.js
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { apiGet, apiPost } from '../api.js'; // adjust path as needed

export const AuthContext = createContext();

export const DEFAULT_SENDGRID_FROM =
  import.meta.env.VITE_SENDGRID_FROM || 'Docs System <fromexpo@gmail.com>';

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized));
    return decoded;
  } catch (e) {
    return null;
  }
}

function normalizeRole(role) {
  if (!role) return '';
  return String(role).trim().toLowerCase();
}

const DEFAULT_ROLE_ALIASES = {
  shipper: ['shipper', 'shp', 'shipping', 'shipping_staff', 'shipper_user'],
  admin: ['admin', 'administrator', 'superadmin'],
  viewer: ['viewer', 'read-only', 'readonly'],
};

function roleHasPermission(roleRaw, permission) {
  const role = normalizeRole(roleRaw);
  if (!role) return false;

  const permsByRole = {
    shipper: ['use_templates', 'send_docs', 'export_docs'],
    admin: ['use_templates', 'send_docs', 'export_docs', 'manage_templates'],
    viewer: ['use_templates'],
  };

  for (const [k, aliases] of Object.entries(DEFAULT_ROLE_ALIASES)) {
    if (aliases.includes(role)) {
      return (permsByRole[k] || []).includes(permission);
    }
  }

  if (permsByRole[role]) return permsByRole[role].includes(permission);

  return false;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const signIn = useCallback(async credentials => {
    setLoadingProfile(true);
    try {
      const res = await apiPost('/auth/login', credentials);
      if (res?.token) {
        setToken(res.token);
        if (res.user) setUser(res.user);
        else {
          const claims = parseJwt(res.token);
          if (claims) setUser(claims);
        }
      }
      setLoadingProfile(false);
      return res;
    } catch (err) {
      setLoadingProfile(false);
      throw err;
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const res = await apiGet('/auth/refresh');
      if (res?.token) setToken(res.token);
      return res;
    } catch (err) {
      signOut();
      throw err;
    }
  }, [signOut]);

  // NEW: login helper to match your Signup.jsx usage
  // Accepts either (userObj, tokenStr) OR a single { user, token } object
  const login = useCallback((userObj, tokenStr) => {
    if (!userObj) return;
    if (userObj && typeof userObj === 'object' && userObj.user && userObj.token) {
      setUser(userObj.user);
      setToken(userObj.token);
      return;
    }
    setUser(userObj);
    if (tokenStr) setToken(tokenStr);
  }, []);

  const hasPermission = useCallback(
    permission => {
      if (!user) return false;
      if (Array.isArray(user.roles)) {
        return user.roles.some(r => roleHasPermission(r, permission));
      }
      return roleHasPermission(user.role || user?.roleName, permission);
    },
    [user]
  );

  const contextValue = {
    user,
    setUser,
    token,
    setToken,
    loadingProfile,
    signIn,
    signOut,
    refreshToken,
    hasPermission,
    DEFAULT_SENDGRID_FROM,
    login, // <- added
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
