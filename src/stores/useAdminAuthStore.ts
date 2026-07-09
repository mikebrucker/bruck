import { createHmrStore } from "@/stores/createHmrStore";

type AdminAuthState = {
  token: string | undefined;
  setToken: (token: string | undefined) => void;
};

export const useAdminAuthStore = createHmrStore<AdminAuthState>("adminAuth", ["token"], (set) => ({
  token: undefined,
  setToken: (token) => set({ token }),
}));
