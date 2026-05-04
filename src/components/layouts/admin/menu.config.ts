import { LayoutDashboard, Users, Settings } from "lucide-react";
import type { AdminMenuItem } from "./types";

export const adminMenu: AdminMenuItem[] = [
    {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Users",
        path: "/admin/users",
        icon: Users,
    },
    {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
    },
];