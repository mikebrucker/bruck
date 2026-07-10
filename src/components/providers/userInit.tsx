"use client";

import { useEffect } from "react";
import UserController from "@/controllers/user";
import { useUserStore } from "@/stores/useUserStore";

export function UserInit() {
  useEffect(() => {
    async function loadUser() {
      try {
        const user = await UserController.getUser();
        useUserStore.setState({ user, ready: true });
      } catch (error) {
        console.error("Failed to load user", error);
        useUserStore.setState({ ready: true });
      }
    }

    loadUser();
  }, []);

  return null;
}
