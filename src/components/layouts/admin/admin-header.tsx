import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import * as React from "react";

type AdminHeaderProps = {
    onMenuClick: () => void;
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    onMenuClick,
}) => {
    return (
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <span className="font-semibold text-sm">Admin</span>
            </div>

            <ThemeToggle />
        </header>
    );
};
