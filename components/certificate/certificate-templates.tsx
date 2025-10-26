'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

const templates: Array<{
  id: string;
  name: string;
  description: string;
  previewClass: string;
}> = [
  {
    id: 'classic-gold',
    name: 'Classic Gold',
    description: 'Timeless and premium look',
    previewClass: 'ring-yellow-500/80 bg-gradient-to-br from-yellow-50 to-amber-50',
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Clean and contemporary',
    previewClass: 'ring-blue-500/70 bg-gradient-to-br from-blue-50 to-cyan-50',
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    description: 'Stylish and elegant',
    previewClass: 'ring-purple-500/70 bg-gradient-to-br from-purple-50 to-fuchsia-50',
  },
  {
    id: 'minimal-slate',
    name: 'Minimal Slate',
    description: 'Neutral and minimal aesthetic',
    previewClass: 'ring-neutral-400/60 bg-gradient-to-br from-neutral-50 to-slate-100',
  },
  {
    id: 'regal-emerald',
    name: 'Regal Emerald',
    description: 'Rich and ceremonial feel',
    previewClass: 'ring-emerald-500/70 bg-gradient-to-br from-emerald-50 to-green-100',
  },
];

export function CertificateTemplates({
  selectedTemplate,
  onSelect,
}: {
  selectedTemplate: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((t) => {
        const active = selectedTemplate === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={cn(
              'group relative rounded-xl border p-3 text-left transition-all hover:shadow-md focus:outline-none',
              active ? 'border-yellow-500/50' : 'border-yellow-400/20',
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'relative w-24 h-16 rounded-md ring-4 ring-offset-0 overflow-hidden',
                  t.previewClass,
                )}
              >
                <div className="absolute inset-1 rounded bg-white/95 dark:bg-neutral-900/95"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{t.name}</p>
                  {active && <CheckCircle2 className="h-4 w-4 text-yellow-600" />}
                </div>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default CertificateTemplates;
