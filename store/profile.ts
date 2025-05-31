import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ProfileData {
  id: string;
  username: string;
  email?: string;
  role?: "admin" | "user";
  avatar_url?: string | null;
  full_name?: string | null;
  created_at?: string; // Ou Date, dependendo de como você for tratar
  updated_at?: string; // Ou Date
  total_spent?: number;
  total_orders?: number;
  member_since?: string; // Ou Date
}

interface ProfileStore {
  profile: ProfileData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setProfile: (profile: ProfileData | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearProfile: () => void;
  refreshProfile: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: true,
      isAuthenticated: false,

      setProfile: (profile) => {
        set({
          profile,
          isAuthenticated: !!profile,
          isLoading: false,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      clearProfile: () => {
        set({
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshProfile: () => {
        // Limpar o cache do sessionStorage e forçar reload
        sessionStorage.removeItem("profile-storage");
        set({
          profile: null,
          isAuthenticated: false,
          isLoading: true,
        });
        // Trigger a re-fetch by reloading the page or calling checkAuth
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      },
    }),
    {
      name: "profile-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
