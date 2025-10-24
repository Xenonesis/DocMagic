"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { TooltipWithShortcut } from "@/components/ui/tooltip";
import { PWAInstallButton } from "@/components/pwa-install-button";
import { SimpleThemeToggle } from "@/components/simple-theme-toggle";
import { UserMenu } from "./user-menu";

export function NavActions() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
      {/* PWA Install Button - Hidden on mobile */}
      <div className="hidden sm:block">
        <TooltipWithShortcut content="Install docverse as an app on your device">
          <PWAInstallButton />
        </TooltipWithShortcut>
      </div>

      {/* Theme Toggle */}
      <SimpleThemeToggle />

      {/* User Menu or Sign In Button */}
      {user ? (
        <UserMenu />
      ) : (
        <TooltipWithShortcut content="Sign in to save and manage your documents">
          <Link href="/auth/signin" className="group">
            <Button className="bolt-gradient text-white font-semibold transition-all duration-300 text-sm h-9 sm:h-10 flex items-center leading-none overflow-hidden px-2 sm:px-2.5 group-hover:px-4 sm:group-hover:px-5 shadow-lg hover:shadow-xl">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2} />
              <span className="w-0 group-hover:w-auto group-hover:ml-1.5 sm:group-hover:ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 leading-none overflow-hidden whitespace-nowrap text-xs sm:text-sm">
                Sign In
              </span>
            </Button>
          </Link>
        </TooltipWithShortcut>
      )}
    </div>
  );
}
