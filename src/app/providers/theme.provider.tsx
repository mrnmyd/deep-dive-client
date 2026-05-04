import { useThemeStore } from "@/stores/theme.store"
import { useEffect } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useThemeStore((s) => s.theme)

    useEffect(() => {
        const root = document.documentElement

        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches

        const isDark =
            theme === "dark" || (theme === "system" && systemDark)

        root.classList.toggle("dark", isDark)
    }, [theme])

    return <>{children}</>
}