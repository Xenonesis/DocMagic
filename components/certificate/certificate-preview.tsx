"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type CertificateData = {
  recipientName: string;
  achievement: string;
  organizationName?: string;
  awardedBy?: string;
  signature?: string;
  date: string; // ISO date string
  template: string; // template id
  organizationLogo?: string; // data URL or external URL
  signatureImage?: string; // data URL or external URL
  fontScale?: number; // percentage e.g. 100
  fontFamily?: string; // CSS font family
  showSeal?: boolean; // toggle visibility
};

interface CertificatePreviewProps {
  certificate: CertificateData;
  isPreview?: boolean;
  className?: string;
}

// Shared decorative borders per template
const templateStyles: Record<string, {
  frame: string;
  headline: string;
  subtext: string;
  accent: string;
  bg: string;
  seal: string;
  signature: string;
}> = {
  "classic-gold": {
    frame: "ring-4 ring-yellow-500/80 shadow-xl",
    headline: "text-yellow-700 dark:text-yellow-300",
    subtext: "text-neutral-600 dark:text-neutral-300",
    accent: "from-yellow-50 to-amber-50 dark:from-neutral-900 dark:to-neutral-800",
    bg: "bg-white dark:bg-neutral-950",
    seal: "bg-gradient-to-br from-yellow-500 to-amber-600",
    signature: "text-yellow-700 dark:text-yellow-300",
  },
  "modern-blue": {
    frame: "ring-4 ring-blue-500/70 shadow-xl",
    headline: "text-blue-700 dark:text-blue-300",
    subtext: "text-neutral-600 dark:text-neutral-300",
    accent: "from-blue-50 to-cyan-50 dark:from-neutral-900 dark:to-neutral-800",
    bg: "bg-white dark:bg-neutral-950",
    seal: "bg-gradient-to-br from-blue-500 to-indigo-600",
    signature: "text-blue-700 dark:text-blue-300",
  },
  "elegant-purple": {
    frame: "ring-4 ring-purple-500/70 shadow-xl",
    headline: "text-purple-700 dark:text-purple-300",
    subtext: "text-neutral-600 dark:text-neutral-300",
    accent: "from-purple-50 to-fuchsia-50 dark:from-neutral-900 dark:to-neutral-800",
    bg: "bg-white dark:bg-neutral-950",
    seal: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
    signature: "text-purple-700 dark:text-purple-300",
  },
  "minimal-slate": {
    frame: "ring-4 ring-neutral-400/60 shadow-xl",
    headline: "text-neutral-800 dark:text-neutral-200",
    subtext: "text-neutral-600 dark:text-neutral-300",
    accent: "from-neutral-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-800",
    bg: "bg-white dark:bg-neutral-950",
    seal: "bg-gradient-to-br from-neutral-500 to-slate-600",
    signature: "text-neutral-800 dark:text-neutral-200",
  },
  "regal-emerald": {
    frame: "ring-4 ring-emerald-500/70 shadow-xl",
    headline: "text-emerald-700 dark:text-emerald-300",
    subtext: "text-neutral-600 dark:text-neutral-300",
    accent: "from-emerald-50 to-green-100 dark:from-neutral-900 dark:to-neutral-800",
    bg: "bg-white dark:bg-neutral-950",
    seal: "bg-gradient-to-br from-emerald-500 to-green-600",
    signature: "text-emerald-700 dark:text-emerald-300",
  },
};

export function CertificatePreview({ certificate, isPreview = false, className }: CertificatePreviewProps) {
  const styles = templateStyles[certificate.template] ?? templateStyles["classic-gold"];
  const fontScale = (certificate as any).fontScale ?? 100;
  const fontFamily = (certificate as any).fontFamily || undefined;
  const showSeal = (certificate as any).showSeal !== false;
  const displayDate = new Date(certificate.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={cn("w-full", className)}>
      {/* Fixed landscape A4-like canvas */}
      <div
        id="certificate-preview"
        className={cn(
          "relative mx-auto aspect-[1.414/1] w-full max-w-[1100px] select-none certificate-canvas text-neutral-900 dark:text-neutral-100",
          styles.bg,
          "rounded-xl overflow-hidden"
        )}
      >
        {/* Subtle gradient background per template */}
        <div className={cn("absolute inset-0 bg-gradient-to-br", styles.accent)} style={{ mixBlendMode: 'normal' }} />

        {/* Ornamental double border */}
        <div className={cn("absolute inset-4 rounded-xl bg-white dark:bg-neutral-900")}></div>
        <div className={cn("absolute inset-3 rounded-2xl bg-transparent", styles.frame, "ring-offset-0 rounded-xl")} />

        {/* Content */}
        <div className="relative z-10 h-full w-full p-10 flex flex-col items-center justify-between text-center">
          {/* Header */}
          <div className="flex flex-col items-center">
            {certificate.organizationLogo && (
              <div className="mb-3">
                <img
                  src={certificate.organizationLogo}
                  alt="Organization logo"
                  className="h-10 md:h-12 w-auto object-contain opacity-90"
                />
              </div>
            )}
            <p className={cn("tracking-widest text-xs md:text-sm uppercase", styles.subtext)}>Certificate of</p>
            <h2
              className={cn("mt-2 text-2xl md:text-4xl font-extrabold", styles.headline)}
              style={{ fontSize: `calc(1rem + ${fontScale/100} * 1.25rem)`, fontFamily }}
            >
              {certificate.achievement || "Achievement Title"}
            </h2>
            {certificate.organizationName && (
              <p className={cn("mt-2 text-xs md:text-sm", styles.subtext)}>
                Presented by {certificate.organizationName}
              </p>
            )}
          </div>

          {/* Recipient */}
          <div>
            <p className={cn("text-xs md:text-sm tracking-widest uppercase", styles.subtext)}>Awarded to</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-serif font-bold text-neutral-900 dark:text-neutral-100" style={{ fontSize: `calc(1.25rem + ${fontScale/100} * 1.75rem)`, fontFamily: fontFamily }}>
              {certificate.recipientName || "Recipient Name"}
            </h1>
          </div>

          {/* Footer area with sign and date */}
          <div className="w-full flex items-end justify-between gap-6 mt-4">
            <div className="flex-1">
              {certificate.awardedBy || certificate.signatureImage ? (
                <div className="text-left">
                  {certificate.signatureImage ? (
                    <img
                      src={certificate.signatureImage}
                      alt="Signature"
                      className="h-10 md:h-12 w-auto object-contain -mb-1 opacity-90"
                    />
                  ) : (
                    <div className={cn("text-xl md:text-2xl font-[500] leading-none", styles.signature)} style={{fontFamily:'cursive'}}>
                      {certificate.awardedBy}
                    </div>
                  )}
                  <div className="mt-1 h-px w-44 bg-neutral-300 dark:bg-neutral-700" />
                  <p className="mt-1 text-xs md:text-sm text-neutral-600 dark:text-neutral-300">Authorized Signatory</p>
                </div>
              ) : (
                <div className="h-10" />
              )}
            </div>

            {/* Seal */}
            {showSeal && (
              <div className={cn("w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg grid place-items-center text-white font-bold", styles.seal)}>
                <span className="text-xs md:text-sm">SEAL</span>
              </div>
            )}

            <div className="flex-1">
              <div className="text-right">
                <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-base">{displayDate}</p>
                <div className="mt-1 h-px w-44 bg-neutral-300 dark:bg-neutral-700 ml-auto" />
                <p className="mt-1 text-xs md:text-sm text-neutral-600 dark:text-neutral-300">Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPreview && (
        <p className="mt-3 text-center text-xs text-muted-foreground">Live preview. Generate to enable export options.</p>
      )}
    </div>
  );
}

export default CertificatePreview;
