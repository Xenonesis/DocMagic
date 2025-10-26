'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PresentationPreview } from '@/components/presentation/presentation-preview';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FullViewPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [presentation, setPresentation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await fetch(`/api/presentations/${params.id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load presentation');
        }

        const data = await response.json();
        setPresentation(data);

        // Update page title
        if (data.title) {
          document.title = `${data.title} - Full View`;
        }
      } catch (error) {
        console.error('Error loading presentation:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load presentation',
          variant: 'destructive',
        });

        // Close tab after showing error
        setTimeout(() => {
          if (window.history.length <= 1) {
            window.close();
          } else {
            router.back();
          }
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPresentation();
    }
  }, [params.id, router, toast]);

  const handleExit = () => {
    // If opened in new tab, close it; otherwise go back
    if (window.history.length <= 1) {
      window.close();
    } else {
      router.back();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // If opened in new tab, close it; otherwise go back
        if (window.history.length <= 1) {
          window.close();
        } else {
          router.back();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!presentation) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      {/* Exit Button */}
      <div className="absolute top-4 left-4 z-[100]">
        <Button
          variant="outline"
          size="icon"
          onClick={handleExit}
          className="h-12 w-12 rounded-full bg-black/80 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-xl"
          title="Exit Full View (Esc)"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Full Screen Presentation */}
      <div className="flex-1 w-full h-full overflow-hidden">
        <PresentationPreview slides={presentation.slides} template={presentation.template} />
      </div>
    </div>
  );
}
