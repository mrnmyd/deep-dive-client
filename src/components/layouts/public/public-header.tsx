import { Link, useLocation } from "react-router-dom"
import { Mail, Menu, Phone } from "lucide-react"
import { useState } from "react"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes.constant"
import { useAuthStore } from "@/stores/auth.store"
import type { User } from "@/features/auth/types/auth.types"
import { Logout } from "@/components/shared/logout"
import { ThemeToggle } from "@/components/shared/theme-toggle"

/**
 * Replace / extend navigation links as needed
 */
const navLinks = [
    { label: "Home", href: ROUTES.ROOT },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
]

export function PublicHeader() {
    const location = useLocation()
    const user = useAuthStore((state) => state.user)

    /**
     * Control mobile drawer manually so we can close on navigation
     */
    const [open, setOpen] = useState(false)

    const handleNavigate = () => setOpen(false)

    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* LEFT: Logo */}
                <Link to={ROUTES.ROOT} className="flex items-center gap-2">
                    {/* Replace with your logo */}
                    <div className="h-8 w-8 rounded bg-primary" />
                    <span className="font-semibold text-lg">YourApp</span>
                </Link>

                {/* CENTER: Nav Links (Desktop) */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = location.pathname.startsWith(link.href)
                        return (
                            <Link
                                key={link.label}
                                to={link.href}
                                className={`text-sm transition ${isActive
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-2">
                        {!user ? (
                            <>
                                <Link to={ROUTES.AUTH.LOGIN}>
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>

                                <Link to={ROUTES.AUTH.REGISTER}>
                                    <Button size="sm">Register</Button>
                                </Link>
                            </>
                        ) : (
                            <UserMenu user={user} />
                        )}
                    </div>
                    <ThemeToggle />

                    {/* Mobile Drawer */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side="right"
                            className="data-[side=right]:w-full sm:data-[side=right]:max-w-sm px-4"
                        >
                            <div className="flex flex-col h-full">

                                {/* NAVIGATION */}
                                <div className="mt-6">
                                    <nav className="flex flex-col gap-4">
                                        {navLinks.map((link) => {
                                            const isActive = location.pathname.startsWith(link.href)
                                            return (
                                                <Link
                                                    key={link.label}
                                                    to={link.href}
                                                    onClick={handleNavigate}
                                                    className={`text-base ${isActive
                                                        ? "text-foreground font-medium"
                                                        : "text-muted-foreground hover:text-foreground"
                                                        }`}
                                                >
                                                    {link.label}
                                                </Link>
                                            )
                                        })}
                                    </nav>
                                </div>

                                <div className="my-6 border-t" />

                                {/* AUTH SECTION */}
                                <div className="flex flex-col gap-4">
                                    {!user ? (
                                        <>
                                            <Link to={ROUTES.AUTH.LOGIN} onClick={handleNavigate}>
                                                <Button variant="ghost" className="w-full">
                                                    Login
                                                </Button>
                                            </Link>

                                            <Link to={ROUTES.AUTH.REGISTER} onClick={handleNavigate}>
                                                <Button className="w-full">Register</Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <MobileUserSection user={user} onNavigate={handleNavigate} />
                                    )}
                                </div>

                                {/* Optional: push content up if needed */}
                                <div className="flex-1" />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

/**
 * Desktop User Menu (Dropdown)
 * Replace logout logic with your auth implementation
 */
function UserMenu({ user }: { user: User }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    {user.name}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-max">

                {/* User Info */}
                <div className="px-4 py-3 text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                        <Mail size={14} /> {user.email}
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={14} /> {user.mobile}
                    </div>
                </div>

                <div className="my-1 border-t" />

                {/* Actions */}
                <DropdownMenuItem asChild className="px-4 py-1.5">
                    <Link to="/profile">Profile</Link>
                </DropdownMenuItem>

                <Logout>
                    <DropdownMenuItem
                        className="px-4 py-1.5"
                        variant="destructive"
                        onSelect={(e) => e.preventDefault()}
                    >
                        Logout
                    </DropdownMenuItem>
                </Logout>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

/**
 * Mobile User Section (NOT a dropdown)
 * Designed specifically for drawer UX
 */
function MobileUserSection({
    user,
    onNavigate,
}: {
    user: User
    onNavigate: () => void
}) {
    return (
        <div className="space-y-4">

            {/* User Info */}
            <div>
                <div className="text-base font-medium">{user.name}</div>

                <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Mail size={14} /> {user.email}
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={14} /> {user.mobile}
                    </div>
                </div>
            </div>

            <div className="border-t pt-4 space-y-2">

                {/* Profile */}
                <Link to="/profile" onClick={onNavigate}>
                    <Button variant="ghost" className="w-full justify-start">
                        Profile
                    </Button>
                </Link>

                {/* Logout */}
                <Logout>
                    <Button
                        variant="destructive"
                        className="w-full justify-center"
                    >
                        Logout
                    </Button>
                </Logout>
            </div>
        </div>
    )
}