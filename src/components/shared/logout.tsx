import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { type ReactNode } from "react"

import { ROUTES } from "@/constants/routes.constant"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

type LogoutProps = {
    children: ReactNode
    onLogoutSuccess?: () => void // optional hook (important for mobile drawer close)
}

export function Logout({ children, onLogoutSuccess }: LogoutProps) {
    const { logout, isPending } = useLogout();
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate(ROUTES.ROOT)
        toast.success("Logged out successfully")

        onLogoutSuccess?.()
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will log you out of your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} disabled={isPending}>
                        Logout
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}