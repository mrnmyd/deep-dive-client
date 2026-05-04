import { Spinner } from "@/components/ui/spinner"

export function LoadingPage() {
    return (
        <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-6 px-4 text-center">

            {/* Spinner */}
            <Spinner className="h-10 w-10 text-primary" />

            {/* Message */}
            <div className="space-y-1">
                <h2 className="text-lg font-medium">
                    Loading
                </h2>
                <p className="text-sm text-muted-foreground">
                    Please wait while we prepare your data
                </p>
            </div>
        </div>
    )
}