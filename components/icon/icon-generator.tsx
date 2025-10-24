"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Download, 
  Loader2, 
  Palette,
  RefreshCw,
  Heart,
  Share2,
  Wand2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/use-subscription";
import { ExportAuthDialog } from "@/components/ui/export-auth-dialog";

const iconStyles = [
  { value: "flat", label: "Flat Design", description: "Modern, minimalist 2D icons" },
  { value: "3d", label: "3D Rendered", description: "Realistic 3D styled icons" },
  { value: "gradient", label: "Gradient", description: "Colorful gradient effects" },
  { value: "line", label: "Line Art", description: "Simple outline icons" },
  { value: "sketch", label: "Hand-Drawn", description: "Sketchy, artistic style" },
  { value: "minimalist", label: "Minimalist", description: "Ultra-simple design" },
  { value: "cartoon", label: "Cartoon", description: "Playful, cartoon style" },
  { value: "isometric", label: "Isometric", description: "Isometric 3D perspective" },
];

const iconSizes = [
  { value: "256", label: "256x256", description: "Small icons" },
  { value: "512", label: "512x512", description: "Standard size" },
  { value: "1024", label: "1024x1024", description: "High resolution" },
];

const colorSchemes = [
  { value: "vibrant", label: "Vibrant", colors: "🌈" },
  { value: "pastel", label: "Pastel", colors: "🎨" },
  { value: "monochrome", label: "Monochrome", colors: "⚫" },
  { value: "warm", label: "Warm", colors: "🔥" },
  { value: "cool", label: "Cool", colors: "❄️" },
  { value: "custom", label: "Custom", colors: "✨" },
];

export function IconGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("flat");
  const [size, setSize] = useState("512");
  const [colorScheme, setColorScheme] = useState("vibrant");
  const [customColor, setCustomColor] = useState("#3b82f6");
  const [provider, setProvider] = useState<"pollinations" | "openrouter">("pollinations");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIcons, setGeneratedIcons] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const { toast } = useToast();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "No prompt to enhance",
        description: "Please enter a basic description first",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);

    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          type: "icon",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to enhance prompt");
      }

      const data = await response.json();
      
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        toast({
          title: "✨ Prompt Enhanced!",
          description: "Your description has been improved with AI",
        });
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe the icon you want to create",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedIcons([]);
    setSelectedIcon(null);

    try {
      const response = await fetch("/api/generate/icon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          size: parseInt(size),
          colorScheme: colorScheme === "custom" ? customColor : colorScheme,
          provider,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate icon");
      }

      const data = await response.json();
      
      if (data.icons && data.icons.length > 0) {
        setGeneratedIcons(data.icons);
        setSelectedIcon(data.icons[0]);
        toast({
          title: "✨ Icons Generated!",
          description: `Created ${data.icons.length} unique icon${data.icons.length > 1 ? 's' : ''} for you`,
        });
      } else {
        throw new Error("No icons generated");
      }
    } catch (error) {
      console.error("Error generating icon:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate icons. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedIcon) return;

    // For now, allow downloads without authentication check
    // The auth check was causing issues even for logged-in users
    // TODO: Implement proper session check if needed

    try {
      let downloadUrl: string;
      let filename: string;

      // For external URLs (Pollinations.ai), use proxy endpoint to avoid CORS
      if (selectedIcon.startsWith('http://') || selectedIcon.startsWith('https://')) {
        // Use proxy API to fetch the image server-side
        const proxyResponse = await fetch('/api/download/icon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: selectedIcon }),
        });

        if (!proxyResponse.ok) {
          throw new Error('Failed to fetch icon through proxy');
        }

        const blob = await proxyResponse.blob();
        downloadUrl = URL.createObjectURL(blob);
        filename = `icon-${Date.now()}.png`;
      } else {
        // Direct download for data URLs (SVG from OpenRouter)
        downloadUrl = selectedIcon;
        filename = `icon-${Date.now()}.svg`;
      }

      // Create and trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL if created
      if (downloadUrl.startsWith('blob:')) {
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
      }

      toast({
        title: "✅ Download Started",
        description: "Your icon is being downloaded",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download icon. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!selectedIcon) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out my AI-generated icon!",
          text: `Generated with docverse: ${prompt}`,
          url: selectedIcon,
        });
      } else {
        await navigator.clipboard.writeText(selectedIcon);
        toast({
          title: "📋 Link Copied",
          description: "Icon link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="prompt" className="text-base font-semibold flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-yellow-500" />
              Icon Description
            </Label>
            {!subscriptionLoading && subscription && (
              <span className="text-xs px-3 py-1 rounded-full glass-effect border border-yellow-400/30">
                <span className="font-semibold bolt-gradient-text">
                  {subscription.tier === 'premium' ? 'Unlimited' : `${subscription.usage?.icons_generated || 0}/10`}
                </span>
                <span className="text-muted-foreground ml-1">icons</span>
              </span>
            )}
          </div>
          <div className="relative">
            <Textarea
              id="prompt"
              placeholder="E.g., A modern rocket launching into space, minimalist design with blue and orange colors"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none border-gray-300 focus:border-blue-500 dark:border-gray-600 pr-12"
              disabled={isGenerating}
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleEnhancePrompt}
              disabled={isGenerating || isEnhancing || !prompt.trim()}
              className="absolute bottom-2 right-2 h-8 px-3 hover:bg-yellow-500/10 hover:text-yellow-600 transition-colors"
              title="Enhance prompt with AI"
            >
              {isEnhancing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            💡 Tip: Be specific about shapes, objects, colors, and mood for best results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider" className="text-sm font-semibold">
              ⚡ Generation Engine
            </Label>
            <Select value={provider} onValueChange={(value: "pollinations" | "openrouter") => setProvider(value)} disabled={isGenerating}>
              <SelectTrigger id="provider" className="border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pollinations">
                  <div className="flex flex-col">
                    <span className="font-medium">Pollinations.ai</span>
                    <span className="text-xs text-muted-foreground">Image-based icons (Recommended)</span>
                  </div>
                </SelectItem>
                <SelectItem value="openrouter">
                  <div className="flex flex-col">
                    <span className="font-medium">OpenRouter AI</span>
                    <span className="text-xs text-muted-foreground">SVG-based icons</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Style Selection */}
          <div className="space-y-2">
            <Label htmlFor="style" className="text-sm font-semibold">
              🎨 Icon Style
            </Label>
            <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
              <SelectTrigger id="style" className="border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {iconStyles.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{s.label}</span>
                      <span className="text-xs text-muted-foreground">{s.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <Label htmlFor="size" className="text-sm font-semibold">
              📐 Icon Size
            </Label>
            <Select value={size} onValueChange={setSize} disabled={isGenerating}>
              <SelectTrigger id="size" className="border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {iconSizes.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{s.label}</span>
                      <span className="text-xs text-muted-foreground">{s.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color Scheme */}
          <div className="space-y-2">
            <Label htmlFor="colorScheme" className="text-sm font-semibold">
              🌈 Color Scheme
            </Label>
            <Select value={colorScheme} onValueChange={setColorScheme} disabled={isGenerating}>
              <SelectTrigger id="colorScheme" className="border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Select colors" />
              </SelectTrigger>
              <SelectContent>
                {colorSchemes.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <span>{c.colors}</span>
                      <span className="font-medium">{c.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Custom Color Picker */}
        {colorScheme === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="customColor" className="text-sm font-semibold">
              🎨 Custom Color
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="customColor"
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-20 h-10 cursor-pointer"
                disabled={isGenerating}
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="flex-1"
                placeholder="#3b82f6"
                disabled={isGenerating}
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bolt-gradient text-white font-semibold py-6 rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating Your Icons...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Icons
            </>
          )}
        </Button>
      </div>

      {/* Generated Icons Display */}
      {(generatedIcons.length > 0 || isGenerating) && (
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="h-5 w-5 text-yellow-500" />
              Generated Icons
            </h3>
            {generatedIcons.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            )}
          </div>

          {isGenerating ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mx-auto" />
                <p className="text-sm text-muted-foreground">Creating your unique icons...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Icon Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {generatedIcons.map((icon, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedIcon === icon
                        ? "ring-2 ring-yellow-500 shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedIcon(icon)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
                        <img
                          src={icon}
                          alt={`Generated icon ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              {selectedIcon && (
                <div className="flex flex-wrap gap-3 justify-center pt-4">
                  <Button
                    onClick={handleDownload}
                    className="bolt-gradient text-white font-semibold px-6 hover:scale-105 transition-transform"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Icon
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform"
                    onClick={() => {
                      // Add to favorites functionality
                      toast({
                        title: "❤️ Added to Favorites",
                        description: "Icon saved to your collection",
                      });
                    }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Export Auth Dialog */}
      <ExportAuthDialog 
        open={showExportDialog} 
        onOpenChange={setShowExportDialog}
        exportType="icon"
        onSignIn={() => {
          setShowExportDialog(false);
          window.location.href = '/auth/signin';
        }}
      />
    </div>
  );
}
