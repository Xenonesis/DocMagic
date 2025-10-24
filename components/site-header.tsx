"use client";

import { NavLogo, DesktopNav, MobileNav, NavActions } from "@/components/nav";

export function SiteHeader() {
  return (
    <header className="fixed top-[32px] xs:top-[36px] sm:top-[40px] md:top-[48px] z-40 w-full nav-professional">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <NavLogo />
            <MobileNav />
            <DesktopNav />
          </div>
          <NavActions />
        </div>
      </div>
    </header>
  );
}
