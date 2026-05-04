import { getUser } from "@/features/auth/api/auth.api"
import { useAuthStore } from "@/stores/auth.store"
import { useEffect } from "react"

export function useAuthSession() {
    const setAuthenticated = useAuthStore((s) => s.setAuthenticated)
    const setUnauthenticated = useAuthStore((s) => s.setUnauthenticated)

    useEffect(() => {
        getUser()
            .then((user) => setAuthenticated(user))
            .catch(() => setUnauthenticated())
    }, [setAuthenticated, setUnauthenticated])
}