'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Star, Rocket, CheckCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950">
      {/* Enhanced background with dark mode support */}
      <div className="absolute inset-0 mesh-gradient opacity-20 dark:opacity-30"></div>
      
      {/* Floating orbs with dark mode colors */}
      <div className="floating-orb w-96 h-96 bolt-gradient opacity-10 dark:opacity-20 top-10 -left-32"></div>
      <div className="floating-orb w-72 h-72 sunset-gradient opacity-15 dark:opacity-25 bottom-10 -right-32"></div>
      <div className="floating-orb w-64 h-64 ocean-gradient opacity-10 dark:opacity-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-effect mb-8 border border-blue-200/30 dark:border-blue-400/30 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
            <Rocket className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-base font-semibold bolt-gradient-text">Ready to Get Started?</span>
            <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
          </div>

          {/* Heading */}
          <h2 className="modern-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="block text-gray-900 dark:text-white">Transform Your Ideas Into <span className="bolt-gradient-text">Professional Documents</span></span>
          </h2>

          {/* Description */}
          <p className="modern-body text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Join thousands of professionals who trust docverse to create stunning documents in seconds. 
            No credit card required to start.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
            <Button 
              asChild
              size="lg"
              className="bolt-gradient text-white font-bold px-10 py-6 rounded-full hover:scale-105 transition-all duration-300 shadow-2xl w-full sm:w-auto text-lg group border-0"
            >
              <Link href="/resume" className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 group-hover:animate-spin" />
                Start Creating Free
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white bg-white dark:bg-transparent font-bold px-10 py-6 rounded-full hover:scale-105 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 w-full sm:w-auto text-lg backdrop-blur-sm shadow-lg"
            >
              <Link href="/pricing" className="flex items-center gap-3">
                <Star className="h-6 w-6" />
                View Pricing
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-green-200/30 dark:border-green-400/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Instant Generation</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-blue-200/30 dark:border-blue-400/30">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">10K+ Happy Users</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-purple-200/30 dark:border-purple-400/30">
              <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
