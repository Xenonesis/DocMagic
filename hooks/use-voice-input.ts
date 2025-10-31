/**
 * React Hook for Voice-to-Text Input
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  voiceToTextService,
  type VoiceRecognitionOptions,
  type VoiceRecognitionResult,
} from '@/lib/voice-to-text';

interface UseVoiceInputOptions extends VoiceRecognitionOptions {
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  autoAppend?: boolean; // Automatically append to existing transcript
}

interface UseVoiceInputReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  supportedLanguages: Array<{ code: string; name: string }>;
}

export function useVoiceInput(options: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(() => voiceToTextService.isBrowserSupported());
  
  const finalTranscriptRef = useRef('');
  const optionsRef = useRef(options);

  // Update options ref when they change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const handleResult = useCallback((result: VoiceRecognitionResult) => {
    const { transcript: newTranscript, isFinal } = result;

    if (isFinal) {
      const updatedTranscript = optionsRef.current.autoAppend
        ? finalTranscriptRef.current + ' ' + newTranscript
        : newTranscript;
      
      finalTranscriptRef.current = updatedTranscript;
      setTranscript(updatedTranscript);
      setInterimTranscript('');
      
      if (optionsRef.current.onTranscript) {
        optionsRef.current.onTranscript(updatedTranscript, true);
      }
    } else {
      setInterimTranscript(newTranscript);
      
      if (optionsRef.current.onTranscript) {
        optionsRef.current.onTranscript(newTranscript, false);
      }
    }
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsListening(false);
    
    if (optionsRef.current.onError) {
      optionsRef.current.onError(errorMessage);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      handleError('Voice recognition is not supported in your browser');
      return;
    }

    setError(null);
    setIsListening(true);
    
    voiceToTextService.startListening(handleResult, handleError, {
      language: options.language,
      continuous: options.continuous,
      interimResults: options.interimResults ?? true,
      maxAlternatives: options.maxAlternatives,
    });
  }, [isSupported, options, handleResult, handleError]);

  const stopListening = useCallback(() => {
    voiceToTextService.stopListening();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      voiceToTextService.stopListening();
    };
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
    supportedLanguages: voiceToTextService.getSupportedLanguages(),
  };
}
