import { UnauthorizedIllustration } from '@/assets/illustrations/401'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes.constant'
import { useNavigate } from 'react-router-dom'

export function UnauthorizedPage() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col justify-center items-center">
            {/* Illustration */}
            <div className="mt-4">
                <UnauthorizedIllustration />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold">
                Unauthorized Access
            </h2>

            {/* Description */}
            <p className="mt-2 max-w-md text-muted-foreground">
                You don&apos;t have permission to access this page.
            </p>

            {/* Actions */}
            <div className="mt-6 mb-8 flex gap-3">
                <Button onClick={() => navigate(ROUTES.ROOT)}>
                    Go Home
                </Button>

                <Button variant="outline" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>
        </div>
    )
}
