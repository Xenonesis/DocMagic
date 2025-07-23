'use client';

import { ReactNode, useEffect, useRef } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";

import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import ClientRedirects from "@/components/ClientRedirects";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    let scroll: any;

    const initScroll = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      scroll = new LocomotiveScroll({
        el: scrollRef.current!,
        smooth: true,
        lerp: 0.08,
      });
    };

    initScroll();

    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  return (
    <div data-scroll-container ref={scrollRef}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ClientRedirects />
          {children}
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}
