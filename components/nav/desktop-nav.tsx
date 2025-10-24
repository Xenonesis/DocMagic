"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TooltipWithShortcut } from "@/components/ui/tooltip";
import { navItems } from "./nav-items";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <TooltipWithShortcut key={item.href} content={item.tooltip}>
            <Link
              href={item.href}
              className={cn(
                "text-sm lg:text-base font-medium transition-all duration-300 hover:bolt-gradient-text hover:scale-105 flex items-center gap-2 relative group whitespace-nowrap",
                pathname === item.href
                  ? "bolt-gradient-text"
                  : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "transition-transform duration-200",
                  "group-hover:scale-110"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="hidden lg:inline">{item.label}</span>
              {pathname === item.href && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 rounded-full bg-yellow-500"></div>
              )}
            </Link>
          </TooltipWithShortcut>
        );
      })}
    </nav>
  );
}
