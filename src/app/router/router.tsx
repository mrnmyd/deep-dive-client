import { AdminLayout, adminMenu } from "@/components/layouts/admin"
import { PublicLayout } from "@/components/layouts/public/public-layout"
import { AuthGuard } from "@/components/shared/auth-guard"
import { ROUTES } from "@/constants/routes.constant"
import { RoleEnum } from "@/enums/role.enum"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { DataTableDemoPage } from "@/features/data-table-demo/components/DataTableDemoPage"
import { FormComponentsDemoPage } from "@/features/form-demo/components/form-components-demo-page"
import { DemoPage } from "@/pages/DemoPage"
import NotFoundPage from "@/pages/NotFoundPage"
import { UnauthorizedPage } from "@/pages/UnauthorizedPage"
import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: ROUTES.ROOT,
                element: (
                    <DemoPage
                        title="Public Layout Starter"
                        description="Reference route for the public shell. Use this branch for landing pages, marketing pages, auth pages, and other routes that should share the public header and footer."
                        layout="public"
                    />
                ),
            },
            {
                path: ROUTES.NOT_FOUND,
                element: <NotFoundPage />,
            },
            {
                path: ROUTES.UNAUTHORIZED,
                element: <UnauthorizedPage />,
            },
            {
                path: ROUTES.FORM_COMPONENTS_DEMO,
                element: <FormComponentsDemoPage />,
            },
            {
                path: ROUTES.AUTH.LOGIN,
                element: <LoginPage />,
            },
            {
                path: ROUTES.AUTH.REGISTER,
                element: (
                    <DemoPage
                        title="Register Page Placeholder"
                        description="Included as a demo route so consumers can see how auth pages fit inside the public layout. Replace this with your real registration flow."
                        layout="public"
                    />
                ),
            },
            {
                path: "/features",
                element: (
                    <DemoPage
                        title="Features Page Placeholder"
                        description="Example content route under the public layout. Keep, replace, or remove these demo routes depending on your application."
                        layout="public"
                    />
                ),
            },
            {
                path: "/pricing",
                element: (
                    <DemoPage
                        title="Pricing Page Placeholder"
                        description="Demo-only route that shows how to mount additional public pages under the shared public shell."
                        layout="public"
                    />
                ),
            },
            {
                path: "/about",
                element: (
                    <DemoPage
                        title="About Page Placeholder"
                        description="Another scaffold example route for teams that want a quick public-layout starter path."
                        layout="public"
                    />
                ),
            },
            {
                path: "/profile",
                element: (
                    <DemoPage
                        title="Profile Page Placeholder"
                        description="Demo profile page route linked from the header menu. Replace it with your account page or remove the link."
                        layout="public"
                    />
                ),
            },
            {
                path: "/privacy",
                element: (
                    <DemoPage
                        title="Privacy Page Placeholder"
                        description="Demo legal route included so the default footer does not point to dead links."
                        layout="public"
                    />
                ),
            },
            {
                path: "/terms",
                element: (
                    <DemoPage
                        title="Terms Page Placeholder"
                        description="Demo legal route included so the default footer does not point to dead links."
                        layout="public"
                    />
                ),
            },
        ]
    },
    {
        element: <AdminLayout menu={adminMenu} />,
        children: [
            {
                element: <AuthGuard allowedRoles={[RoleEnum.ADMIN, RoleEnum.USER]} />,
                children: [
                    {
                        path: ROUTES.USER.DASHBOARD,
                        element: (
                            <DemoPage
                                title="Dashboard Starter"
                                description="Reference route for the admin layout. Use this branch for authenticated application pages that should share the admin sidebar, header, and footer."
                                layout="admin"
                            />
                        ),
                    },
                    {
                        path: "/admin/dashboard",
                        element: (
                            <DemoPage
                                title="Admin Dashboard"
                                description="Menu-linked placeholder route used to demonstrate how to register pages under the admin layout."
                                layout="admin"
                            />
                        ),
                    },
                    {
                        path: ROUTES.TABLE_DEMO,
                        element: <DataTableDemoPage />,
                    },
                    {
                        path: "/admin/users",
                        element: <DataTableDemoPage />,
                    },
                    {
                        path: "/admin/settings",
                        element: (
                            <DemoPage
                                title="Admin Settings"
                                description="Placeholder settings page under the admin layout. Replace with feature pages as you build the application."
                                layout="admin"
                            />
                        ),
                    },
                ]
            }
        ]
    },
])

export default router
