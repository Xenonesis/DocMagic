'use client';

/**
 * Smart Suggestions Panel Component
 * Real-time AI-powered content suggestions
 */

import { useState, useEffect } from 'react';
import { Lightbulb, Loader2, Check, X, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePersonalization } from '@/hooks/use-personalization';
import type { UserPreferences, ContentSuggestion } from '@/lib/personalization-service';
import { cn } from '@/lib/utils';

interface SmartSuggestionsPanelProps {
  content: string;
  documentType: 'resume' | 'cover-letter' | 'cv' | 'presentation' | 'report' | 'email' | 'other';
  preferences: UserPreferences;
  onApplySuggestion?: (suggestion: ContentSuggestion) => void;
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function SmartSuggestionsPanel({
  content,
  documentType,
  preferences,
  onApplySuggestion,
  className,
  autoRefresh = false,
  refreshInterval = 30000,
}: SmartSuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<number>>(new Set());
  
  const { generateSuggestions, isProcessing, error } = usePersonalization();

  const loadSuggestions = async () => {
    if (!content || content.length < 50) return;

    try {
      const newSuggestions = await generateSuggestions(content, {
        preferences,
        documentType,
      });
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    }
  };

  useEffect(() => {
    loadSuggestions();

    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(loadSuggestions, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [content, documentType, preferences, autoRefresh, refreshInterval]);

  const handleApplySuggestion = (suggestion: ContentSuggestion, index: number) => {
    setAppliedSuggestions(new Set(appliedSuggestions).add(index));
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    }
  };

  const handleDismissSuggestion = (index: number) => {
    setDismissedSuggestions(new Set(dismissedSuggestions).add(index));
  };

  const visibleSuggestions = suggestions.filter(
    (_, index) => !appliedSuggestions.has(index) && !dismissedSuggestions.has(index)
  );

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'improvement':
        return 'Improve';
      case 'addition':
        return 'Add';
      case 'removal':
        return 'Remove';
      case 'rewrite':
        return 'Rewrite';
      default:
        return type;
    }
  };

  if (isProcessing && suggestions.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Suggestions
          </div>
          <Badge variant="secondary">
            {visibleSuggestions.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {visibleSuggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {error ? (
                <div className="text-destructive">{error}</div>
              ) : (
                <div>
                  <Check className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No suggestions at the moment.</p>
                  <p className="text-sm">Your content looks great!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {visibleSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(suggestion.priority)}
                      <Badge variant={getPriorityColor(suggestion.priority) as any}>
                        {suggestion.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeLabel(suggestion.type)}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismissSuggestion(suggestions.indexOf(suggestion))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-sm mb-1">{suggestion.section}</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {suggestion.reason}
                    </div>
                  </div>

                  {suggestion.original && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium">Current:</div>
                      <div className="p-2 bg-muted rounded text-sm">
                        {suggestion.original}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-xs font-medium">Suggestion:</div>
                    <div className="p-2 bg-green-50 dark:bg-green-950 rounded text-sm">
                      {suggestion.suggested}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                      Impact: {suggestion.impact}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleApplySuggestion(suggestion, suggestions.indexOf(suggestion))}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {visibleSuggestions.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={loadSuggestions}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                'Refresh Suggestions'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
