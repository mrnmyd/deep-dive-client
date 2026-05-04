import * as React from "react";
import type { AdminMenuItem } from "./types";
import { SidebarContent } from "./sidebar-content";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Logout } from "@/components/shared/logout";
import type { User } from "@/features/auth/types/auth.types";
import { LogOut, Mail, PanelLeft, Phone, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
    items: AdminMenuItem[];
    collapsed: boolean;
    onToggle: () => void;
    user?: User | null;
    onLogout?: () => void;
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
    items,
    collapsed,
    onToggle,
    user,
    onLogout,
}) => {
    return (
        <aside
            className={cn(
                "hidden h-screen shrink-0 md:flex md:flex-col border-r bg-background transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className={cn(
                "h-14 flex items-center px-3 border-b",
                collapsed ? "justify-center" : "justify-between"
            )}>
                {!collapsed && (
                    <span className="text-sm font-semibold text-nowrap overflow-hidden">Admin Panel</span>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                >
                    <PanelLeft className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <SidebarContent items={items} collapsed={collapsed} />
            </div>

            <Separator />

            <div className={cn("p-3", collapsed && "px-2")}>
                <div
                    className={cn(
                        "rounded-xl border bg-muted/40",
                        collapsed ? "px-2 py-3" : "p-3"
                    )}
                >
                    {collapsed ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground">
                                <UserIcon className="h-4 w-4" />
                            </div>

                            {onLogout ? (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={onLogout}
                                    aria-label="Logout"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Logout>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        aria-label="Logout"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </Logout>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-foreground">
                                {user?.name ?? "Signed in user"}
                            </p>

                            <div className="space-y-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{user?.email ?? "No email available"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{user?.mobile ?? "No mobile available"}</span>
                                </div>
                            </div>

                            {onLogout ? (
                                <Button
                                    variant="outline"
                                    className="w-full justify-center"
                                    onClick={onLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            ) : (
                                <Logout>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </Logout>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};
