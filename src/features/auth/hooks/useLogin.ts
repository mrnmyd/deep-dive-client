import { useAuthStore } from "@/stores/auth.store"
import { useMutation } from "@tanstack/react-query"
import { login } from "../api/auth.api"
import type { LoginFormInputs } from "../schemas/login.schema"
import type { User } from "../types/auth.types"

export const useLogin = () => {
    const setAuthenticated = useAuthStore((s) => s.setAuthenticated)

    return useMutation<User, unknown, LoginFormInputs>({
        mutationFn: login,

        onSuccess: (user) => {
            setAuthenticated(user)
        },
    })
}
