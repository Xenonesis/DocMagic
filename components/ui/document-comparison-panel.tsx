'use client';

/**
 * Document Comparison Panel Component
 * Side-by-side comparison of document versions with detailed diff analysis
 */

import { useState, useEffect } from 'react';
import { GitCompare, Loader2, FileText, BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDocumentComparison } from '@/hooks/use-document-comparison';
import { cn } from '@/lib/utils';

interface DocumentComparisonPanelProps {
  originalContent: string;
  modifiedContent?: string;
  originalLabel?: string;
  modifiedLabel?: string;
  onClose?: () => void;
  className?: string;
}

export function DocumentComparisonPanel({
  originalContent,
  modifiedContent: initialModifiedContent = '',
  originalLabel = 'Original Version',
  modifiedLabel = 'Modified Version',
  onClose,
  className,
}: DocumentComparisonPanelProps) {
  const [open, setOpen] = useState(false);
  const [modifiedContent, setModifiedContent] = useState(initialModifiedContent);
  const [comparisonMode, setComparisonMode] = useState<'chars' | 'words' | 'lines' | 'sentences'>('words');
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified' | 'inline'>('side-by-side');
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [sideBySideView, setSideBySideView] = useState<any>(null);

  const {
    compare,
    generateSideBySide,
    generateHTMLDiff,
    getUnifiedDiff,
    calculateSimilarity,
    isComparing,
  } = useDocumentComparison();

  useEffect(() => {
    if (open && originalContent && modifiedContent) {
      performComparison();
    }
  }, [open, originalContent, modifiedContent, comparisonMode]);

  const performComparison = () => {
    try {
      const result = compare(originalContent, modifiedContent, {
        mode: comparisonMode,
        ignoreWhitespace: false,
        ignoreCase: false,
      });
      setComparisonResult(result);

      const sideBySide = generateSideBySide(originalContent, modifiedContent, {
        mode: comparisonMode,
      });
      setSideBySideView(sideBySide);
    } catch (err) {
      console.error('Comparison failed:', err);
    }
  };

  const handleExportDiff = () => {
    const unifiedDiff = getUnifiedDiff(originalContent, modifiedContent, {
      mode: 'lines',
    });

    const blob = new Blob([unifiedDiff], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document-comparison.diff';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const similarity = comparisonResult 
    ? (100 - comparisonResult.statistics.changePercentage).toFixed(1)
    : '0';

  const renderSideBySide = () => {
    if (!sideBySideView) return null;

    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="font-medium mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {originalLabel}
          </div>
          <ScrollArea className="h-[500px] border rounded-lg p-4">
            <div className="space-y-1 font-mono text-sm">
              {sideBySideView.left.map((item: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    'px-2 py-1 rounded',
                    item.type === 'removed' && 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100',
                    item.type === 'unchanged' && 'bg-transparent'
                  )}
                >
                  {item.content || '\u00A0'}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <div className="font-medium mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {modifiedLabel}
          </div>
          <ScrollArea className="h-[500px] border rounded-lg p-4">
            <div className="space-y-1 font-mono text-sm">
              {sideBySideView.right.map((item: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    'px-2 py-1 rounded',
                    item.type === 'added' && 'bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100',
                    item.type === 'unchanged' && 'bg-transparent'
                  )}
                >
                  {item.content || '\u00A0'}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  };

  const renderUnified = () => {
    const unifiedDiff = getUnifiedDiff(originalContent, modifiedContent, {
      mode: 'lines',
    });

    return (
      <ScrollArea className="h-[500px] border rounded-lg p-4">
        <pre className="font-mono text-sm whitespace-pre-wrap">
          {unifiedDiff}
        </pre>
      </ScrollArea>
    );
  };

  const renderInline = () => {
    const htmlDiff = generateHTMLDiff(originalContent, modifiedContent, {
      mode: comparisonMode,
    });

    return (
      <ScrollArea className="h-[500px] border rounded-lg p-4">
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlDiff }}
        />
      </ScrollArea>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <GitCompare className="mr-2 h-4 w-4" />
          Compare Versions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Document Comparison
          </DialogTitle>
          <DialogDescription>
            Compare two versions of your document side-by-side with detailed diff analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!modifiedContent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Paste Modified Version</Label>
                <Textarea
                  placeholder="Paste the modified version of your document here..."
                  value={modifiedContent}
                  onChange={(e) => setModifiedContent(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <Button
                onClick={performComparison}
                disabled={!modifiedContent}
                className="w-full"
              >
                Start Comparison
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Comparison Mode</Label>
                  <Select value={comparisonMode} onValueChange={(value: any) => setComparisonMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="words">Words</SelectItem>
                      <SelectItem value="lines">Lines</SelectItem>
                      <SelectItem value="chars">Characters</SelectItem>
                      <SelectItem value="sentences">Sentences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>View Mode</Label>
                  <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="side-by-side">Side by Side</SelectItem>
                      <SelectItem value="unified">Unified Diff</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Actions</Label>
                  <Button
                    variant="outline"
                    onClick={handleExportDiff}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Diff
                  </Button>
                </div>
              </div>

              {comparisonResult && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      <span className="font-medium">Comparison Statistics</span>
                    </div>
                    <Badge variant="secondary" className="text-lg">
                      {similarity}% Similar
                    </Badge>
                  </div>

                  <Progress value={parseFloat(similarity)} className="h-2" />

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-2 bg-green-100 dark:bg-green-950 rounded">
                      <div className="font-bold text-lg text-green-700 dark:text-green-300">
                        {comparisonResult.statistics.additions}
                      </div>
                      <div className="text-xs text-muted-foreground">Additions</div>
                    </div>
                    <div className="text-center p-2 bg-red-100 dark:bg-red-950 rounded">
                      <div className="font-bold text-lg text-red-700 dark:text-red-300">
                        {comparisonResult.statistics.deletions}
                      </div>
                      <div className="text-xs text-muted-foreground">Deletions</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-100 dark:bg-yellow-950 rounded">
                      <div className="font-bold text-lg text-yellow-700 dark:text-yellow-300">
                        {comparisonResult.statistics.modifications}
                      </div>
                      <div className="text-xs text-muted-foreground">Modifications</div>
                    </div>
                    <div className="text-center p-2 bg-blue-100 dark:bg-blue-950 rounded">
                      <div className="font-bold text-lg text-blue-700 dark:text-blue-300">
                        {comparisonResult.statistics.unchanged}
                      </div>
                      <div className="text-xs text-muted-foreground">Unchanged</div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    {comparisonResult.summary}
                  </div>
                </div>
              )}

              {isComparing ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div>
                  {viewMode === 'side-by-side' && renderSideBySide()}
                  {viewMode === 'unified' && renderUnified()}
                  {viewMode === 'inline' && renderInline()}
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
