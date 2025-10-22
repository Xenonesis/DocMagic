"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, Sparkles, Check, Zap } from "lucide-react";

interface ExportAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: () => void;
  exportType: "resume" | "presentation" | "letter" | "diagram";
}

export function ExportAuthDialog({
  open,
  onOpenChange,
  onSignIn,
  exportType,
}: ExportAuthDialogProps) {
  const contentMap = {
    resume: {
      title: "Sign in to Download Resumes",
      description: "Create resumes freely, but sign in to download them as PDF or DOCX files.",
      benefits: [
        "Download resumes in PDF and DOCX formats",
        "Save your resumes for future access",
        "Access ATS analysis and optimization",
        "Free to start - No credit card required",
      ],
    },
    presentation: {
      title: "Sign in to Export Presentations",
      description: "Create presentations freely, but sign in to export them as PDF or PowerPoint files.",
      benefits: [
        "Export presentations as PDF and PPTX",
        "Save your presentations for later",
        "Access advanced templates and themes",
        "Free to start - No credit card required",
      ],
    },
    letter: {
      title: "Sign in to Download Letters",
      description: "Create letters freely, but sign in to download them as professional PDF files.",
      benefits: [
        "Download letters in high-quality PDF format",
        "Save your letters for future use",
        "Access multiple letter templates",
        "Free to start - No credit card required",
      ],
    },
    diagram: {
      title: "Sign in to Export Diagrams",
      description: "Create diagrams freely, but sign in to export them as PNG or SVG files.",
      benefits: [
        "Export diagrams in high-quality PNG and SVG formats",
        "Save your diagrams for future access",
        "Access advanced AI features and templates",
        "Free to start - No credit card required",
      ],
    },
  };

  const content = contentMap[exportType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-effect border-yellow-400/30">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl text-center">
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {content.description} Join thousands of professionals using docverse!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="glass-effect p-4 rounded-lg border border-yellow-400/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Why sign in?
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {content.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>10K+ users</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>AI-powered</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              <span>Free plan</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="glass-effect border-yellow-400/30 flex-1"
          >
            Continue Creating
          </Button>
          <Button
            onClick={onSignIn}
            className="bolt-gradient text-white font-semibold hover:scale-105 transition-all duration-300 flex-1"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Sign In to {exportType === "resume" ? "Download" : exportType === "letter" ? "Download" : "Export"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
