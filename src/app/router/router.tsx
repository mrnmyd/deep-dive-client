import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.constant'
import { RootLayout } from '@/app/router/RootLayout'
import { ReaderPage } from '@/features/deepdive/components/reader/ReaderPage'
import { DeepDiveLayout } from '@/features/deepdive/components/deepdive-layout'
import NotFoundPage from '@/pages/NotFoundPage'

const DashboardPage = lazy(() =>
  import('@/features/deepdive/pages/DashboardPage').then((mod) => ({
    default: mod.DashboardPage,
  }))
)
const ProblemsPage = lazy(() =>
  import('@/features/deepdive/pages/ProblemsPage').then((mod) => ({ default: mod.ProblemsPage }))
)
const ProgressPage = lazy(() =>
  import('@/features/deepdive/pages/ProgressPage').then((mod) => ({ default: mod.ProgressPage }))
)
const SettingsPage = lazy(() =>
  import('@/features/deepdive/pages/SettingsPage').then((mod) => ({ default: mod.SettingsPage }))
)

const fallback = (label: string) => (
  <div
    className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground"
    role="status"
    aria-live="polite"
  >
    Loading {label}…
  </div>
)

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.READER, element: <ReaderPage /> },
      {
        element: <DeepDiveLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: (
              <Suspense fallback={fallback('Dashboard')}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.PROBLEMS,
            element: (
              <Suspense fallback={fallback('Problems')}>
                <ProblemsPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.PROGRESS,
            element: (
              <Suspense fallback={fallback('Progress')}>
                <ProgressPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.SETTINGS,
            element: (
              <Suspense fallback={fallback('Settings')}>
                <SettingsPage />
              </Suspense>
            ),
          },
        ],
      },
      { path: ROUTES.STUDY, element: <Navigate to={ROUTES.READER} replace /> },
      { path: ROUTES.SYLLABUS, element: <Navigate to={ROUTES.READER} replace /> },
      { path: ROUTES.SYLLABUS_DETAIL, element: <Navigate to={ROUTES.READER} replace /> },
      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
    ],
  },
])

export default router
