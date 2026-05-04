type DemoPageProps = {
    title: string
    description: string
    layout: "public" | "admin"
}

export function DemoPage({ title, description, layout }: DemoPageProps) {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 py-10">
            <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                    {layout} layout demo
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
                <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">
                    This route exists intentionally as scaffold reference code. Replace it
                    with your real page or remove it when wiring your application routes.
                </p>
            </div>
        </div>
    )
}
