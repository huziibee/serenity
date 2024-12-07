// store/useStore.ts
import create from "zustand";

interface UserState {
  email: string | null;
  setEmail: (email: string) => void;
}

export const useStore = create<UserState>((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
}));
