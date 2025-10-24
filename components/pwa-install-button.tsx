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
    <Button onClick={installApp} variant="ghost" size="icon" aria-label="Install App" className="h-9 w-9">
      <Download className="h-5 w-5" />
    </Button>
  );
}