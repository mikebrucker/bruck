import { createHmrStore } from "@/stores/createHmrStore";
import type { User } from "@/types/user";

type UserState = {
  user: User | undefined;
  ready: boolean;
  setUser: (user: User) => void;
};

export const useUserStore = createHmrStore<UserState>("user", ["user", "ready"], (set) => ({
  user: undefined,
  ready: false,
  setUser: (user) => set({ user }),
}));
