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
    <Button onClick={installApp} variant="ghost" size="icon" aria-label="Install App">
      <Download className="h-4 w-4" />
    </Button>
  );
}