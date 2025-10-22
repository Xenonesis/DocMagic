'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles, FileText, Zap, CheckCircle } from 'lucide-react';

export function QuickStartGuide() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const steps = [
    {
      icon: FileText,
      title: 'Choose Your Document',
      description: 'Select from Resume, CV, Cover Letter, Presentation, or Diagram',
    },
    {
      icon: Sparkles,
      title: 'Fill in Details',
      description: 'All fields are optional - add what you have, AI will help with the rest',
    },
    {
      icon: Zap,
      title: 'Generate with AI',
      description: 'Our AI creates a professional, ATS-optimized document in seconds',
    },
    {
      icon: CheckCircle,
      title: 'Download & Use',
      description: 'Export as PDF, Word, or PowerPoint and start applying!',
    },
  ];

  return (
    <Card className="glass-effect border-blue-400/20 relative overflow-hidden">
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Quick Start Guide
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bolt-gradient flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <step.icon className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200/30">
          <p className="text-xs text-center">
            💡 <strong>Pro Tip:</strong> Sign in to save your documents and access them anytime!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
