'use client';

import { Info, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';

interface InfoBannerProps {
  title?: string;
  message: string;
  dismissible?: boolean;
  variant?: 'info' | 'success' | 'warning' | 'tip';
}

export function InfoBanner({
  title,
  message,
  dismissible = true,
  variant = 'info',
}: InfoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const variantStyles = {
    info: 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/30 text-blue-900 dark:text-blue-100',
    success:
      'bg-green-50/50 dark:bg-green-950/20 border-green-200/30 text-green-900 dark:text-green-100',
    warning:
      'bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200/30 text-yellow-900 dark:text-yellow-100',
    tip: 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/30 text-purple-900 dark:text-purple-100',
  };

  const iconColor = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    tip: 'text-purple-500',
  };

  return (
    <div className={`p-4 rounded-lg border ${variantStyles[variant]} relative`}>
      <div className="flex items-start gap-3">
        <Info className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColor[variant]}`} />
        <div className="flex-1">
          {title && <h3 className="font-semibold text-sm mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>
        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        )}
      </div>
    </div>
  );
}
