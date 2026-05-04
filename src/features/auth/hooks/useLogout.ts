import { useMutation } from "@tanstack/react-query"
import { logout } from "../api/auth.api"
import { useAuthStore } from "@/stores/auth.store"

export const useLogout = () => {
    const setUnauthenticated = useAuthStore((s) => s.setUnauthenticated)

    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: setUnauthenticated,
        onError: setUnauthenticated
    })

    return {
        logout: mutation.mutate,
        isPending: mutation.isPending
    }
}