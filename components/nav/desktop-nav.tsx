'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TooltipWithShortcut } from '@/components/ui/tooltip';
import { navItems } from './nav-items';

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-4 lg:gap-5" role="navigation" aria-label="Primary">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <TooltipWithShortcut key={item.href} content={item.tooltip}>
            <Link
              href={item.href}
              aria-label={item.label}
              className={cn(
                'text-sm font-medium transition-all duration-300 hover:bolt-gradient-text flex items-center relative group rounded-lg px-2 py-1.5 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                isActive ? 'bolt-gradient-text bg-accent/30' : 'text-muted-foreground',
              )}
            >
              <Icon
                className="h-6 w-6 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3"
                strokeWidth={1.5}
              />
              <span
                className={cn(
                  'transition-all duration-300 leading-none overflow-hidden whitespace-nowrap font-semibold',
                  isActive
                    ? 'w-auto ml-2 opacity-100'
                    : 'w-0 group-hover:w-auto group-hover:ml-2 opacity-0 group-hover:opacity-100',
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1.5 left-3 w-1 h-1 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
              )}
            </Link>
          </TooltipWithShortcut>
        );
      })}
    </nav>
  );
}
