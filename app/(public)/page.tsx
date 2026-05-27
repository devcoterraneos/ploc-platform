"use client";

import { useSettings } from "@/lib/settings-context";
import LandingHero from "@/components/landing/LandingHero";
import LandingProjects from "@/components/landing/LandingProjects";
import LandingTestimonial from "@/components/landing/LandingTestimonial";
import LandingMembership from "@/components/landing/LandingMembership";
import LandingTransparency from "@/components/landing/LandingTransparency";

export default function HomePage() {
  const s = useSettings();
  const showBoth = s.showMembershipSection && s.showTransparencySection;
  const showEither = s.showMembershipSection || s.showTransparencySection;

  return (
    <>
      <LandingHero />
      <LandingProjects />
      <LandingTestimonial />

      {showEither && (
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`grid gap-6 ${
                showBoth ? "lg:grid-cols-2" : "grid-cols-1 max-w-2xl mx-auto"
              }`}
            >
              {s.showMembershipSection && <LandingMembership />}
              {s.showTransparencySection && <LandingTransparency />}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
