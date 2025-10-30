'use client';

import { SiteHeader } from '@/components/site-header';
import { InvitationGenerator } from '@/components/more/invitation-generator';
import { Sparkles, PartyPopper, Wand2 } from 'lucide-react';

export default function InvitationPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-20"></div>
      <SiteHeader />
      <main className="flex-1 relative z-10 flex items-center justify-center page-with-header-only">
        <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4 sm:mb-6 shimmer">
              <PartyPopper className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Invitation Studio</span>
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Design Beautiful{' '}
              <span className="bolt-gradient-text relative inline-block">
                Event Invitations
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2">
                  <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-500 animate-bounce" />
                </div>
              </span>
            </h1>
          </div>
          <div className="glass-effect p-6 sm:p-8 rounded-2xl border border-yellow-400/20 relative overflow-hidden">
            <div className="absolute inset-0 shimmer opacity-20"></div>
            <div className="relative z-10">
              <InvitationGenerator />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
