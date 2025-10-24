"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

export function SimpleThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    setIsChanging(true);
    const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
    setTimeout(() => setIsChanging(false), 500);
  };

  if (!mounted) {
    return (
      <button className="w-9 h-9 rounded-lg border border-border bg-background/90 shadow-sm flex items-center justify-center">
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const Icon = theme === "system" ? Monitor : resolvedTheme === "dark" ? Moon : Sun;
  const label = theme === "system" ? "System" : resolvedTheme === "dark" ? "Dark" : "Light";

  return (
    <button
      onClick={cycleTheme}
      className="group relative w-9 h-9 rounded-lg border border-border/80 hover:border-border flex items-center justify-center bg-background/90 hover:bg-accent/50 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden p-0"
      aria-label={`Current theme: ${label}. Click to cycle themes`}
    >
      <div className={`transition-all duration-500 flex items-center justify-center ${isChanging ? "scale-0 rotate-180 opacity-0" : "scale-100 rotate-0 opacity-100"}`}>
        <Icon className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
      </div>
      {isChanging && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap bg-popover text-popover-foreground px-2 py-1 rounded shadow-md pointer-events-none z-10">
        {label}
      </span>
    </button>
  );
}
