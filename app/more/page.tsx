'use client';

import { SiteHeader } from '@/components/site-header';
import { Sparkles, Zap, Star, Wand2, Plus, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  CreditCard,
  FileImage,
  FileText,
  BarChart3,
  Mail as Newsletter,
  Share2,
  ClipboardList,
  Calendar,
  BookOpen,
  UtensilsCrossed,
  PartyPopper,
  IdCard,
} from 'lucide-react';

const moreDocumentTypes = [
  {
    title: 'Business Cards',
    description: 'Professional contact cards with customizable layouts and modern designs',
    icon: CreditCard,
    href: '/more/business-card',
    gradient: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-200/30',
    features: ['Multiple Layouts', 'QR Code Integration', 'Print Ready'],
    badge: 'Professional',
    status: 'available',
  },
  {
    title: 'Flyers & Posters',
    description: 'Marketing materials with drag-and-drop design elements and eye-catching layouts',
    icon: FileImage,
    href: '/more/flyer',
    gradient: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-200/30',
    features: ['Drag & Drop', 'High Resolution', 'Templates'],
    badge: 'Creative',
    status: 'available',
  },
  {
    title: 'Contracts & Agreements',
    description: 'Legal document templates with clause libraries and customizable terms',
    icon: FileText,
    href: '/more/contract',
    gradient: 'from-gray-600 to-gray-800',
    borderColor: 'border-gray-200/30',
    features: ['Clause Library', 'Legal Templates', 'E-Signature Ready'],
    badge: 'Legal',
    status: 'available',
  },
  {
    title: 'Reports & Proposals',
    description: 'Structured business documents with charts, tables, and professional formatting',
    icon: BarChart3,
    href: '/more/report',
    gradient: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-200/30',
    features: ['Charts & Graphs', 'Data Tables', 'Executive Summary'],
    badge: 'Business',
    status: 'available',
  },
  {
    title: 'Newsletters',
    description: 'Email and newsletter templates with content blocks and responsive design',
    icon: Newsletter,
    href: '/more/newsletter',
    gradient: 'from-orange-500 to-red-500',
    borderColor: 'border-orange-200/30',
    features: ['Content Blocks', 'Responsive', 'HTML Export'],
    badge: 'Marketing',
    status: 'available',
  },
  {
    title: 'Social Media Graphics',
    description: 'Platform-specific image templates for Instagram, LinkedIn, Twitter, and more',
    icon: Share2,
    href: '/more/social-media',
    gradient: 'from-pink-500 to-rose-500',
    borderColor: 'border-pink-200/30',
    features: ['Multi-Platform', 'Optimized Sizes', 'Brand Kit'],
    badge: 'Trending',
    status: 'available',
  },
  {
    title: 'Forms & Surveys',
    description: 'Customizable forms with response collection and data analysis',
    icon: ClipboardList,
    href: '/more/form',
    gradient: 'from-indigo-500 to-blue-500',
    borderColor: 'border-indigo-200/30',
    features: ['Response Collection', 'Analytics', 'Custom Fields'],
    badge: 'Interactive',
    status: 'available',
  },
  {
    title: 'Calendars & Planners',
    description: 'Monthly and yearly calendars with event integration and customizable layouts',
    icon: Calendar,
    href: '/more/calendar',
    gradient: 'from-teal-500 to-cyan-500',
    borderColor: 'border-teal-200/30',
    features: ['Event Integration', 'Custom Themes', 'Print & Digital'],
    badge: 'Productivity',
    status: 'available',
  },
  {
    title: 'Brochures & Pamphlets',
    description: 'Multi-page marketing materials with professional layouts and fold options',
    icon: BookOpen,
    href: '/more/brochure',
    gradient: 'from-amber-500 to-yellow-500',
    borderColor: 'border-amber-200/30',
    features: ['Multi-Page', 'Fold Options', 'Image Gallery'],
    badge: 'Marketing',
    status: 'available',
  },
  {
    title: 'Menus & Price Lists',
    description: 'Restaurant and hotel menu templates with pricing tables and item descriptions',
    icon: UtensilsCrossed,
    href: '/more/menu',
    gradient: 'from-red-500 to-orange-500',
    borderColor: 'border-red-200/30',
    features: ['Price Tables', 'Categories', 'Photo Menu'],
    badge: 'Hospitality',
    status: 'available',
  },
  {
    title: 'Event Invitations',
    description: 'Customizable invitation cards for weddings, parties, and corporate events',
    icon: PartyPopper,
    href: '/more/invitation',
    gradient: 'from-violet-500 to-purple-500',
    borderColor: 'border-violet-200/30',
    features: ['RSVP Tracking', 'Custom Designs', 'Digital & Print'],
    badge: 'Events',
    status: 'available',
  },
  {
    title: 'ID Cards & Badges',
    description: 'Employee and student ID templates with photo integration and barcode support',
    icon: IdCard,
    href: '/more/id-card',
    gradient: 'from-slate-500 to-gray-600',
    borderColor: 'border-slate-200/30',
    features: ['Photo Upload', 'Barcode Support', 'Security Features'],
    badge: 'Corporate',
    status: 'available',
  },
];

export default function MorePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background elements matching landing page */}
      <div className="absolute inset-0 mesh-gradient opacity-20"></div>
      <div className="floating-orb w-32 h-32 sm:w-48 sm:h-48 bolt-gradient opacity-15 top-20 -left-24"></div>
      <div className="floating-orb w-24 h-24 sm:w-36 sm:h-36 bolt-gradient opacity-20 bottom-20 -right-18"></div>
      <div className="floating-orb w-40 h-40 sm:w-56 sm:h-56 bolt-gradient opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23000000' fill-opacity='1'%3e%3ccircle cx='30' cy='30' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
        }}
      />

      <SiteHeader />
      <main className="flex-1 relative z-10 page-with-header">
        <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4 sm:mb-6 shimmer">
              <Plus className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">More Document Types</span>
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Explore More{' '}
              <span className="bolt-gradient-text relative inline-block">
                Professional Documents
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2">
                  <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-500 animate-bounce" />
                </div>
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0">
              Discover our complete suite of{' '}
              <span className="font-semibold text-yellow-600">document creation tools</span> - from
              business cards to event invitations, we've got you covered with{' '}
              <span className="font-semibold bolt-gradient-text">AI-powered magic</span>
            </p>

            {/* Stats bar */}
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
              <div className="glass-effect px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                <span className="bolt-gradient-text font-bold text-sm">12+</span>
                <span className="text-muted-foreground text-xs ml-1">Document Types</span>
              </div>
              <div className="glass-effect px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                <span className="bolt-gradient-text font-bold text-sm">AI</span>
                <span className="text-muted-foreground text-xs ml-1">Powered</span>
              </div>
              <div className="glass-effect px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                <span className="bolt-gradient-text font-bold text-sm">Pro</span>
                <span className="text-muted-foreground text-xs ml-1">Templates</span>
              </div>
            </div>
          </div>

          {/* Document Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {moreDocumentTypes.map((doc, index) => (
              <Card
                key={doc.title}
                className="group relative !bg-white dark:!bg-gray-900 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 !border !border-gray-200 dark:!border-gray-700 overflow-hidden animate-fade-in-up rounded-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Badge */}
                {doc.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg">
                      <Star className="h-3 w-3" />
                      {doc.badge}
                    </div>
                  </div>
                )}

                {/* Gradient background overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${doc.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300`}
                ></div>

                <CardHeader className="pb-4 relative z-10">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${doc.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                  >
                    <doc.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:bolt-gradient-text transition-colors">
                    {doc.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed mt-2 text-gray-600 dark:text-gray-400">
                    {doc.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {doc.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Zap className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    asChild
                    className="w-full group/btn !bg-white dark:!bg-gray-800 hover:!bg-gray-50 dark:hover:!bg-gray-700 !text-gray-900 dark:!text-white hover:!text-gray-900 dark:hover:!text-white !border-2 !border-gray-300 dark:!border-gray-600 hover:!border-blue-500 dark:hover:!border-blue-400 transition-all"
                    variant="outline"
                  >
                    <Link
                      href={doc.href}
                      className="flex items-center justify-center gap-2 !text-gray-900 dark:!text-white hover:!text-gray-900 dark:hover:!text-white"
                    >
                      <span className="font-semibold">Create {doc.title}</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center mt-12 sm:mt-16">
            <div className="glass-effect p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto hover:scale-105 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute inset-0 shimmer opacity-30"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
                  <span className="font-semibold bolt-gradient-text text-lg">
                    Ready to create something amazing?
                  </span>
                  <Star className="h-5 w-5 text-blue-500 animate-pulse" />
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Join thousands creating professional documents with AI-powered tools
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="glass-effect px-4 py-2 rounded-full text-xs hover:scale-105 transition-transform duration-300">
                    <Star className="inline h-3 w-3 text-yellow-500 mr-1" />
                    <span className="bolt-gradient-text font-semibold">12+ Document Types</span>
                  </div>
                  <div className="glass-effect px-4 py-2 rounded-full text-xs hover:scale-105 transition-transform duration-300">
                    <Zap className="inline h-3 w-3 text-blue-500 mr-1" />
                    <span className="bolt-gradient-text font-semibold">AI Powered</span>
                  </div>
                  <div className="glass-effect px-4 py-2 rounded-full text-xs hover:scale-105 transition-transform duration-300">
                    <Sparkles className="inline h-3 w-3 text-purple-500 mr-1" />
                    <span className="bolt-gradient-text font-semibold">Professional Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
