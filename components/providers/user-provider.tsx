"use client";

import { createContext, useContext } from "react";

import type { CurrentUser } from "@/lib/types";

const UserContext = createContext<CurrentUser | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: CurrentUser;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): CurrentUser {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser harus dipakai di dalam <UserProvider>");
  }
  return ctx;
}
