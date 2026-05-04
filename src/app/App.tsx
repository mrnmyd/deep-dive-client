import QueryProvider from "@/app/providers/query.provider"
import { ThemeProvider } from "@/app/providers/theme.provider"
import router from "@/app/router/router"
import { Toaster } from "@/components/ui/sonner"
import { useAuthSession } from "@/hooks/useAuthSession"
import { RouterProvider } from "react-router-dom"

export default function App() {

  useAuthSession()

  return (
    <QueryProvider>
      <ThemeProvider>
        <Toaster position="top-center" />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  )
}
