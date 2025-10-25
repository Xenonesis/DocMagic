"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CertificatePreview } from "@/components/certificate/certificate-preview";
import { CertificateTemplates } from "@/components/certificate/certificate-templates";
import { useToast } from "@/hooks/use-toast";
import { useAuthGuard, PROTECTED_ACTIVITIES } from "@/lib/auth-utils";
import { ExportAuthDialog } from "@/components/ui/export-auth-dialog";
import { 
  Loader2, 
  Sparkles, 
  Award, 
  Download, 
  Copy, 
  Check, 
  Wand2, 
  FileImage,
  Calendar,
  User,
  Trophy,
  Star,
  Palette
} from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function CertificateGenerator() {
  const [recipientName, setRecipientName] = useState("");
  const [achievement, setAchievement] = useState("");
  const [awardedBy, setAwardedBy] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [organizationName, setOrganizationName] = useState("");
  const [signature, setSignature] = useState("");
  const [template, setTemplate] = useState("classic-gold");
  const [organizationLogo, setOrganizationLogo] = useState<string>("");
  const [signatureImage, setSignatureImage] = useState<string>("");
  const [fontScale, setFontScale] = useState<number>(100);
  const [fontFamily, setFontFamily] = useState<string>("serif");
  const [showSeal, setShowSeal] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, requireAuth } = useAuthGuard();
  
  const generateCertificate = async () => {
    if (!recipientName.trim() || !achievement.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter recipient name and achievement",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate/certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientName,
          achievement,
          awardedBy,
          date,
          organizationName,
          signature,
          template,
         organizationLogo,
         signatureImage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate certificate');
      }

      const data = await response.json();
      
      setCertificateData(data);
      
      toast({
        title: "Certificate created!",
        description: "Your certificate has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    if (!requireAuth(PROTECTED_ACTIVITIES.EXPORT_CERTIFICATE)) {
      setShowAuthDialog(true);
      return;
    }

    setIsExporting(true);
    try {
      const element = document.getElementById('certificate-preview');
      if (!element) {
        throw new Error('Certificate preview not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate-${recipientName.replace(/\s+/g, '-').toLowerCase()}.pdf`);

      toast({
        title: "Certificate exported!",
        description: "Your certificate has been downloaded as PDF.",
      });
    } catch (error) {
      console.error('Error exporting certificate:', error);
      toast({
        title: "Export failed",
        description: "Failed to export certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    if (!requireAuth(PROTECTED_ACTIVITIES.EXPORT_CERTIFICATE)) {
      setShowAuthDialog(true);
      return;
    }

    setIsExporting(true);
    try {
      const element = document.getElementById('certificate-preview');
      if (!element) {
        throw new Error('Certificate preview not found');
      }

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `certificate-${recipientName.replace(/\s+/g, '-').toLowerCase()}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      });

      toast({
        title: "Certificate exported!",
        description: "Your certificate has been downloaded as PNG image.",
      });
    } catch (error) {
      console.error('Error exporting certificate:', error);
      toast({
        title: "Export failed",
        description: "Failed to export certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    if (!certificateData) return;

    setIsCopying(true);
    try {
      const text = `Certificate of ${achievement}
      
Awarded to: ${recipientName}
${organizationName ? `By: ${organizationName}` : ''}
${awardedBy ? `Signed by: ${awardedBy}` : ''}
Date: ${new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;

      await navigator.clipboard.writeText(text);
      
      toast({
        title: "Copied to clipboard!",
        description: "Certificate text has been copied.",
      });

      setTimeout(() => setIsCopying(false), 2000);
    } catch (error) {
      console.error('Error copying certificate:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy certificate text.",
        variant: "destructive",
      });
      setIsCopying(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setTemplate(templateId);
    toast({
      title: "Template selected",
      description: "Certificate template has been updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Templates Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-yellow-600" />
          <h2 className="text-xl font-semibold">Choose a Template</h2>
        </div>
        <CertificateTemplates 
          onSelect={handleTemplateSelect} 
          selectedTemplate={template}
        />
        <div className="flex items-center gap-3 flex-wrap">
          <Label htmlFor="fontScale" className="text-sm">Font size</Label>
          <input
            id="fontScale"
            type="range"
            min={80}
            max={140}
            step={5}
            value={fontScale}
            onChange={(e) => setFontScale(Number(e.target.value))}
            className="w-40"
          />
          <span className="text-sm text-muted-foreground">{fontScale}%</span>
          <Label htmlFor="fontFamily" className="text-sm ml-4">Font</Label>
          <select
            id="fontFamily"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="serif">Serif</option>
            <option value="'Times New Roman', Times, serif">Times New Roman</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="sans-serif">Sans-serif</option>
            <option value="'Trebuchet MS', sans-serif">Trebuchet</option>
            <option value="'Garamond', serif">Garamond</option>
          </select>
          <label className="text-sm ml-4 inline-flex items-center gap-2">
            <input type="checkbox" checked={showSeal} onChange={(e) => setShowSeal(e.target.checked)} />
            Show seal
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="border-yellow-400/20">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-yellow-600" />
                <h2 className="text-xl font-semibold">Certificate Details</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Recipient Name *
                  </Label>
                  <Input
                    id="recipientName"
                    placeholder="John Doe"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="border-yellow-400/30 focus:border-yellow-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievement" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Achievement/Award Title *
                  </Label>
                  <Input
                    id="achievement"
                    placeholder="Excellence in Web Development"
                    value={achievement}
                    onChange={(e) => setAchievement(e.target.value)}
                    className="border-yellow-400/30 focus:border-yellow-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationName" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Organization Name
                  </Label>
                  <Input
                    id="organizationName"
                    placeholder="Acme Corporation"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="border-yellow-400/30 focus:border-yellow-400"
                  />
                  <div className="flex items-center gap-3 mt-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => setOrganizationLogo(String(reader.result || ""));
                        reader.readAsDataURL(file);
                      }}
                    />
                    {organizationLogo && (
                      <img src={organizationLogo} alt="Logo preview" className="h-8 w-auto rounded border" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="awardedBy" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Awarded By (Signatory)
                  </Label>
                  <Input
                    id="awardedBy"
                    placeholder="Jane Smith, CEO"
                    value={awardedBy}
                    onChange={(e) => setAwardedBy(e.target.value)}
                    className="border-yellow-400/30 focus:border-yellow-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signature" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Signature Text
                  </Label>
                  <Input
                    id="signature"
                    placeholder="Jane Smith"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="border-yellow-400/30 focus:border-yellow-400"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter name for signature (will be styled as signature). Or upload an image below.
                  </p>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => setSignatureImage(String(reader.result || ""));
                        reader.readAsDataURL(file);
                      }}
                    />
                    {signatureImage && (
                      <img src={signatureImage} alt="Signature preview" className="h-8 w-auto rounded border" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border-yellow-400/30 focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={generateCertificate} 
              disabled={isGenerating || !recipientName.trim() || !achievement.trim()}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Certificate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Preview</h2>
            </div>
            {certificateData && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={isCopying}
                  className="border-yellow-400/30"
                >
                  {isCopying ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportImage}
                  disabled={isExporting}
                  className="border-yellow-400/30"
                >
                  <FileImage className="h-4 w-4 mr-1" />
                  PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="border-yellow-400/30"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-1" />
                  )}
                  PDF
                </Button>
              </div>
            )}
          </div>

          <Card className="border-yellow-400/20">
            <CardContent className="p-6">
              <CertificatePreview 
                certificate={{
                  recipientName: recipientName || "Recipient Name",
                  achievement: achievement || "Achievement Title",
                  organizationName: organizationName || "",
                  awardedBy: awardedBy || "",
                  signature: signature || "",
                  date,
                  template,
                  organizationLogo,
                  signatureImage,
                  fontScale,
                  fontFamily,
                  showSeal,
                }}
                isPreview={!certificateData}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ExportAuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSignIn={() => {
          setShowAuthDialog(false);
          requireAuth(PROTECTED_ACTIVITIES.EXPORT_CERTIFICATE);
        }}
        exportType="certificate"
      />
    </div>
  );
}
