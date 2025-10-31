/**
 * Voice-to-Text Service
 * Web Speech API integration for voice input across all document types
 */

export interface VoiceRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export type VoiceRecognitionCallback = (result: VoiceRecognitionResult) => void;
export type VoiceRecognitionErrorCallback = (error: string) => void;

class VoiceToTextService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.isSupported = true;
      }
    }
  }

  /**
   * Check if voice recognition is supported in the current browser
   */
  public isBrowserSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Check if currently listening
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Start voice recognition
   */
  public startListening(
    onResult: VoiceRecognitionCallback,
    onError: VoiceRecognitionErrorCallback,
    options: VoiceRecognitionOptions = {}
  ): void {
    if (!this.recognition) {
      onError('Voice recognition is not supported in your browser');
      return;
    }

    if (this.isListening) {
      return; // Already listening
    }

    // Configure recognition
    this.recognition.lang = options.language || 'en-US';
    this.recognition.continuous = options.continuous ?? true;
    this.recognition.interimResults = options.interimResults ?? true;
    this.recognition.maxAlternatives = options.maxAlternatives || 1;

    // Handle results
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;
      const isFinal = result.isFinal;

      onResult({
        transcript,
        confidence,
        isFinal,
      });
    };

    // Handle errors
    this.recognition.onerror = (event: any) => {
      let errorMessage = 'An error occurred during voice recognition';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech was detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone was found. Please ensure your microphone is connected.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission was denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your connection.';
          break;
        case 'aborted':
          errorMessage = 'Voice recognition was aborted.';
          break;
        default:
          errorMessage = `Voice recognition error: ${event.error}`;
      }

      onError(errorMessage);
      this.isListening = false;
    };

    // Handle end
    this.recognition.onend = () => {
      this.isListening = false;
    };

    // Start recognition
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      onError('Failed to start voice recognition');
      this.isListening = false;
    }
  }

  /**
   * Stop voice recognition
   */
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Abort voice recognition immediately
   */
  public abortListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  /**
   * Get list of supported languages
   */
  public getSupportedLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'es-ES', name: 'Spanish (Spain)' },
      { code: 'es-MX', name: 'Spanish (Mexico)' },
      { code: 'fr-FR', name: 'French' },
      { code: 'de-DE', name: 'German' },
      { code: 'it-IT', name: 'Italian' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)' },
      { code: 'pt-PT', name: 'Portuguese (Portugal)' },
      { code: 'ru-RU', name: 'Russian' },
      { code: 'zh-CN', name: 'Chinese (Simplified)' },
      { code: 'zh-TW', name: 'Chinese (Traditional)' },
      { code: 'ja-JP', name: 'Japanese' },
      { code: 'ko-KR', name: 'Korean' },
      { code: 'ar-SA', name: 'Arabic' },
      { code: 'hi-IN', name: 'Hindi' },
      { code: 'nl-NL', name: 'Dutch' },
      { code: 'pl-PL', name: 'Polish' },
      { code: 'tr-TR', name: 'Turkish' },
      { code: 'sv-SE', name: 'Swedish' },
      { code: 'da-DK', name: 'Danish' },
      { code: 'no-NO', name: 'Norwegian' },
      { code: 'fi-FI', name: 'Finnish' },
    ];
  }
}

// Export singleton instance
export const voiceToTextService = new VoiceToTextService();
