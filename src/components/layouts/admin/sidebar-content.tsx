import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import type { AdminMenuItem } from "./types";
import { cn } from "@/lib/utils";

type SidebarContentProps = {
    items: AdminMenuItem[];
    collapsed?: boolean;
    onItemClick?: () => void;
};

export const SidebarContent: React.FC<SidebarContentProps> = ({
    items,
    collapsed = false,
    onItemClick,
}) => {
    const location = useLocation();

    return (
        <nav className="flex flex-col gap-1 p-2">
            {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={onItemClick}
                        className={cn(
                            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            "hover:bg-muted",
                            isActive && "bg-muted text-primary",
                            collapsed ? "justify-center" : "gap-3"
                        )}
                    >
                        {Icon && <Icon className="h-4 w-4 shrink-0" />}

                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                );
            })}
        </nav>
    );
};