'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { TooltipWithShortcut } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserMenu() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse hidden md:flex"></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <TooltipWithShortcut content="View account settings and profile">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full hidden md:flex">
            <Avatar className="h-8 w-8 ring-2 ring-yellow-400/20 hover:ring-yellow-400/40 transition-all duration-200">
              <AvatarImage
                src={user.user_metadata?.avatar_url}
                alt={user.user_metadata?.name || user.email}
              />
              <AvatarFallback className="bolt-gradient text-white font-semibold text-xs">
                {(user.user_metadata?.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
      </TooltipWithShortcut>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-background/95 backdrop-blur-xl border-border/50"
      >
        <div className="flex items-center gap-2 p-2 border-b border-border/20">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bolt-gradient text-white text-xs">
              {(user.user_metadata?.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.user_metadata?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          className="hover:bg-red-50 hover:text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
