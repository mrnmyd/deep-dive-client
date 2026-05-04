import { ROUTES } from "@/constants/routes.constant"
import { PrepTrackerLayout } from "@/features/preptracker/components/preptracker-layout"
import { DashboardPage } from "@/features/preptracker/pages/DashboardPage"
import { ProblemsPage } from "@/features/preptracker/pages/ProblemsPage"
import { ProgressPage } from "@/features/preptracker/pages/ProgressPage"
import { SettingsPage } from "@/features/preptracker/pages/SettingsPage"
import { StudySessionPage } from "@/features/preptracker/pages/StudySessionPage"
import { SyllabusPage } from "@/features/preptracker/pages/SyllabusPage"
import NotFoundPage from "@/pages/NotFoundPage"
import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
    {
        element: <PrepTrackerLayout />,
        children: [
            {
                path: ROUTES.ROOT,
                element: <DashboardPage />,
            },
            {
                path: ROUTES.SYLLABUS,
                element: <SyllabusPage />,
            },
            {
                path: ROUTES.SYLLABUS_DETAIL,
                element: <SyllabusPage />,
            },
            {
                path: ROUTES.PROBLEMS,
                element: <ProblemsPage />,
            },
            {
                path: ROUTES.STUDY,
                element: <StudySessionPage />,
            },
            {
                path: ROUTES.PROGRESS,
                element: <ProgressPage />,
            },
            {
                path: ROUTES.SETTINGS,
                element: <SettingsPage />,
            },
            {
                path: ROUTES.NOT_FOUND,
                element: <NotFoundPage />,
            },
        ]
    },
])

export default router
