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
  Code,
  Check,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function JsonFormatter() {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentation, setIndentation] = useState('2');
  const { toast } = useToast();

  const validateAndFormat = (indent: string = indentation) => {
    if (!inputJson.trim()) {
      toast({
        title: '⚠️ Empty Input',
        description: 'Please enter JSON to format',
        variant: 'destructive',
      });
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, parseInt(indent));
      setOutputJson(formatted);
      setIsValid(true);
      setErrorMessage('');

      toast({
        title: '✨ JSON Formatted',
        description: 'Your JSON has been formatted successfully!',
      });
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);
      setOutputJson('');

      toast({
        title: '❌ Invalid JSON',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const minifyJson = () => {
    if (!inputJson.trim()) {
      toast({
        title: '⚠️ Empty Input',
        description: 'Please enter JSON to minify',
        variant: 'destructive',
      });
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setIsValid(true);
      setErrorMessage('');

      toast({
        title: '✨ JSON Minified',
        description: 'Your JSON has been minified successfully!',
      });
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);
      setOutputJson('');

      toast({
        title: '❌ Invalid JSON',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const validateOnly = () => {
    if (!inputJson.trim()) {
      toast({
        title: '⚠️ Empty Input',
        description: 'Please enter JSON to validate',
        variant: 'destructive',
      });
      return;
    }

    try {
      JSON.parse(inputJson);
      setIsValid(true);
      setErrorMessage('');

      toast({
        title: '✅ Valid JSON',
        description: 'Your JSON is valid!',
      });
    } catch (error: any) {
      setIsValid(false);
      setErrorMessage(error.message);

      toast({
        title: '❌ Invalid JSON',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const escapeJson = () => {
    if (!inputJson.trim()) return;

    const escaped = inputJson
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');

    setOutputJson(escaped);

    toast({
      title: '✨ JSON Escaped',
      description: 'Your JSON has been escaped successfully!',
    });
  };

  const unescapeJson = () => {
    if (!inputJson.trim()) return;

    const unescaped = inputJson
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t');

    setOutputJson(unescaped);

    toast({
      title: '✨ JSON Unescaped',
      description: 'Your JSON has been unescaped successfully!',
    });
  };

  const jsonToXml = () => {
    if (!inputJson.trim()) return;

    try {
      const parsed = JSON.parse(inputJson);

      const convertToXml = (obj: any, rootName: string = 'root'): string => {
        if (typeof obj !== 'object' || obj === null) {
          return `<${rootName}>${obj}</${rootName}>`;
        }

        if (Array.isArray(obj)) {
          return obj.map((item, index) => convertToXml(item, `item${index}`)).join('\n');
        }

        let xml = `<${rootName}>\n`;
        for (const [key, value] of Object.entries(obj)) {
          xml += `  ${convertToXml(value, key)}\n`;
        }
        xml += `</${rootName}>`;
        return xml;
      };

      const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + convertToXml(parsed);
      setOutputJson(xml);

      toast({
        title: '✨ Converted to XML',
        description: 'Your JSON has been converted to XML!',
      });
    } catch (error: any) {
      toast({
        title: '❌ Conversion Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const jsonToCsv = () => {
    if (!inputJson.trim()) return;

    try {
      const parsed = JSON.parse(inputJson);

      if (!Array.isArray(parsed)) {
        toast({
          title: '⚠️ Invalid Format',
          description: 'JSON must be an array of objects for CSV conversion',
          variant: 'destructive',
        });
        return;
      }

      if (parsed.length === 0) {
        setOutputJson('');
        return;
      }

      const headers = Object.keys(parsed[0]);
      const csvRows = [headers.join(',')];

      for (const row of parsed) {
        const values = headers.map((header) => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        });
        csvRows.push(values.join(','));
      }

      setOutputJson(csvRows.join('\n'));

      toast({
        title: '✨ Converted to CSV',
        description: 'Your JSON has been converted to CSV!',
      });
    } catch (error: any) {
      toast({
        title: '❌ Conversion Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: '📋 Copied!',
        description: 'JSON copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy JSON',
        variant: 'destructive',
      });
    }
  };

  const downloadJson = () => {
    const blob = new Blob([outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: '💾 Downloaded',
      description: 'JSON file saved successfully!',
    });
  };

  const clearAll = () => {
    setInputJson('');
    setOutputJson('');
    setIsValid(null);
    setErrorMessage('');
    toast({
      title: '🗑️ Cleared',
      description: 'All JSON has been cleared',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-500" />
          <h2 className="text-2xl font-bold">JSON Formatter</h2>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Validator & Converter
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="indentation" className="text-sm">
            Indent:
          </Label>
          <Select value={indentation} onValueChange={setIndentation}>
            <SelectTrigger id="indentation" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Validation Status */}
      {isValid !== null && (
        <Alert
          variant={isValid ? 'default' : 'destructive'}
          className="animate-in fade-in slide-in-from-top duration-300"
        >
          {isValid ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>✅ Valid JSON - Ready to use!</AlertDescription>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>❌ {errorMessage}</AlertDescription>
            </>
          )}
        </Alert>
      )}

      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="input-json" className="text-base font-semibold">
            Input JSON
          </Label>
          <Badge variant="outline">{inputJson.length} characters</Badge>
        </div>
        <Textarea
          id="input-json"
          placeholder='Enter or paste your JSON here... e.g., {"name": "John", "age": 30}'
          value={inputJson}
          onChange={(e) => {
            setInputJson(e.target.value);
            setIsValid(null);
            setErrorMessage('');
          }}
          className="min-h-[250px] font-mono text-sm resize-y"
        />
      </div>

      {/* Operation Buttons */}
      <Card className="border-blue-400/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              JSON Operations
            </h3>

            {/* Format & Validate */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Format & Validate</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => validateAndFormat()}
                  disabled={!inputJson}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Format JSON
                </Button>
                <Button size="sm" variant="outline" onClick={minifyJson} disabled={!inputJson}>
                  Minify
                </Button>
                <Button size="sm" variant="outline" onClick={validateOnly} disabled={!inputJson}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Validate Only
                </Button>
              </div>
            </div>

            {/* String Escape */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">String Operations</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={escapeJson} disabled={!inputJson}>
                  Escape JSON
                </Button>
                <Button size="sm" variant="outline" onClick={unescapeJson} disabled={!inputJson}>
                  Unescape JSON
                </Button>
              </div>
            </div>

            {/* Conversion */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Convert To</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={jsonToXml} disabled={!inputJson}>
                  Convert to XML
                </Button>
                <Button size="sm" variant="outline" onClick={jsonToCsv} disabled={!inputJson}>
                  Convert to CSV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {outputJson && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex items-center justify-between">
            <Label htmlFor="output-json" className="text-base font-semibold">
              Formatted Output
            </Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                className="hover:bg-blue-500/10 hover:border-blue-500/30"
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
                onClick={downloadJson}
                className="hover:bg-green-500/10 hover:border-green-500/30"
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
            id="output-json"
            value={outputJson}
            readOnly
            className="min-h-[250px] font-mono text-sm resize-y bg-muted/50"
          />
        </div>
      )}
    </div>
  );
}
