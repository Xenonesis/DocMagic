import { SiteHeader } from "@/components/site-header";
import { SponsorBanner } from "@/components/sponsor-banner";
import { ShaderHero } from "@/components/shader-hero";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { QuickNavigation } from "@/components/quick-navigation";
import { DocumentTypesSection } from "@/components/document-types-section";
import { QuickStartGuide } from "@/components/quick-start-guide";
import { CTASection } from "@/components/cta-section";
import ScrollToTop from "@/components/scroll-to-top";
export default function Home() {
  return (
    <div id="top" className="min-h-screen flex flex-col">
      <SponsorBanner />
      <SiteHeader />
      <main className="flex-1">
        <ShaderHero />
        <QuickStartGuide />
        <DocumentTypesSection />
        <QuickNavigation />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
        <ScrollToTop />
      </main>
    </div>
  );
}
