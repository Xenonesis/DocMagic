'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Star, Rocket, CheckCircle, TrendingUp } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      {/* Background elements matching other sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-50/20 to-background"></div>
      <div className="floating-orb w-96 h-96 bolt-gradient opacity-10 top-10 -left-32"></div>
      <div className="floating-orb w-72 h-72 sunset-gradient opacity-10 bottom-10 -right-32"></div>
      <div className="floating-orb w-64 h-64 cosmic-gradient opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge matching other sections */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-effect mb-6 border border-purple-200/30">
            <Rocket className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-semibold bolt-gradient-text">Ready to Get Started?</span>
          </div>

          {/* Heading matching other sections */}
          <h2 className="modern-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            <span className="block">Transform Your Ideas Into</span>
            <span className="block bolt-gradient-text">Professional Documents</span>
          </h2>

          {/* Description matching other sections */}
          <p className="modern-body text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
            Join <span className="bolt-gradient-text font-bold">10,000+</span> professionals
            creating stunning documents
          </p>
          <p className="text-sm sm:text-base text-muted-foreground mb-10 max-w-2xl mx-auto">
            ✨ No credit card required • 🚀 Start in seconds • 💎 Free forever plan
          </p>

          {/* CTA Buttons matching other sections */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              asChild
              size="lg"
              className="bolt-gradient text-white font-bold px-8 py-6 rounded-full hover:scale-105 transition-all duration-300 shadow-lg w-full sm:w-auto group"
            >
              <Link href="/resume" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Start Creating Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-bold px-8 py-6 rounded-full hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              <Link href="/pricing" className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                View Pricing
              </Link>
            </Button>
          </div>

          {/* Trust indicators matching other sections style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl glass-effect border border-green-200/30 hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <span className="text-base font-bold">Instant Generation</span>
              <span className="text-sm text-muted-foreground">Create in seconds</span>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-xl glass-effect border border-amber-200/30 hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <span className="text-base font-bold">10K+ Happy Users</span>
              <span className="text-sm text-muted-foreground">Join the community</span>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-xl glass-effect border border-purple-200/30 hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <span className="text-base font-bold">AI-Powered</span>
              <span className="text-sm text-muted-foreground">Smart & efficient</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
