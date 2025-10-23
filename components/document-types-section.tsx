'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Presentation, Mail, FileUser, Network, ArrowRight, Sparkles, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const documentTypes = [
  {
    title: "Resume",
    description: "ATS-optimized resumes that get you noticed by recruiters and hiring managers",
    icon: FileText,
    href: "/resume",
    gradient: "bolt-gradient",
    borderColor: "border-blue-200/30",
    features: ["ATS Optimized", "Multiple Templates", "AI-Powered"],
    badge: "Most Popular"
  },
  {
    title: "Presentation",
    description: "Stunning slide decks that captivate your audience and deliver your message",
    icon: Presentation,
    href: "/presentation",
    gradient: "sunset-gradient",
    borderColor: "border-amber-200/30",
    features: ["Visual Design", "Data Charts", "Export to PPTX"],
    badge: "Trending"
  },
  {
    title: "Cover Letter",
    description: "Personalized cover letters that complement your resume perfectly",
    icon: Mail,
    href: "/letter",
    gradient: "forest-gradient",
    borderColor: "border-emerald-200/30",
    features: ["Personalized", "Industry-Specific", "Quick Generate"],
    badge: "Essential"
  },
  {
    title: "CV",
    description: "Comprehensive CVs for academic and research positions",
    icon: FileUser,
    href: "/cv",
    gradient: "cosmic-gradient",
    borderColor: "border-purple-200/30",
    features: ["Academic Format", "Publications", "Research Focus"],
    badge: "Professional"
  },
  {
    title: "Diagram",
    description: "Professional diagrams and flowcharts for technical documentation",
    icon: Network,
    href: "/diagram",
    gradient: "ocean-gradient",
    borderColor: "border-cyan-200/30",
    features: ["Flowcharts", "Mind Maps", "Export SVG"],
    badge: "New"
  }
];

export function DocumentTypesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  
  const handleHeadingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextIndex = (currentIndex + 1) % documentTypes.length;
    setCurrentIndex(nextIndex);
    router.push(documentTypes[nextIndex].href);
  };

  return (
    <section id="document-types" className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-50/20 to-background"></div>
      <div className="floating-orb w-72 h-72 bolt-gradient opacity-10 top-20 -left-32"></div>
      <div className="floating-orb w-64 h-64 sunset-gradient opacity-10 bottom-20 -right-32"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-effect mb-6 border border-blue-200/30">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold bolt-gradient-text">Choose Your Document Type</span>
          </div>
          
          <div 
            onClick={handleHeadingClick}
            className="block group/heading cursor-pointer"
          >
            <h2 className="modern-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight transition-transform duration-300 group-hover/heading:scale-105">
              <span className="block">What would you like to <span className="bolt-gradient-text group-hover/heading:underline">create today?</span></span>
            </h2>
          </div>
          
          <p className="modern-body text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Select a document type and let our AI help you create professional content in seconds
          </p>
        </div>

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {documentTypes.map((doc, index) => (
            <Card 
              key={doc.title}
              className="group relative !bg-white dark:!bg-gray-900 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 !border !border-gray-200 dark:!border-gray-700 overflow-hidden animate-fade-in-up rounded-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Badge */}
              {doc.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg">
                    <Star className="h-3 w-3" />
                    {doc.badge}
                  </div>
                </div>
              )}

              {/* Gradient background overlay */}
              <div className={`absolute inset-0 ${doc.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300`}></div>

              <CardHeader className="pb-4 relative z-10">
                <div className={`w-16 h-16 ${doc.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <doc.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:bolt-gradient-text transition-colors">
                  {doc.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-2 text-gray-600 dark:text-gray-400">
                  {doc.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 relative z-10">
                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {doc.features.map((feature) => (
                    <div 
                      key={feature}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Zap className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  asChild
                  className="w-full group/btn !bg-white dark:!bg-gray-800 hover:!bg-gray-50 dark:hover:!bg-gray-700 !text-gray-900 dark:!text-white hover:!text-gray-900 dark:hover:!text-white !border-2 !border-gray-300 dark:!border-gray-600 hover:!border-blue-500 dark:hover:!border-blue-400 transition-all"
                  variant="outline"
                >
                  <Link href={doc.href} className="flex items-center justify-center gap-2 !text-gray-900 dark:!text-white hover:!text-gray-900 dark:hover:!text-white">
                    <span className="font-semibold">Create {doc.title}</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-sm text-muted-foreground mb-4">
            Not sure which one to choose? Start with our most popular option
          </p>
          <Button 
            asChild
            size="lg"
            className="bolt-gradient text-white font-bold px-8 py-6 rounded-full hover:scale-105 transition-all duration-300"
          >
            <Link href="/resume" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Create Resume Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
