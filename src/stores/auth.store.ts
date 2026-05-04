import type { User } from "@/features/auth/types/auth.types"
import { create } from "zustand"

export type AuthStatus = "checking" | "authenticated" | "unauthenticated"

interface AuthState {
    status: AuthStatus
    user: User | null

    setChecking: () => void
    setAuthenticated: (user: User) => void
    setUnauthenticated: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    status: "checking",
    user: null,

    setChecking: () => set({ status: "checking" }),

    setAuthenticated: (user) =>
        set({
            status: "authenticated",
            user,
        }),

    setUnauthenticated: () =>
        set({
            status: "unauthenticated",
            user: null,
        }),
}))