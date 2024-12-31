'use client';
import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: { id: string; name: string } | null; // Adjust the shape of the user object as per your requirements
  setToken: (token: string | null) => void;
  setUser: (user: { id: string; name: string } | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, user: null }),
}));
