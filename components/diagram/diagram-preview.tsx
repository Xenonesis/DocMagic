"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiagramPreviewProps {
  code: string;
  fullScreen?: boolean;
}

export function DiagramPreview({ code, fullScreen = false }: DiagramPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // Dynamically import mermaid to avoid SSR issues
    const loadMermaid = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, sans-serif',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          },
          sequence: {
            useMaxWidth: true,
            wrap: true
          },
          gantt: {
            useMaxWidth: true
          },
          journey: {
            useMaxWidth: true
          },
          gitGraph: {
            useMaxWidth: true
          },
          er: {
            useMaxWidth: true
          },
          class: {
            useMaxWidth: true
          }
        });
        
        setMermaidLoaded(true);
      } catch (err) {
        console.error('Failed to load Mermaid:', err);
        setError('Failed to load diagram renderer');
        setIsLoading(false);
      }
    };

    loadMermaid();
  }, []);

  useEffect(() => {
    if (!mermaidLoaded) {
      return;
    }

    if (!code.trim()) {
      setIsLoading(false);
      setError(null);
      return;
    }

    const renderDiagram = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const mermaid = (await import('mermaid')).default;
        
        // Basic validation to check if code looks like Mermaid syntax
        const trimmedCode = code.trim();
        const validDiagramTypes = [
          'flowchart', 'graph', 'sequenceDiagram', 'classDiagram', 
          'stateDiagram', 'erDiagram', 'journey', 'gantt', 'pie',
          'gitGraph', 'mindmap', 'timeline', 'quadrantChart'
        ];
        
        const hasValidDiagramType = validDiagramTypes.some(type => 
          trimmedCode.toLowerCase().startsWith(type.toLowerCase())
        );
        
        if (!hasValidDiagramType) {
          setError('Please start your diagram with a valid Mermaid diagram type (e.g., flowchart TD, sequenceDiagram, classDiagram, etc.)');
          setIsLoading(false);
          return;
        }
        
        if (containerRef.current) {
          // Clear previous content
          containerRef.current.innerHTML = '';
          
          // Create a unique ID for this diagram
          const diagramId = `mermaid-diagram-${Date.now()}`;
          
          // Validate and render the diagram
          const { svg } = await mermaid.render(diagramId, code);
          
          // Create container div with the expected ID
          const diagramContainer = document.createElement('div');
          diagramContainer.id = 'mermaid-diagram';
          diagramContainer.innerHTML = svg;
          diagramContainer.style.display = 'flex';
          diagramContainer.style.justifyContent = 'center';
          diagramContainer.style.alignItems = 'center';
          diagramContainer.style.minHeight = fullScreen ? '500px' : '300px';
          diagramContainer.style.padding = '20px';
          
          containerRef.current.appendChild(diagramContainer);
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        let errorMessage = 'Invalid diagram syntax. Please check your Mermaid code.';
        
        if (err instanceof Error) {
          if (err.message.includes('No diagram type detected')) {
            errorMessage = 'No valid diagram type detected. Please start with a diagram type like "flowchart TD", "sequenceDiagram", "classDiagram", etc.';
          } else if (err.message.includes('Please start your diagram')) {
            errorMessage = err.message;
          } else if (err.message.includes('Parse error')) {
            errorMessage = 'Syntax error in your diagram code. Please check for missing brackets, quotes, or invalid characters.';
          }
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the rendering to avoid too many re-renders
    const timeoutId = setTimeout(renderDiagram, 500);
    return () => clearTimeout(timeoutId);
  }, [code, mermaidLoaded, fullScreen]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (!code.trim()) {
    return (
      <Card className="h-full flex items-center justify-center min-h-[300px]">
        <CardContent className="text-center py-12">
          <div className="text-muted-foreground space-y-4">
            <div className="inline-block p-4 rounded-full bg-muted/30 mb-2">
              <Loader2 className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="font-medium text-lg">No diagram code provided</p>
            <p className="text-sm">Enter Mermaid syntax to see your diagram render in real-time</p>
            <div className="pt-4 text-xs space-y-1">
              <p className="font-mono text-muted-foreground/70">Try starting with:</p>
              <code className="block bg-muted/50 px-3 py-2 rounded">flowchart TD</code>
              <code className="block bg-muted/50 px-3 py-2 rounded">A[Start] --&gt; B[End]</code>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`w-full ${fullScreen || isFullScreen ? 'min-h-[600px]' : 'min-h-[300px]'} relative group`}>
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="glass-effect rounded-lg border border-yellow-400/20 p-1 flex flex-col gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomIn}
            className="h-8 w-8 p-0 hover:bg-yellow-500/10"
            title="Zoom In (Ctrl +)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleResetZoom}
            className="h-8 w-8 p-0 hover:bg-yellow-500/10 text-xs"
            title="Reset Zoom (Ctrl 0)"
          >
            {Math.round(zoom * 100)}%
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomOut}
            className="h-8 w-8 p-0 hover:bg-yellow-500/10"
            title="Zoom Out (Ctrl -)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
        {!fullScreen && (
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFullScreen}
            className="glass-effect border border-yellow-400/20 h-8 w-8 p-0 hover:bg-yellow-500/10"
            title="Toggle Fullscreen"
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            <span className="text-sm text-muted-foreground font-medium">Rendering diagram...</span>
            <span className="text-xs text-muted-foreground/70">This may take a moment</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-4">
          <Alert variant="destructive" className="border-red-300">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong className="block mb-1">Syntax Error</strong>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className={`w-full ${fullScreen || isFullScreen ? 'min-h-[600px]' : 'min-h-[300px]'} overflow-auto transition-all duration-300`}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#ffffff',
          transform: `scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      />
    </div>
  );
}