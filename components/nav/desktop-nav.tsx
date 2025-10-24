"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TooltipWithShortcut } from "@/components/ui/tooltip";
import { navItems } from "./nav-items";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-3 lg:gap-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <TooltipWithShortcut key={item.href} content={item.tooltip}>
            <Link
              href={item.href}
              className={cn(
                "text-xs font-medium transition-all duration-300 hover:bolt-gradient-text flex items-center relative group",
                isActive
                  ? "bolt-gradient-text"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className={cn(
                "transition-all duration-300 leading-none overflow-hidden whitespace-nowrap",
                isActive 
                  ? "w-auto ml-1.5 opacity-100" 
                  : "w-0 group-hover:w-auto group-hover:ml-1.5 opacity-0 group-hover:opacity-100"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 rounded-full bg-yellow-500"></div>
              )}
            </Link>
          </TooltipWithShortcut>
        );
      })}
    </nav>
  );
}
