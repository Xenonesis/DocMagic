"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PresentationPreview } from "@/components/presentation/presentation-preview";
import { PresentationTemplates } from "@/components/presentation/presentation-templates";
import { SlideOutlinePreview } from "@/components/presentation/slide-outline-preview";
import { useToast } from "@/hooks/use-toast";
import { useAuthGuard, PROTECTED_ACTIVITIES } from "@/lib/auth-utils";
import { ExportAuthDialog } from "@/components/ui/export-auth-dialog";
import { Loader2, Sparkles, Presentation as LayoutPresentation, Lock, Download, Wand2, Sliders as Slides, Palette, Eye, ArrowRight, CheckCircle, Play, Brain, Zap, Star, Share2, Copy, Globe, ExternalLink, Maximize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type GenerationStep = 'input' | 'outline' | 'theme' | 'generated';

export function PresentationGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const [slideOutlines, setSlideOutlines] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("modern-business");
  const [pageCount, setPageCount] = useState(5);
  const [isExporting, setIsExporting] = useState(false);
  const [currentStep, setCurrentStep] = useState<GenerationStep>('input');
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [presentationId, setPresentationId] = useState<string>('');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewSlides, setPreviewSlides] = useState<any[]>([]);
  const { toast } = useToast();
  const { user, isAuthenticated, requireAuth } = useAuthGuard();
  const router = useRouter();

  // Subscription limits - currently showing free tier limits for all users
  const MAX_FREE_PAGES = 5;
  const MAX_PRO_PAGES = 30;
  const isPro = false; // TODO: Connect to subscription system when ready

  const generateSlideOutlines = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe the presentation you want to generate",
        variant: "destructive",
      });
      return;
    }

    if (pageCount > (isPro ? MAX_PRO_PAGES : MAX_FREE_PAGES)) {
      toast({
        title: "Page limit exceeded",
        description: isPro
          ? `Maximum ${MAX_PRO_PAGES} pages allowed`
          : `Upgrade to Pro to create presentations with up to ${MAX_PRO_PAGES} pages`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate/presentation-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt, 
          pageCount,
          userId: user?.id // Pass user ID for subscription check
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle subscription limit errors
        if (response.status === 403 && errorData.upgradeRequired) {
          toast({
            title: "Upgrade Required",
            description: errorData.error || `Free users can create up to ${MAX_FREE_PAGES} slides. Upgrade to create up to ${MAX_PRO_PAGES} slides!`,
            variant: "destructive",
          });
          return;
        }
        
        throw new Error(errorData.error || 'Failed to generate outline');
      }

      const data = await response.json();
      setSlideOutlines(data.outlines);
      setCurrentStep('outline');

      toast({
        title: "🎯 AI Outline Created!",
        description: `${data.outlines.length} slides intelligently structured with professional images and charts. Choose your style!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate outline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFullPresentation = async (isPreview: boolean = false) => {
    setIsGenerating(true);
    if (!isPreview) {
      setCurrentStep('generated');
    }

    try {
      const response = await fetch('/api/generate/presentation-full', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          outlines: slideOutlines, 
          template: selectedTemplate,
          prompt 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate presentation');
      }

      const data = await response.json();
      
      if (isPreview) {
        setPreviewSlides(data.slides);
        setIsPreviewMode(true);
        setCurrentStep('generated');
        toast({
          title: "👀 Preview Ready!",
          description: `${data.slides.length} slides generated. Review and regenerate if needed, or keep this version.`,
        });
      } else {
        setSlides(data.slides);
        setIsPreviewMode(false);
        toast({
          title: "🎉 Professional Presentation Ready!",
          description: `${data.slides.length} slides created with Canva-style design, professional images, and interactive charts!`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const regeneratePresentation = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate/presentation-full', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          outlines: slideOutlines, 
          template: selectedTemplate,
          prompt 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate presentation');
      }

      const data = await response.json();
      setPreviewSlides(data.slides);
      
      toast({
        title: "🔄 Presentation Regenerated!",
        description: `New version created with ${data.slides.length} slides. Review or regenerate again.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const keepPresentation = () => {
    setSlides(previewSlides);
    setIsPreviewMode(false);
    toast({
      title: "✅ Presentation Saved!",
      description: "You can now export or share your presentation.",
    });
  };

  const exportToPDF = async () => {
    if (!slides.length) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    
    setIsExporting(true);

    try {
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      
      for (let i = 0; i < slides.length; i++) {
        if (i > 0) pdf.addPage();
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Add background based on template
        const templateStyles = getTemplateBackground(selectedTemplate);
        pdf.setFillColor(templateStyles.r, templateStyles.g, templateStyles.b);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        
        // Add title
        pdf.setFontSize(28);
        pdf.setTextColor(0, 0, 0);
        pdf.text(slides[i].title, 50, 80);
        
        // Add content
        pdf.setFontSize(16);
        const splitContent = pdf.splitTextToSize(slides[i].content, pdfWidth - 100);
        pdf.text(splitContent, 50, 130);
      }

      pdf.save(`${prompt.slice(0, 30)}-presentation.pdf`);
      toast({
        title: "📄 PDF Exported!",
        description: "Your professional presentation has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export presentation to PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPPTX = async () => {
    if (!slides.length) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    
    setIsExporting(true);

    try {
      // Call server-side API to generate PPTX (avoids Node.js module bundling issues)
      const response = await fetch('/api/generate/export-pptx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slides,
          template: selectedTemplate,
          fileName: `${prompt.slice(0, 30)}-presentation`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PPTX');
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt.slice(0, 30)}-presentation.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "📊 PowerPoint Exported!",
        description: "Your presentation is ready for editing in PowerPoint",
      });
    } catch (error) {
      console.error("PPTX export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export presentation to PowerPoint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAuthDialogSignIn = () => {
    setShowAuthDialog(false);
    requireAuth(PROTECTED_ACTIVITIES.EXPORT_PRESENTATION);
  };

  const resetToInput = () => {
    setCurrentStep('input');
    setSlideOutlines([]);
    setSlides([]);
    setPreviewSlides([]);
    setIsPreviewMode(false);
    setPrompt("");
    setShareUrl('');
    setPresentationId('');
  };

  const saveAndSharePresentation = async (isPublic: boolean = true) => {
    if (!slides.length) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/presentations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: prompt.slice(0, 100) || 'Untitled Presentation',
          slides,
          template: selectedTemplate,
          prompt,
          isPublic
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save presentation');
      }

      const data = await response.json();
      setShareUrl(data.shareUrl);
      setPresentationId(data.id);

      if (isPublic) {
        // Copy to clipboard
        await navigator.clipboard.writeText(data.shareUrl);
        toast({
          title: "🎉 Presentation Shared!",
          description: "Share link copied to clipboard. Anyone can now view your presentation!",
        });
      } else {
        toast({
          title: "💾 Presentation Saved!",
          description: "Your presentation has been saved privately.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyShareLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const openFullView = async () => {
    if (!slides.length) return;
    
    // Save presentation first if not already saved
    if (!presentationId) {
      setIsSaving(true);
      try {
        const response = await fetch('/api/presentations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: prompt.slice(0, 100) || 'Untitled Presentation',
            slides,
            template: selectedTemplate,
            prompt,
            isPublic: false
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save presentation');
        }

        const data = await response.json();
        setPresentationId(data.id);
        
        // Open full view in new tab
        window.open(`/presentation/fullview/${data.id}`, '_blank');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to open full view. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    } else {
      // Already saved, just open in new tab
      window.open(`/presentation/fullview/${presentationId}`, '_blank');
    }
  };

  const goToThemeSelection = () => {
    setCurrentStep('theme');
  };

  const getTemplateBackground = (template: string) => {
    const backgrounds = {
      'modern-business': { r: 248, g: 250, b: 252 },
      'creative-gradient': { r: 252, g: 248, b: 255 },
      'minimalist-pro': { r: 249, g: 250, b: 251 },
      'tech-modern': { r: 15, g: 23, b: 42 },
      'elegant-dark': { r: 17, g: 24, b: 39 },
      'startup-pitch': { r: 240, g: 253, b: 244 }
    };
    return backgrounds[template as keyof typeof backgrounds] || backgrounds['modern-business'];
  };

  const getTemplateColors = (template: string) => {
    const colors = {
      'modern-business': { background: 'F8FAFC', textColor: '1E3A8A', accentColor: '3B82F6' },
      'creative-gradient': { background: 'FCF8FF', textColor: '7C2D92', accentColor: 'A855F7' },
      'minimalist-pro': { background: 'F9FAFB', textColor: '374151', accentColor: '6B7280' },
      'tech-modern': { background: '0F172A', textColor: 'FFFFFF', accentColor: '06B6D4' },
      'elegant-dark': { background: '111827', textColor: 'FFFFFF', accentColor: 'FBBF24' },
      'startup-pitch': { background: 'F0FDF4', textColor: '065F46', accentColor: '10B981' }
    };
    return colors[template as keyof typeof colors] || colors['modern-business'];
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all whitespace-nowrap ${
        currentStep === 'input' ? 'bolt-gradient text-white shadow-lg' : 'glass-effect hover:scale-105'
      }`}>
        <Brain className="h-4 w-4" />
        <span className="text-sm font-medium">1. Describe</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all whitespace-nowrap ${
        currentStep === 'outline' ? 'bolt-gradient text-white shadow-lg' : 'glass-effect hover:scale-105'
      }`}>
        <Zap className="h-4 w-4" />
        <span className="text-sm font-medium">2. AI Structure</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all whitespace-nowrap ${
        currentStep === 'theme' ? 'bolt-gradient text-white shadow-lg' : 'glass-effect hover:scale-105'
      }`}>
        <Palette className="h-4 w-4" />
        <span className="text-sm font-medium">3. Style</span>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all whitespace-nowrap ${
        currentStep === 'generated' ? 'bolt-gradient text-white shadow-lg' : 'glass-effect hover:scale-105'
      }`}>
        <Play className="h-4 w-4" />
        <span className="text-sm font-medium">4. Present</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Authentication Dialog */}
      <ExportAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSignIn={handleAuthDialogSignIn}
        exportType="presentation"
      />

      {renderStepIndicator()}

      {/* Step 1: Input */}
      {currentStep === 'input' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4 shimmer">
                <Brain className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">AI-Powered Creation</span>
                <Sparkles className="h-4 w-4 text-blue-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 bolt-gradient-text">
                What's your presentation about?
              </h2>
              <p className="text-muted-foreground">
                Our AI will create a professional presentation with Canva-style design, 
                high-quality images, and meaningful charts
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pageCount" className="text-sm font-medium flex items-center gap-2">
                  <Slides className="h-4 w-4 text-muted-foreground" />
                  Number of Slides
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="pageCount"
                    type="number"
                    min="1"
                    max={isPro ? MAX_PRO_PAGES : MAX_FREE_PAGES}
                    value={pageCount}
                    onChange={(e) => setPageCount(Math.min(parseInt(e.target.value) || 1, isPro ? MAX_PRO_PAGES : MAX_FREE_PAGES))}
                    className="w-24 glass-effect border-yellow-400/30 focus:border-yellow-400/60 focus:ring-yellow-400/20"
                    disabled={isGenerating}
                  />
                  {!isPro && (
                    <div className="flex items-center text-xs text-muted-foreground glass-effect px-3 py-2 rounded-full">
                      <Lock className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Max {MAX_FREE_PAGES} slides (Pro: {MAX_PRO_PAGES})</span>
                      <span className="sm:hidden">Max {MAX_FREE_PAGES}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Describe your presentation
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., Create a startup pitch deck for an AI-powered fitness app targeting millennials, including market analysis, product features, business model, and funding requirements"
                  className="min-h-[140px] text-base glass-effect border-yellow-400/30 focus:border-yellow-400/60 focus:ring-yellow-400/20 resize-none"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <Button
                onClick={generateSlideOutlines}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bolt-gradient text-white font-semibold py-4 rounded-xl hover:scale-105 transition-all duration-300 bolt-glow relative overflow-hidden"
              >
                <div className="flex items-center justify-center gap-2 relative z-10">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>AI is analyzing your topic...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5" />
                      <span>Generate AI Structure</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </div>
                
                {!isGenerating && (
                  <div className="absolute inset-0 shimmer opacity-30"></div>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect mb-3">
                <Star className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium">Professional Features</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bolt-gradient-text">Canva-Style Quality</h2>
            </div>

            <Card className="glass-effect border border-yellow-400/20 p-6 relative overflow-hidden">
              <div className="absolute inset-0 shimmer opacity-10"></div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bolt-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Professional Images</h3>
                    <p className="text-sm text-muted-foreground">High-quality Pexels images selected by AI for each slide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bolt-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Interactive Charts</h3>
                    <p className="text-sm text-muted-foreground">Meaningful data visualizations with professional styling</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bolt-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    <Palette className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Canva-Style Design</h3>
                    <p className="text-sm text-muted-foreground">Professional templates with consistent branding</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bolt-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    <Play className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Full-Screen Presentation</h3>
                    <p className="text-sm text-muted-foreground">Present like a pro with smooth transitions and controls</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Step 2: Outline Preview */}
      {currentStep === 'outline' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">AI Structure Complete</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 bolt-gradient-text">
              🎯 Perfect! Your presentation structure is ready
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our AI analyzed your topic and created an intelligent slide flow with professional images, 
              meaningful charts, and compelling content. Now choose your style!
            </p>
          </div>

          <SlideOutlinePreview outlines={slideOutlines} />

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={resetToInput}
              variant="outline"
              className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
            >
              ← Edit Description
            </Button>
            <Button
              onClick={goToThemeSelection}
              className="bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300"
            >
              <Palette className="mr-2 h-4 w-4" />
              Choose Professional Style →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Theme Selection */}
      {currentStep === 'theme' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
              <Palette className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Professional Templates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 bolt-gradient-text">
              🎨 Choose your professional style
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Select a Canva-style template that matches your audience and purpose. 
              Each template includes optimized colors, typography, and visual elements.
            </p>
          </div>

          <PresentationTemplates
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => setCurrentStep('outline')}
              variant="outline"
              className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
            >
              ← Back to Structure
            </Button>
            <Button
              onClick={() => generateFullPresentation(true)}
              disabled={isGenerating}
              variant="outline"
              className="glass-effect border-blue-400/30 hover:border-blue-400/60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating preview...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-5 w-5" />
                  Preview First
                </>
              )}
            </Button>
            <Button
              onClick={() => generateFullPresentation(false)}
              disabled={isGenerating}
              className="bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300 px-8 py-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating your presentation...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate & Finalize
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Generated Presentation */}
      {currentStep === 'generated' && (
        <div className="space-y-6">
          <div className="text-center">
            {isPreviewMode ? (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4 border border-blue-400/30">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Preview Mode - Not Saved Yet</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 bolt-gradient-text">
                  👀 Preview Your Presentation
                </h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  Review the generated presentation. You can regenerate for a different version or keep this one.
                  Your presentation won't be saved until you click "Keep This Version".
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Professional Presentation Ready!</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 bolt-gradient-text">
                  🎉 Your Canva-Style Presentation is Ready!
                </h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  Complete with professional design, high-quality images, interactive charts, and compelling content. 
                  Present in full-screen mode or export to PowerPoint!
                </p>
              </>
            )}
          </div>

          {(isPreviewMode ? previewSlides : slides).length > 0 && (
            <div id="presentation-preview" className="glass-effect border border-yellow-400/20 rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 shimmer opacity-10"></div>
              <div className="relative z-10">
                <PresentationPreview 
                  slides={isPreviewMode ? previewSlides : slides} 
                  template={selectedTemplate} 
                />
              </div>
            </div>
          )}

          {/* Share section */}
          {shareUrl && (
            <div className="glass-effect p-6 rounded-xl border border-green-400/20 bg-green-50/10">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-effect mb-2">
                  <Globe className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Presentation Shared</span>
                </div>
                <h3 className="text-lg font-semibold bolt-gradient-text">Your presentation is live!</h3>
                <p className="text-sm text-muted-foreground">Anyone with this link can view your presentation</p>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg"
                />
                <Button onClick={copyShareLink} size="sm" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => window.open(shareUrl, '_blank')} 
                  size="sm"
                  className="bolt-gradient text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {isPreviewMode ? (
            // Preview Mode Actions
            <div className="space-y-4">
              <div className="glass-effect p-4 rounded-xl border border-blue-400/20 bg-blue-50/10">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  💡 <strong>Preview Mode:</strong> This presentation is not saved yet. 
                  Regenerate for a different version or keep this one to continue.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={() => setCurrentStep('theme')}
                  variant="outline"
                  className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Change Style
                </Button>
                <Button
                  onClick={regeneratePresentation}
                  disabled={isGenerating}
                  variant="outline"
                  className="glass-effect border-orange-400/30 hover:border-orange-400/60"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Regenerate Different Version
                    </>
                  )}
                </Button>
                <Button
                  onClick={keepPresentation}
                  className="bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300 px-8"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Keep This Version
                </Button>
              </div>
            </div>
          ) : (
            // Final Mode Actions
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={resetToInput}
                variant="outline"
                className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
              >
                <Brain className="mr-2 h-4 w-4" />
                Create New Presentation
              </Button>
              <Button
                onClick={() => setCurrentStep('theme')}
                variant="outline"
                className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
              >
                <Palette className="mr-2 h-4 w-4" />
                Change Style
              </Button>
              
              {/* Full View button */}
              <Button
                onClick={openFullView}
                disabled={isSaving}
                className="bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Maximize2 className="mr-2 h-4 w-4" />
                )}
                Full View
              </Button>
              
              {/* Share button */}
              {!shareUrl && (
                <Button
                  onClick={() => saveAndSharePresentation(true)}
                  disabled={isSaving}
                  variant="outline"
                  className="glass-effect border-green-400/30 hover:border-green-400/60"
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Share2 className="mr-2 h-4 w-4" />
                  )}
                  Share
                </Button>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  variant="outline"
                  className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
                >
                  {isExporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  PDF
                </Button>
                <Button
                  onClick={exportToPPTX}
                  disabled={isExporting}
                  variant="outline"
                  className="glass-effect border-yellow-400/30 hover:border-yellow-400/60"
                >
                  {isExporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  PowerPoint
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}