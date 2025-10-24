"use client";

import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";
import { TooltipWithShortcut } from "@/components/ui/tooltip";

export function NavLogo() {
  return (
    <TooltipWithShortcut
      content="Return to homepage"
      disabled={typeof window !== "undefined" && window.innerWidth < 768}
    >
      <Link
        href="/"
        className="flex items-center gap-2 group flex-shrink-0"
      >
        <div className="relative">
          <FileText className="h-6 w-6 sm:h-7 sm:w-7 bolt-gradient-text group-hover:scale-110 transition-transform duration-300" />
          <Sparkles className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 text-yellow-500 animate-pulse" />
        </div>
        <span className="font-bold text-lg sm:text-xl bolt-gradient-text whitespace-nowrap">
          docverse
        </span>
      </Link>
    </TooltipWithShortcut>
  );
}
