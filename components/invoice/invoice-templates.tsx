"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const templates: Array<{
  id: string;
  name: string;
  description: string;
  previewClass: string;
}> = [
  {
    id: "clean-blue",
    name: "Clean Blue",
    description: "Modern and clean",
    previewClass:
      "ring-blue-500/70 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-neutral-900 dark:to-neutral-800",
  },
  {
    id: "classic-slate",
    name: "Classic Slate",
    description: "Minimal and readable",
    previewClass:
      "ring-neutral-400/60 bg-gradient-to-br from-neutral-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-800",
  },
  {
    id: "accent-amber",
    name: "Accent Amber",
    description: "Warm and professional",
    previewClass:
      "ring-amber-500/70 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-neutral-900 dark:to-neutral-800",
  },
];

export function InvoiceTemplates({
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
              "group relative rounded-xl border p-3 text-left transition-all hover:shadow-md focus:outline-none",
              active ? "border-yellow-500/50" : "border-yellow-400/20"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "relative w-24 h-16 rounded-md ring-4 ring-offset-0 overflow-hidden",
                  t.previewClass
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

export default InvoiceTemplates;
