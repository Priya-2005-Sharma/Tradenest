import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth.service.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // `loading` covers the initial session probe only, so the router can hold
  // route decisions until we know whether a session exists.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // The token lives in an HTTP-only cookie that JS cannot read, so the only
    // way to restore a session on refresh is to ask the server.
    authService
      .me()
      .then((restored) => {
        if (active) setUser(restored);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const loggedIn = await authService.login(credentials);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const register = useCallback(async (payload) => {
    const created = await authService.register(payload);
    setUser(created);
    return created;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      // Clear locally even if the request fails — the user asked to leave.
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading, login, register, logout, isAuthenticated: Boolean(user) }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
