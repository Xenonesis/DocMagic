'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Star, Rocket, CheckCircle, TrendingUp } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950">
      {/* Enhanced background with dark mode support */}
      <div className="absolute inset-0 mesh-gradient opacity-40 dark:opacity-30"></div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent dark:via-white/5 animate-pulse"></div>
      
      {/* Floating orbs with dark mode colors */}
      <div className="floating-orb w-96 h-96 bolt-gradient opacity-30 dark:opacity-20 top-10 -left-32 animate-float-gentle"></div>
      <div className="floating-orb w-72 h-72 sunset-gradient opacity-35 dark:opacity-25 bottom-10 -right-32 animate-float-gentle" style={{ animationDelay: '1s' }}></div>
      <div className="floating-orb w-64 h-64 ocean-gradient opacity-30 dark:opacity-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float-gentle" style={{ animationDelay: '2s' }}></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge with animation */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-effect mb-8 border-2 border-blue-400 dark:border-blue-400/30 bg-gradient-to-r from-white to-blue-50 dark:from-white/5 dark:to-white/5 backdrop-blur-sm shadow-xl animate-bounce-in">
            <Rocket className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-bounce" />
            <span className="text-base font-bold bolt-gradient-text">Ready to Get Started?</span>
            <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
          </div>

          {/* Heading with better spacing */}
          <h2 className="modern-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight px-4">
            <span className="block text-gray-900 dark:text-white mb-3">Transform Your Ideas Into</span>
            <span className="block bolt-gradient-text relative">
              Professional Documents
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-50"></div>
            </span>
          </h2>

          {/* Description with better styling */}
          <p className="modern-body text-xl sm:text-2xl lg:text-3xl text-gray-800 dark:text-gray-300 mb-4 leading-relaxed max-w-4xl mx-auto font-semibold">
            Join <span className="bolt-gradient-text font-bold">10,000+</span> professionals creating stunning documents
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            ✨ No credit card required • 🚀 Start in seconds • 💎 Free forever plan
          </p>

          {/* CTA Buttons with better styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
            <Button 
              asChild
              size="lg"
              className="bolt-gradient text-white font-bold px-12 py-7 rounded-full hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 w-full sm:w-auto text-xl group border-0 relative overflow-hidden"
            >
              <Link href="/resume" className="flex items-center gap-3 relative z-10">
                <Sparkles className="h-7 w-7 group-hover:rotate-180 transition-transform duration-500" />
                Start Creating Free
                <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>

            <Button 
              asChild
              size="lg"
              variant="outline"
              className="border-3 border-gray-900 dark:border-white text-gray-900 dark:text-white bg-white dark:bg-transparent font-bold px-12 py-7 rounded-full hover:scale-110 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 w-full sm:w-auto text-xl backdrop-blur-sm shadow-xl hover:shadow-2xl"
            >
              <Link href="/pricing" className="flex items-center gap-3">
                <Star className="h-7 w-7 fill-current" />
                View Pricing
              </Link>
            </Button>
          </div>

          {/* Trust indicators with cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl glass-effect border-2 border-green-400 dark:border-green-400/30 bg-gradient-to-br from-white to-green-50 dark:from-white/5 dark:to-white/5 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-gray-100">Instant Generation</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Create in seconds</span>
            </div>
            
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl glass-effect border-2 border-amber-400 dark:border-amber-400/30 bg-gradient-to-br from-white to-amber-50 dark:from-white/5 dark:to-white/5 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-gray-100">10K+ Happy Users</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Join the community</span>
            </div>
            
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl glass-effect border-2 border-purple-400 dark:border-purple-400/30 bg-gradient-to-br from-white to-purple-50 dark:from-white/5 dark:to-white/5 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-gray-100">AI-Powered</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Smart & efficient</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
