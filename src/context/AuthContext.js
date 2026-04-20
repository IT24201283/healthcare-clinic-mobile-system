/**
 * Global authentication state: user, token, bootstrapping, and auth actions.
 * Uses AsyncStorage for persistence and axios (via services) for API calls.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import { clearAuth, getToken, getUser, saveToken, saveUser } from '../utils/storage';
import { normalizeUser } from '../utils/helpers';

const AuthContext = createContext(undefined);

export function AuthProvider({ children, navigationRef }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  // On cold start: read token, optionally refresh profile from backend.
  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const storedToken = await getToken();
        if (!storedToken) {
          return;
        }

        setToken(storedToken);
        const cachedUser = await getUser();
        if (cachedUser) {
          setUser(cachedUser);
        }

        try {
          const profile = await userService.fetchProfile();
          if (!active) return;
          setUser(profile);
          await saveUser(profile);
        } catch {
          await clearAuth();
          if (!active) return;
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setBootstrapping(false);
        }
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const goToMain = useCallback(() => {
    if (navigationRef?.isReady?.()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  }, [navigationRef]);

  const goToAuth = useCallback(() => {
    if (navigationRef?.isReady?.()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Auth' }] });
    }
  }, [navigationRef]);

  const signIn = useCallback(
    async (email, password) => {
      const result = await authService.login({ email, password });
      await saveToken(result.token);
      await saveUser(result.user);
      setToken(result.token);
      setUser(result.user);
      goToMain();
    },
    [goToMain]
  );

  const signUp = useCallback(
    async (payload) => {
      const result = await authService.register(payload);
      if (result.token && result.user) {
        await saveToken(result.token);
        await saveUser(result.user);
        setToken(result.token);
        setUser(result.user);
        goToMain();
        return { autoLoggedIn: true };
      }
      return { autoLoggedIn: false };
    },
    [goToMain]
  );

  const signOut = useCallback(async () => {
    await clearAuth();
    setToken(null);
    setUser(null);
    goToAuth();
  }, [goToAuth]);

  const refreshProfile = useCallback(async () => {
    const profile = await userService.fetchProfile();
    setUser(profile);
    await saveUser(profile);
    return profile;
  }, []);

  const updateLocalUser = useCallback(async (next) => {
    const normalized = normalizeUser(next);
    setUser(normalized);
    await saveUser(normalized);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      bootstrapping,
      isAuthenticated: Boolean(user && token),
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateLocalUser,
    }),
    [
      user,
      token,
      bootstrapping,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateLocalUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
