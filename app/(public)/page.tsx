import LandingHero from "@/components/landing/LandingHero";
import LandingMetrics from "@/components/landing/LandingMetrics";
import LandingProjects from "@/components/landing/LandingProjects";
import LandingTestimonial from "@/components/landing/LandingTestimonial";
import LandingMembership from "@/components/landing/LandingMembership";
import LandingTransparency from "@/components/landing/LandingTransparency";

export default function HomePage() {
  return (
    <>
      {/* Hero + campaña activa */}
      <LandingHero />

      {/* Métricas de impacto */}
      <LandingMetrics />

      {/* Proyectos destacados + modal de donación */}
      <LandingProjects />

      {/* Testimonio */}
      <LandingTestimonial />

      {/* Hazte socio/a + Transparencia */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <LandingMembership />
            <LandingTransparency />
          </div>
        </div>
      </section>
    </>
  );
}
