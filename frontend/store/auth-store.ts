import type { AuthState, User } from "@/app/auth/types/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStateWithRehydration extends AuthState {
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  updateAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthStateWithRehydration>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
      _hasHydrated: false,

      // Actions
      setAuth: (user: User, token: string) => {
        console.log("🔐 Store: Setting auth state", { userId: user.id });
        set({ user, token, isAuthenticated: true, error: null });
      },

      clearAuth: () => {
        console.log("🧹 Store: Clearing auth state");
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setInitialized: (initialized: boolean) =>
        set({ isInitialized: initialized }),
      setHasHydrated: (hasHydrated: boolean) =>
        set({ _hasHydrated: hasHydrated }),

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) {
          console.warn("⚠️ Store: Cannot update user - no user logged in");
          return;
        }
        console.log("👤 Store: Updating user data", updates);
        set({ user: { ...currentUser, ...updates } });
      },

      updateAccessToken: (token: string) => {
        console.log("🔄 Store: Updating access token");
        set({ token });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("💧 Store: Rehydration complete");
        state?.setHasHydrated(true);
      },
    }
  )
);

// ==================== SELECTORS ====================
export const selectUser = (state: AuthStateWithRehydration) => state.user;
export const selectToken = (state: AuthStateWithRehydration) => state.token;
export const selectIsAuthenticated = (state: AuthStateWithRehydration) =>
  state.isAuthenticated;
export const selectIsLoading = (state: AuthStateWithRehydration) =>
  state.isLoading;
export const selectHasHydrated = (state: AuthStateWithRehydration) =>
  state._hasHydrated;
