'use client';

import { Sparkles, Zap, Star } from 'lucide-react';
import Link from 'next/link';

export function SponsorBanner() {
  return (
    <div className="sponsor-banner fixed top-0 left-0 right-0 z-50 py-1.5 xs:py-2 sm:py-2.5 md:py-3 px-2 xs:px-3 sm:px-4 md:px-6 text-center overflow-hidden w-full bg-background/95 backdrop-blur-sm border-b border-border/20">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-pulse hidden sm:block"></div>
      <div
        className="absolute bottom-0 right-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse hidden sm:block"
        style={{ animationDelay: '1s' }}
      ></div>

      <div className="flex flex-row flex-wrap items-center justify-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2 text-[10px] xs:text-xs sm:text-sm font-medium w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-0.5 xs:gap-1 flex-shrink-0">
          <Sparkles className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-yellow-500 animate-pulse" />
          <span className="text-muted-foreground whitespace-nowrap">Powered by</span>
        </div>

        <Link
          href="https://teamblitz.netlify.app/"
          target="_blank"
          className="inline-flex items-center gap-0.5 xs:gap-1 bolt-gradient-text font-bold hover:scale-105 transition-transform duration-200 flex-shrink-0 whitespace-nowrap"
        >
          <Zap className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
          <span>Team⚡Blitz</span>
        </Link>

        <div className="flex items-center gap-0.5 xs:gap-1 flex-shrink-0">
          <span className="text-muted-foreground whitespace-nowrap">and the</span>
          <span className="bolt-gradient-text font-semibold whitespace-nowrap">
            opensource community
          </span>
          <Star
            className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-blue-500 animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
        </div>
      </div>
    </div>
  );
}
