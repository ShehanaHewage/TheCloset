import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserDto } from '../models/user';
import api from '../api/api';

interface UserState {
  user: UserDto | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: UserDto | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (user: UserDto, token: string) => void;
  logout: () => void;
  refresh: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setAccessToken: (accessToken) => set({ accessToken }),

      login: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),

      refresh: async () => {
        const { accessToken, logout } = get();
        if (!accessToken) {
          return;
        }

        try {
          const userData = await api.users.getMe();
          set({
            user: userData,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Failed to refresh user data:', error);
          logout();
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
