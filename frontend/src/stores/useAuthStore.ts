import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

interface AuthState {
  isAuthenticated: boolean | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: null,
      accessToken: null,
      refreshToken: null,

      login: (accessToken, refreshToken) =>
        set({ isAuthenticated: true, accessToken, refreshToken }),
      logout: () => set({ isAuthenticated: false, accessToken: null, refreshToken: null }),

      checkAuth: async () => {
        const { accessToken, refreshToken } = get();
        if (!accessToken) return set({ isAuthenticated: false });

        try {
          const { exp } = jwtDecode<{ exp: number }>(accessToken);
          if (exp * 1000 - Date.now() < 60 * 1000) {
            if (!refreshToken) return set({ isAuthenticated: false });

            const { status, data } = await api.tokenRefreshCreate({ refresh: refreshToken });
            return set(
              status === 200
                ? { isAuthenticated: true, accessToken: data.access }
                : { isAuthenticated: false },
            );
          }
          set({ isAuthenticated: true });
        } catch {
          set({ isAuthenticated: false });
        }
      },
    }),
    { name: 'auth-storage', storage: createJSONStorage(() => localStorage) },
  ),
);

export const useAuth = () => {
  const { isAuthenticated, login, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  return { isAuthenticated, login, logout };
};
