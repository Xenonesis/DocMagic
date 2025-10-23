'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Star, Rocket } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
      <div className="absolute inset-0 mesh-gradient opacity-30"></div>
      
      {/* Floating orbs */}
      <div className="floating-orb w-96 h-96 bg-white/10 top-10 -left-32"></div>
      <div className="floating-orb w-72 h-72 bg-white/10 bottom-10 -right-32"></div>
      <div className="floating-orb w-64 h-64 bg-white/10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-effect mb-8 border border-white/30 bg-white/10 backdrop-blur-sm">
            <Rocket className="h-5 w-5 text-white" />
            <span className="text-base font-semibold text-white">Ready to Get Started?</span>
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block mb-2">Transform Your Ideas</span>
            <span className="block">Into Professional Documents</span>
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Join thousands of professionals who trust docverse to create stunning documents in seconds. 
            No credit card required to start.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button 
              asChild
              size="lg"
              className="bg-white text-blue-600 font-bold px-10 py-6 rounded-full hover:scale-105 hover:bg-white/95 transition-all duration-300 shadow-2xl w-full sm:w-auto text-lg group"
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
              className="border-2 border-white text-white font-bold px-10 py-6 rounded-full hover:scale-105 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto text-lg backdrop-blur-sm"
            >
              <Link href="/pricing" className="flex items-center gap-3">
                <Star className="h-6 w-6" />
                View Pricing
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">Instant Generation</span>
            </div>
            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-300 fill-current" />
              <span className="text-sm font-medium">10K+ Happy Users</span>
            </div>
            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
