import * as React from "react";

export const AdminFooter: React.FC = () => {
    return (
        <footer className="h-12 border-t bg-background flex items-center justify-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Admin Panel
        </footer>
    );
};