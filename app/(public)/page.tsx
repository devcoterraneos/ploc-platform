import HeroSection from "@/components/HeroSection";
import MetricsSection from "@/components/MetricsSection";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialSection from "@/components/TestimonialSection";
import MembershipSection from "@/components/MembershipSection";
import TransparencySection from "@/components/TransparencySection";
import FinalCTA from "@/components/FinalCTA";
import {
  mainCampaign,
  featuredCampaigns,
  defaultMetrics,
  defaultTestimonial,
  defaultSiteSettings,
} from "@/lib/data";

export default function HomePage() {
  const settings = defaultSiteSettings;
  const metrics = settings.metrics ?? defaultMetrics;

  return (
    <>
      {/* Hero + Campaign card */}
      <HeroSection
        mainCampaign={mainCampaign}
        communityCount={settings.heroCommunityCount}
      />

      {/* Metrics strip */}
      <MetricsSection metrics={metrics} />

      {/* Featured projects */}
      <section className="pt-12 pb-0 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0">
          <ProjectsSection
            campaigns={featuredCampaigns}
            title={settings.projectsSectionTitle}
            subtitle={settings.projectsSectionSubtitle}
          />
        </div>
      </section>

      {/* Testimonial */}
      <TestimonialSection testimonial={defaultTestimonial} />

      {/* Membership + Transparency */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <MembershipSection />
            <TransparencySection
              title={settings.transparencyTitle}
              subtitle={settings.transparencySubtitle}
              items={settings.transparencyItems}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTA
        title={settings.ctaTitle}
        subtitle={settings.ctaSubtitle}
        buttonText={settings.ctaButtonText}
      />
    </>
  );
}
