"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DiagramPreview } from "@/components/diagram/diagram-preview";
import { DiagramTemplates } from "@/components/diagram/diagram-templates";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Wand2, 
  Code, 
  Eye, 
  FileImage,
  Share2,
  Workflow,
  GitBranch,
  Database,
  Network,
  Zap
} from "lucide-react";
import { toPng, toSvg } from 'html-to-image';

const DIAGRAM_EXAMPLES = {
  flowchart: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`,
  
  sequence: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!
    A-)B: See you later!`,
  
  classDiagram: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    Animal <|-- Dog`,
  
  gitGraph: `gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit`,
  
  erDiagram: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
  
  journey: `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me`
};

export function DiagramGenerator() {
  const [diagramCode, setDiagramCode] = useState(DIAGRAM_EXAMPLES.flowchart);
  const [selectedTemplate, setSelectedTemplate] = useState("flowchart");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [aiPrompt, setAiPrompt] = useState("");
  const [diagramType, setDiagramType] = useState("flowchart");
  const [showAiDialog, setShowAiDialog] = useState(false);
  const { toast } = useToast();
  const diagramRef = useRef<HTMLDivElement>(null);

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setDiagramCode(DIAGRAM_EXAMPLES[template as keyof typeof DIAGRAM_EXAMPLES] || DIAGRAM_EXAMPLES.flowchart);
  };

  const generateDiagramFromPrompt = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a description for your diagram",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setShowAiDialog(false);
    
    try {
      const response = await fetch('/api/generate/diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          diagramType: diagramType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diagram');
      }

      const data = await response.json();
      
      if (data.code) {
        setDiagramCode(data.code);
        setSelectedTemplate(diagramType);
        
        toast({
          title: "🎯 AI Diagram Generated!",
          description: data.title || "Your diagram has been created successfully",
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Diagram generation error:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate diagram. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    setIsCopying(true);
    
    try {
      await navigator.clipboard.writeText(diagramCode);
      
      toast({
        title: "Copied to clipboard!",
        description: "Mermaid code has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsCopying(false), 2000);
    }
  };

  const exportDiagram = async (format: 'png' | 'svg') => {
    if (!diagramRef.current) return;
    
    setIsExporting(true);
    
    try {
      const element = diagramRef.current.querySelector('#mermaid-diagram');
      if (!element) throw new Error('Diagram element not found');
      
      let dataUrl: string;
      
      if (format === 'png') {
        dataUrl = await toPng(element as HTMLElement, {
          backgroundColor: '#ffffff',
          quality: 1.0,
          pixelRatio: 2
        });
      } else {
        dataUrl = await toSvg(element as HTMLElement, {
          backgroundColor: '#ffffff'
        });
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = `diagram.${format}`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: `Diagram exported as ${format.toUpperCase()}!`,
        description: "Your diagram has been downloaded successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: `Failed to export diagram as ${format.toUpperCase()}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const shareDiagram = async () => {
    try {
      const shareData = {
        title: 'docverse Diagram',
        text: 'Check out this diagram I created with docverse!',
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Diagram link has been copied to your clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Failed to share diagram. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="glass-effect border border-yellow-400/20 p-1 h-auto">
            <TabsTrigger
              value="editor"
              className="data-[state=active]:bolt-gradient data-[state=active]:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <Code className="h-4 w-4" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bolt-gradient data-[state=active]:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <Workflow className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bolt-gradient data-[state=active]:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="editor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Side - Code Editor */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect mb-3">
                  <Code className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-medium">Mermaid Editor</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 bolt-gradient-text">
                  Write Your Diagram
                </h2>
                <p className="text-sm text-muted-foreground">
                  Use Mermaid syntax to create professional diagrams with live preview
                </p>
              </div>

              <div className="space-y-4">
                {/* Quick Template Buttons */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-muted-foreground" />
                    Quick Templates
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(DIAGRAM_EXAMPLES).map((template) => (
                      <Button
                        key={template}
                        variant={selectedTemplate === template ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTemplateSelect(template)}
                        className="text-xs capitalize"
                      >
                        {template === 'classDiagram' ? 'Class' : 
                         template === 'erDiagram' ? 'ER Diagram' :
                         template === 'gitGraph' ? 'Git Graph' :
                         template}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Code Editor */}
                <div className="space-y-2">
                  <Label htmlFor="diagramCode" className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    Mermaid Code
                  </Label>
                  <Textarea
                    id="diagramCode"
                    value={diagramCode}
                    onChange={(e) => setDiagramCode(e.target.value)}
                    placeholder="Enter your Mermaid diagram code here..."
                    className="min-h-[300px] font-mono text-sm glass-effect border-yellow-400/30 focus:border-yellow-400/60 focus:ring-yellow-400/20 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
                    <DialogTrigger asChild>
                      <Button
                        disabled={isGenerating}
                        className="bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            AI Generate
                          </>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] glass-effect border-yellow-400/30">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                          <Sparkles className="h-6 w-6 text-yellow-500" />
                          AI Diagram Generator
                        </DialogTitle>
                        <DialogDescription>
                          Describe your diagram and let AI create the Mermaid code for you
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="diagram-type" className="text-sm font-medium flex items-center gap-2">
                            <Workflow className="h-4 w-4 text-muted-foreground" />
                            Diagram Type
                          </Label>
                          <Select value={diagramType} onValueChange={setDiagramType}>
                            <SelectTrigger id="diagram-type" className="glass-effect border-yellow-400/30">
                              <SelectValue placeholder="Select diagram type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flowchart">
                                <div className="flex items-center gap-2">
                                  <Workflow className="h-4 w-4" />
                                  Flowchart
                                </div>
                              </SelectItem>
                              <SelectItem value="sequence">
                                <div className="flex items-center gap-2">
                                  <Zap className="h-4 w-4" />
                                  Sequence Diagram
                                </div>
                              </SelectItem>
                              <SelectItem value="class">
                                <div className="flex items-center gap-2">
                                  <Code className="h-4 w-4" />
                                  Class Diagram
                                </div>
                              </SelectItem>
                              <SelectItem value="er">
                                <div className="flex items-center gap-2">
                                  <Database className="h-4 w-4" />
                                  ER Diagram
                                </div>
                              </SelectItem>
                              <SelectItem value="gitGraph">
                                <div className="flex items-center gap-2">
                                  <GitBranch className="h-4 w-4" />
                                  Git Graph
                                </div>
                              </SelectItem>
                              <SelectItem value="journey">
                                <div className="flex items-center gap-2">
                                  <Network className="h-4 w-4" />
                                  User Journey
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ai-prompt" className="text-sm font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            Describe Your Diagram
                          </Label>
                          <Textarea
                            id="ai-prompt"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="E.g., Create a flowchart for a user authentication process with login, signup, and password reset..."
                            className="min-h-[120px] glass-effect border-yellow-400/30 focus:border-yellow-400/60 focus:ring-yellow-400/20"
                          />
                          <p className="text-xs text-muted-foreground">
                            Be specific about the steps, decisions, and flow you want to visualize
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowAiDialog(false)}
                          className="glass-effect border-yellow-400/30"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={generateDiagramFromPrompt}
                          disabled={isGenerating || !aiPrompt.trim()}
                          className="bolt-gradient text-white font-semibold"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wand2 className="mr-2 h-4 w-4" />
                              Generate Diagram
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    onClick={copyToClipboard}
                    disabled={isCopying}
                    className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
                  >
                    {isCopying ? (
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    Copy Code
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Live Preview */}
            <div className="space-y-4">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect mb-3">
                  <Eye className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium">Live Preview</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold bolt-gradient-text">Preview</h2>
              </div>

              <div ref={diagramRef} className="glass-effect border border-yellow-400/20 rounded-xl overflow-hidden bg-white relative min-h-[400px]">
                <div className="absolute inset-0 shimmer opacity-10"></div>
                <div className="relative z-10">
                  <DiagramPreview code={diagramCode} />
                </div>
              </div>

              {/* Export Options */}
              <div className="glass-effect p-4 rounded-xl border border-yellow-400/20">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Download className="h-4 w-4 text-yellow-500" />
                  Export Options
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => exportDiagram('png')}
                    disabled={isExporting}
                    className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
                  >
                    {isExporting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileImage className="mr-2 h-4 w-4" />
                    )}
                    Export PNG
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportDiagram('svg')}
                    disabled={isExporting}
                    className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
                  >
                    {isExporting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Export SVG
                  </Button>
                  <Button
                    variant="outline"
                    onClick={shareDiagram}
                    className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="pt-4">
          <div className="glass-effect p-6 rounded-xl border border-yellow-400/20 relative overflow-hidden">
            <div className="absolute inset-0 shimmer opacity-20"></div>
            <div className="relative z-10">
              <DiagramTemplates
                onSelectTemplate={(template, code) => {
                  setSelectedTemplate(template);
                  setDiagramCode(code);
                  setActiveTab("editor");
                }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="pt-4">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 bolt-gradient-text">
                Full Screen Preview
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                View your diagram in full detail with export and sharing options
              </p>
            </div>

            <div ref={diagramRef} className="glass-effect border border-yellow-400/20 rounded-xl overflow-hidden bg-white relative min-h-[600px]">
              <div className="absolute inset-0 shimmer opacity-10"></div>
              <div className="relative z-10">
                <DiagramPreview code={diagramCode} fullScreen />
              </div>
            </div>

            {/* Full Export Panel */}
            <div className="glass-effect p-6 rounded-xl border border-yellow-400/20">
              <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-yellow-500" />
                Export & Share
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => exportDiagram('png')}
                  disabled={isExporting}
                  className="bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300"
                >
                  <FileImage className="mr-2 h-4 w-4" />
                  PNG Export
                </Button>
                <Button
                  onClick={() => exportDiagram('svg')}
                  disabled={isExporting}
                  variant="outline"
                  className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
                >
                  <Download className="mr-2 h-4 w-4" />
                  SVG Export
                </Button>
                <Button
                  onClick={copyToClipboard}
                  disabled={isCopying}
                  variant="outline"
                  className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
                >
                  {isCopying ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  Copy Code
                </Button>
                <Button
                  onClick={shareDiagram}
                  variant="outline"
                  className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Diagram
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}