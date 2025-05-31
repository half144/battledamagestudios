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
    (set, get) => ({
      profile: null,
      isLoading: true,
      isAuthenticated: false,

      setProfile: (profile) => {
        console.log("[ProfileStore] Setting profile:", profile);
        set({
          profile,
          isAuthenticated: !!profile,
          isLoading: false,
        });
      },

      setLoading: (isLoading) => {
        console.log("[ProfileStore] Setting loading:", isLoading);
        set({ isLoading });
      },

      clearProfile: () => {
        console.log("[ProfileStore] Clearing profile");
        set({
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshProfile: () => {
        console.log("[ProfileStore] Refreshing profile");
        // Limpar o cache do sessionStorage e forçar reload
        sessionStorage.removeItem("profile-storage");
        set({
          profile: null,
          isAuthenticated: false,
          isLoading: true,
        });
        // Trigger a re-fetch by reloading the page
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
      onRehydrateStorage: () => (state) => {
        console.log("[ProfileStore] Rehydrating from storage:", state);
        if (state) {
          // Garantir que o estado seja consistente após rehydration
          state.isLoading = false;
        }
      },
    }
  )
);
