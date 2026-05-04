import QueryProvider from "@/app/providers/query.provider"
import { ThemeProvider } from "@/app/providers/theme.provider"
import router from "@/app/router/router"
import { Toaster } from "@/components/ui/sonner"
import { RouterProvider } from "react-router-dom"

export default function App() {

  return (
    <QueryProvider>
      <ThemeProvider>
        <Toaster position="top-center" />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  )
}
