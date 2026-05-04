import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/stores/auth.store"
import type { RoleEnum } from "@/enums/role.enum"
import { ROUTES } from "@/constants/routes.constant"
import { LoadingPage } from "@/pages/LoadingPage"

interface AuthGuardProps {
    allowedRoles?: RoleEnum[]
}

export const AuthGuard = ({ allowedRoles }: AuthGuardProps) => {
    const { status, user } = useAuthStore()

    if (status === "checking") {
        return <LoadingPage />
    }

    if (status === "unauthenticated") {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const userRoles = user?.roles?.map((r) => r.name)

        const hasAccess = allowedRoles.some((role) =>
            userRoles?.includes(role)
        )

        if (!hasAccess) {
            return <Navigate to={ROUTES.UNAUTHORIZED} replace />
        }
    }

    return <Outlet />
}