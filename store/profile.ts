import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProfileData {
  id: string;
  username: string;
  email?: string;
  role?: "admin" | "user";
}

interface ProfileStore {
  profile: ProfileData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setProfile: (profile: ProfileData | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearProfile: () => void;
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
    }),
    {
      name: "profile-storage",
    }
  )
);
