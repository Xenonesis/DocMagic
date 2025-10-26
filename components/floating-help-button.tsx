'use client';

import { useState } from 'react';
import { HelpCircle, X, MessageCircle, Book, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function FloatingHelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Help Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="help-menu"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bolt-gradient text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <HelpCircle className="h-6 w-6" />}
        <span className="sr-only">Help & Support</span>
      </Button>

      {/* Help Menu */}
      {isOpen && (
        <Card id="help-menu" className="fixed bottom-24 right-6 z-40 w-80 glass-effect border-blue-400/20 shadow-xl animate-in slide-in-from-bottom-5" role="dialog" aria-modal="false" aria-label="Help menu">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/documentation"
              onClick={() => setIsOpen(false)}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
            >
              <Book className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm group-hover:text-blue-600">Documentation</h3>
                <p className="text-xs text-muted-foreground">Learn how to use all features</p>
              </div>
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
            >
              <Mail className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm group-hover:text-green-600">
                  Contact Support
                </h3>
                <p className="text-xs text-muted-foreground">Get help from our team</p>
              </div>
            </Link>

            <div className="pt-3 border-t border-border/20">
              <div className="bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200/30">
                <p className="text-xs text-center">
                  💡 <strong>Quick Tip:</strong> All fields are optional in the guided resume
                  builder!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
