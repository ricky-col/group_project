import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: (() => {
    const stored = sessionStorage.getItem("user");
    try {
      return stored && stored !== "undefined" ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  
  setUser: (user) => {
    set({ user });
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  },

  logout: () => {
    set({ user: null });
    sessionStorage.removeItem("user");
  },
}));

export default useAuthStore;