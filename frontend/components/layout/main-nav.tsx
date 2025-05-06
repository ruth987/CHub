"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    {
        title: "Home",
        href: "/",
    },
    {
        title: "Mental Health Support",
        href: "/mental-health",
    },
    {
        title: "Resources",
        href: "/resources",
    },
    {
        title: "Community",
        href: "/community",
    },
];

export function MainNav() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-yellow-400",
                        pathname === item.href
                            ? "text-yellow-400"
                            : "text-gray-300"
                    )}
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    );
} 