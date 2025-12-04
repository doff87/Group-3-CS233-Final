import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api, { setAuthToken } from '../utils/apiClient';

type User = { id: string; email: string } | null;

interface AuthResult {
  ok: boolean;
  message?: string;
}

interface AuthContextType {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const t = localStorage.getItem('auth.token');
    const u = localStorage.getItem('auth.user');
    if (t) setToken(t);
    // ensure axios instance has token set on startup
    if (t) setAuthToken(t);
    if (u) {
      try { setUser(JSON.parse(u)); } catch (e) { setUser(null); }
    }
  }, []);

  const saveAuth = (t: string, u: User) => {
    setToken(t);
    setUser(u);
    localStorage.setItem('auth.token', t);
    localStorage.setItem('auth.user', JSON.stringify(u));
    setAuthToken(t);
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth.token');
    localStorage.removeItem('auth.user');
    setAuthToken(null);
  };

  async function login(email: string, password: string): Promise<AuthResult> {
    try {
      const res = await api.post('/auth/login', { email, password });
      const body = res.data || {};
      if (body?.token) {
        saveAuth(body.token, body.user ?? { id: body.user?.id ?? '', email });
        return { ok: true };
      }
      return { ok: false, message: 'Login failed: missing token' };
    } catch (e) {
      // axios may attach response info
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyErr = e as any;
      if (anyErr?.response?.data?.error) return { ok: false, message: anyErr.response.data.error };
      return { ok: false, message: String(e) };
    }
  }

  async function register(email: string, password: string): Promise<AuthResult> {
    try {
      const res = await api.post('/auth/register', { email, password });
      const body = res.data || {};
      if (res.status === 201 && body?.token) {
        saveAuth(body.token, body.user ?? { id: body.user?.id ?? '', email });
        return { ok: true };
      }
      if (res.status === 409) {
        return { ok: false, message: body?.error || 'User already exists' };
      }
      return { ok: false, message: body?.error || `Register failed (status ${res.status})` };
    } catch (e) {
      const anyErr = e as any;
      if (anyErr?.response?.data?.error) return { ok: false, message: anyErr.response.data.error };
      return { ok: false, message: String(e) };
    }
  }

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
