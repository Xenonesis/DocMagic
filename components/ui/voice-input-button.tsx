'use client';

/**
 * Voice Input Button Component
 * Reusable component for voice-to-text input with visual feedback
 */

import { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVoiceInput } from '@/hooks/use-voice-input';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'secondary';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  autoAppend?: boolean;
  defaultLanguage?: string;
}

export function VoiceInputButton({
  onTranscript,
  className,
  buttonVariant = 'outline',
  buttonSize = 'default',
  autoAppend = false,
  defaultLanguage = 'en-US',
}: VoiceInputButtonProps) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [showSettings, setShowSettings] = useState(false);

  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
    supportedLanguages,
  } = useVoiceInput({
    language,
    autoAppend,
    continuous: true,
    interimResults: true,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        onTranscript(text);
      }
    },
  });

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant="outline"
        size={buttonSize}
        disabled
        className={cn('gap-2', className)}
      >
        <MicOff className="h-4 w-4" />
        Not Supported
      </Button>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant={isListening ? 'destructive' : buttonVariant}
        size={buttonSize}
        onClick={handleToggleListening}
        className={cn(
          'gap-2 transition-all',
          isListening && 'animate-pulse'
        )}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            Start Recording
          </>
        )}
      </Button>

      <Popover open={showSettings} onOpenChange={setShowSettings}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Voice Input Settings</h4>
              <p className="text-sm text-muted-foreground">
                Configure language and recognition settings
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {(isListening || interimTranscript) && (
        <div className="flex items-center gap-2">
          {isListening && <Loader2 className="h-4 w-4 animate-spin text-red-500" />}
          {interimTranscript && (
            <span className="text-sm text-muted-foreground italic">
              {interimTranscript}...
            </span>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
