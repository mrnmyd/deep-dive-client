import * as React from "react";
import { Outlet } from "react-router-dom";

import type { AdminLayoutProps } from "./types";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { AdminFooter } from "./admin-footer";
import { AdminMobileSidebar } from "./admin-mobile-sidebar";
import { useAuthStore } from "@/stores/auth.store";

export const AdminLayout: React.FC<AdminLayoutProps> = ({
    menu,
    user,
    onLogout,
}) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const storeUser = useAuthStore((state) => state.user);
    const resolvedUser = user ?? storeUser;

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar
                items={menu}
                collapsed={collapsed}
                onToggle={() => setCollapsed((prev) => !prev)}
                user={resolvedUser}
                onLogout={onLogout}
            />

            <AdminMobileSidebar
                items={menu}
                open={mobileOpen}
                onOpenChange={setMobileOpen}
                user={resolvedUser}
                onLogout={onLogout}
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <AdminHeader
                    onMenuClick={() => setMobileOpen(true)}
                />

                <div className="flex-1 overflow-y-auto">
                    <main className="min-h-full p-4 md:p-6">
                        <Outlet />
                    </main>

                    <AdminFooter />
                </div>
            </div>
        </div>
    );
};
