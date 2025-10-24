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
    <div className="flex items-center gap-3">
      {/* PWA Install Button */}
      <TooltipWithShortcut content="Install docverse as an app on your device">
        <PWAInstallButton />
      </TooltipWithShortcut>

      {/* Theme Toggle */}
      <SimpleThemeToggle />

      {/* User Menu or Sign In Button */}
      {user ? (
        <UserMenu />
      ) : (
        <TooltipWithShortcut content="Sign in to save and manage your documents">
          <Link href="/auth/signin">
            <Button className="bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300 text-sm px-4 h-9 hidden md:flex">
              <Zap className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </Link>
        </TooltipWithShortcut>
      )}
    </div>
  );
}
