'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Copy,
  Download,
  RefreshCw,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUpDown,
  Check,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TextFormatter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatText = (operation: string) => {
    let result = inputText;

    switch (operation) {
      case 'uppercase':
        result = inputText.toUpperCase();
        break;
      case 'lowercase':
        result = inputText.toLowerCase();
        break;
      case 'capitalize':
        result = inputText
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        break;
      case 'sentence':
        result = inputText
          .toLowerCase()
          .split('. ')
          .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
          .join('. ');
        break;
      case 'reverse':
        result = inputText.split('').reverse().join('');
        break;
      case 'removeSpaces':
        result = inputText.replace(/\s+/g, '');
        break;
      case 'trimSpaces':
        result = inputText.replace(/\s+/g, ' ').trim();
        break;
      case 'removeLineBreaks':
        result = inputText.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
        break;
      case 'sortLines':
        result = inputText.split('\n').sort().join('\n');
        break;
      case 'removeDuplicateLines':
        result = [...new Set(inputText.split('\n'))].join('\n');
        break;
      case 'addLineNumbers':
        result = inputText
          .split('\n')
          .map((line, index) => `${index + 1}. ${line}`)
          .join('\n');
        break;
      case 'urlEncode':
        result = encodeURIComponent(inputText);
        break;
      case 'urlDecode':
        try {
          result = decodeURIComponent(inputText);
        } catch (e) {
          result = 'Error: Invalid URL encoded text';
        }
        break;
      case 'base64Encode':
        result = btoa(inputText);
        break;
      case 'base64Decode':
        try {
          result = atob(inputText);
        } catch (e) {
          result = 'Error: Invalid Base64 text';
        }
        break;
      case 'countWords':
        const words = inputText
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        const chars = inputText.length;
        const lines = inputText.split('\n').length;
        result = `Words: ${words.length}\nCharacters: ${chars}\nLines: ${lines}`;
        break;
      case 'extractEmails':
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = inputText.match(emailRegex) || [];
        result = emails.join('\n') || 'No emails found';
        break;
      case 'extractUrls':
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = inputText.match(urlRegex) || [];
        result = urls.join('\n') || 'No URLs found';
        break;
      default:
        result = inputText;
    }

    setOutputText(result);

    toast({
      title: '✨ Text Formatted',
      description: 'Your text has been formatted successfully!',
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: '📋 Copied!',
        description: 'Text copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy text',
        variant: 'destructive',
      });
    }
  };

  const downloadText = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: '💾 Downloaded',
      description: 'Text file saved successfully!',
    });
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    toast({
      title: '🗑️ Cleared',
      description: 'All text has been cleared',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5 text-yellow-500" />
          <h2 className="text-2xl font-bold">Text Formatter</h2>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            20+ Operations
          </Badge>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="input-text" className="text-base font-semibold">
            Input Text
          </Label>
          <Badge variant="outline">{inputText.length} characters</Badge>
        </div>
        <Textarea
          id="input-text"
          placeholder="Enter or paste your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[200px] font-mono text-sm resize-y"
        />
      </div>

      {/* Operation Buttons */}
      <Card className="border-yellow-400/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Text Operations
            </h3>

            {/* Case Transformations */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Case Transformations</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('uppercase')}
                  disabled={!inputText}
                >
                  UPPERCASE
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('lowercase')}
                  disabled={!inputText}
                >
                  lowercase
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('capitalize')}
                  disabled={!inputText}
                >
                  Capitalize Words
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('sentence')}
                  disabled={!inputText}
                >
                  Sentence case
                </Button>
              </div>
            </div>

            {/* Text Manipulation */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Text Manipulation</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('reverse')}
                  disabled={!inputText}
                >
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  Reverse
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('removeSpaces')}
                  disabled={!inputText}
                >
                  Remove Spaces
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('trimSpaces')}
                  disabled={!inputText}
                >
                  Trim Spaces
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('removeLineBreaks')}
                  disabled={!inputText}
                >
                  Remove Line Breaks
                </Button>
              </div>
            </div>

            {/* Line Operations */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Line Operations</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('sortLines')}
                  disabled={!inputText}
                >
                  Sort Lines
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('removeDuplicateLines')}
                  disabled={!inputText}
                >
                  Remove Duplicates
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('addLineNumbers')}
                  disabled={!inputText}
                >
                  Add Line Numbers
                </Button>
              </div>
            </div>

            {/* Encoding/Decoding */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Encoding & Decoding</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('urlEncode')}
                  disabled={!inputText}
                >
                  URL Encode
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('urlDecode')}
                  disabled={!inputText}
                >
                  URL Decode
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('base64Encode')}
                  disabled={!inputText}
                >
                  Base64 Encode
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('base64Decode')}
                  disabled={!inputText}
                >
                  Base64 Decode
                </Button>
              </div>
            </div>

            {/* Analysis & Extraction */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Analysis & Extraction
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('countWords')}
                  disabled={!inputText}
                >
                  Count Words
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('extractEmails')}
                  disabled={!inputText}
                >
                  Extract Emails
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatText('extractUrls')}
                  disabled={!inputText}
                >
                  Extract URLs
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {outputText && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex items-center justify-between">
            <Label htmlFor="output-text" className="text-base font-semibold">
              Formatted Output
            </Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                className="hover:bg-yellow-500/10 hover:border-yellow-500/30"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadText}
                className="hover:bg-blue-500/10 hover:border-blue-500/30"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearAll}
                className="hover:bg-red-500/10 hover:border-red-500/30"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
          <Textarea
            id="output-text"
            value={outputText}
            readOnly
            className="min-h-[200px] font-mono text-sm resize-y bg-muted/50"
          />
        </div>
      )}
    </div>
  );
}
