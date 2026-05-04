import { Link } from "react-router-dom"

const footerSections = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Documentation", href: "/docs" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "Blog", href: "/blog" },
            { label: "Help Center", href: "/help" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
        ],
    },
]

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-4">

                    {/* Brand Section */}
                    <div>
                        <h2 className="text-lg font-semibold">YourApp</h2>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Building scalable and production-ready applications with ease.
                        </p>
                    </div>

                    {/* Dynamic Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-sm font-semibold">{section.title}</h3>
                            <ul className="mt-3 space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                </div>

                {/* Bottom Bar */}
                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} YourApp. All rights reserved.
                    </p>

                    <div className="flex gap-4">
                        <Link
                            to="/privacy"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Privacy
                        </Link>
                        <Link
                            to="/terms"
                            className="text-sm text-muted-foreground hover:text-foreground"
                        >
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}