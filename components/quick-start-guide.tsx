'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles, FileText, Zap, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';

export function QuickStartGuide() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const steps = [
    {
      icon: FileText,
      title: 'Choose Your Document',
      description: 'Select from Resume, CV, Cover Letter, Presentation, or Diagram',
      gradient: 'bolt-gradient',
      borderColor: 'border-blue-200/30'
    },
    {
      icon: Sparkles,
      title: 'Fill in Details',
      description: 'All fields are optional - add what you have, AI will help with the rest',
      gradient: 'sunset-gradient',
      borderColor: 'border-amber-200/30'
    },
    {
      icon: Zap,
      title: 'Generate with AI',
      description: 'Our AI creates a professional, ATS-optimized document in seconds',
      gradient: 'forest-gradient',
      borderColor: 'border-emerald-200/30'
    },
    {
      icon: CheckCircle,
      title: 'Download & Use',
      description: 'Export as PDF, Word, or PowerPoint and start applying!',
      gradient: 'cosmic-gradient',
      borderColor: 'border-purple-200/30'
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="glass-effect border-blue-400/20 relative overflow-hidden shadow-xl">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 pointer-events-none"></div>
          
          <div className="absolute top-3 right-3 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
          
          <CardHeader className="text-center pb-6 relative">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full glass-effect border border-blue-200/30 mb-4 mx-auto">
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
              <span className="text-sm font-semibold bolt-gradient-text">Get Started in 4 Easy Steps</span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Quick Start Guide
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first professional document in minutes
            </p>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="relative group">
                  {/* Connector line (hidden on mobile, shown on larger screens) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 opacity-30 z-0"></div>
                  )}
                  
                  <div className={`relative flex flex-col items-start gap-3 p-4 rounded-xl glass-effect border ${step.borderColor} hover:scale-105 transition-all duration-300`}>
                    {/* Step number and icon */}
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-10 h-10 rounded-full ${step.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform`}>
                        {index + 1}
                      </div>
                      <div className={`w-10 h-10 rounded-lg ${step.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <step.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-2 group-hover:bolt-gradient-text transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    {index < steps.length - 1 && (
                      <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400 opacity-50" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pro tip section */}
            <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50/80 to-amber-50/80 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-xl border border-yellow-200/40 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Pro Tip
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                    Sign in to save your documents, access them from any device, and unlock premium features like unlimited exports and advanced AI customization!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
