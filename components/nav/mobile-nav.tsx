'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, FileText, Sparkles, Zap, User, LogOut, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { navItems } from './nav-items';

export function MobileNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsSheetOpen(false);
  };

  const handleNavClick = () => {
    setIsSheetOpen(false);
  };

  // Split nav items into categories
  const documentTools = navItems.slice(0, 7); // Resume, Presentation, CV, Letter, Diagram, Icon, QR
  const otherItems = navItems.slice(7); // Templates, Pricing

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-accent/50 h-10 w-10 transition-all duration-200 relative group"
          aria-label="Open navigation menu"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/10 group-hover:to-orange-500/10 rounded-lg transition-all duration-300" />
          <Menu
            className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform"
            strokeWidth={1.5}
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full sm:w-[380px] p-0 bg-background border-r [&>button]:hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <Link href="/" onClick={handleNavClick} className="flex items-center gap-2 group">
              <div className="relative">
                <FileText className="h-6 w-6 bolt-gradient-text group-hover:scale-110 transition-transform" />
                <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-yellow-500 animate-pulse" />
              </div>
              <span className="font-bold text-xl bolt-gradient-text">docverse</span>
            </Link>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-accent">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="px-6 py-4 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-yellow-400/30 ring-offset-2 ring-offset-background">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bolt-gradient text-white font-bold">
                    {(user.user_metadata?.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {user.user_metadata?.name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-6">
              {/* Document Tools Section */}
              <div>
                <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Create Documents
                </h3>
                <nav className="space-y-1">
                  {documentTools.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          onClick={handleNavClick}
                          className={cn(
                            'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden',
                            isActive
                              ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                          )}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-r-full" />
                          )}
                          <div
                            className={cn(
                              'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
                              isActive
                                ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-md'
                                : 'bg-accent/50 group-hover:bg-accent group-hover:scale-110',
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold">{item.label}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {item.tooltip}
                            </div>
                          </div>
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 transition-all duration-200',
                              isActive
                                ? 'text-yellow-600 translate-x-0'
                                : 'text-muted-foreground/50 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                            )}
                          />
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </div>

              <Separator />

              {/* Other Items Section */}
              <div>
                <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  More
                </h3>
                <nav className="space-y-1">
                  {otherItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          onClick={handleNavClick}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                            isActive
                              ? 'bg-accent text-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 ml-auto transition-transform duration-200',
                              isActive
                                ? 'text-yellow-600'
                                : 'text-muted-foreground/50 group-hover:translate-x-1',
                            )}
                          />
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </div>

              {/* Account Section */}
              {user && (
                <>
                  <Separator />
                  <div>
                    <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Account
                    </h3>
                    <nav className="space-y-1">
                      <SheetClose asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 group"
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                          <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground/50 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 group"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>Settings</span>
                          <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground/50 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </SheetClose>
                    </nav>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-4 border-t bg-muted/30">
            {user ? (
              <Button
                variant="outline"
                size="lg"
                onClick={handleSignOut}
                className="w-full justify-start gap-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Sign Out</span>
              </Button>
            ) : (
              <SheetClose asChild>
                <Button
                  asChild
                  size="lg"
                  className="w-full bolt-gradient text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <Link href="/auth/signin" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Sign In to docverse
                  </Link>
                </Button>
              </SheetClose>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
