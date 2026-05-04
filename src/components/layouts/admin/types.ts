import type { User } from "@/features/auth/types/auth.types";
import type { LucideIcon } from "lucide-react";

export type AdminMenuItem = {
    label: string;
    path: string;
    icon?: LucideIcon;
};

export type AdminLayoutProps = {
    menu: AdminMenuItem[];
    user?: User | null;
    onLogout?: () => void;
};
