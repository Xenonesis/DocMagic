'use client';

import Link from "next/link";
import { Users, BookOpen, Star, Heart, HelpCircle, FileText } from "lucide-react";
import { TooltipWithShortcut } from "@/components/ui/tooltip";

const navItems = [
  {
    href: "/profile",
    icon: Users,
    label: "Profile",
    tooltip: "View your profile and account settings",
    gradient: "bolt-gradient",
    borderColor: "border-blue-200/30"
  },
  {
    href: "/templates",
    icon: BookOpen,
    label: "Templates",
    tooltip: "Browse and manage your templates",
    gradient: "cosmic-gradient",
    borderColor: "border-purple-200/30"
  },
  {
    href: "/pricing",
    icon: Star,
    label: "Pricing",
    tooltip: "View pricing plans and options",
    gradient: "forest-gradient",
    borderColor: "border-green-200/30"
  },
  {
    href: "/about",
    icon: Heart,
    label: "About",
    tooltip: "Learn more about docverse",
    gradient: "sunset-gradient",
    borderColor: "border-amber-200/30"
  },
  {
    href: "/contact",
    icon: HelpCircle,
    label: "Contact",
    tooltip: "Get help and contact support",
    gradient: "ocean-gradient",
    borderColor: "border-blue-200/30"
  },
  {
    href: "/documentation",
    icon: FileText,
    label: "Docs",
    tooltip: "Access documentation and guides",
    gradient: "bolt-gradient",
    borderColor: "border-indigo-200/30"
  }
];

export function QuickNavigation() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-50/30 via-background to-purple-50/30 border-y border-border/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="modern-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            <span className="bolt-gradient-text">Explore docverse</span>
          </h2>
          <p className="modern-body text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover all the powerful features and tools available
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {navItems.map((item, index) => (
            <TooltipWithShortcut key={item.href} content={item.tooltip}>
              <Link
                href={item.href}
                className={`group flex flex-col items-center p-4 rounded-xl glass-effect border ${item.borderColor} hover:scale-105 transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-12 h-12 ${item.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-center">{item.label}</span>
              </Link>
            </TooltipWithShortcut>
          ))}
        </div>
      </div>
    </section>
  );
}
