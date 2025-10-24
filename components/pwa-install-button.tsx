'use client';

import { usePWAInstall } from '@/hooks/use-pwa-install';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

export function PWAInstallButton() {
  const { isInstallable, installApp } = usePWAInstall();

  if (!isInstallable) {
    return null;
  }

  return (
    <Button onClick={installApp} variant="ghost" size="icon" aria-label="Install App" className="h-10 w-10 hover:bg-accent/50 transition-all duration-200 hover:shadow-lg">
      <Download className="h-6 w-6 hover:scale-110 transition-transform duration-200" strokeWidth={1.5} />
    </Button>
  );
}