import * as React from "react";
import type { AdminMenuItem } from "./types";
import { SidebarContent } from "./sidebar-content";
import { Button } from "@/components/ui/button";
import { Logout } from "@/components/shared/logout";
import type { User } from "@/features/auth/types/auth.types";
import { LogOut, Mail, Phone } from "lucide-react";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";

type AdminMobileSidebarProps = {
    items: AdminMenuItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onLogout?: () => void;
};

export const AdminMobileSidebar: React.FC<AdminMobileSidebarProps> = ({
    items,
    open,
    onOpenChange,
    user,
    onLogout,
}) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="flex w-64 flex-col p-0">
                <div className="h-14 flex items-center px-4 border-b">
                    <span className="text-sm font-semibold">Menu</span>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <SidebarContent
                        items={items}
                        onItemClick={() => onOpenChange(false)}
                    />
                </div>

                <div className="border-t p-4">
                    <div className="space-y-4 rounded-xl border bg-muted/40 p-3">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                Account
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                {user?.name ?? "Signed in user"}
                            </p>
                        </div>

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
                            <Logout onLogoutSuccess={() => onOpenChange(false)}>
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
                </div>
            </SheetContent>
        </Sheet>
    );
};
