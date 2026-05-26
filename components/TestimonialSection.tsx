import type { Testimonial } from "@/lib/types";

interface TestimonialSectionProps {
  testimonial: Testimonial;
}

export default function TestimonialSection({
  testimonial,
}: TestimonialSectionProps) {
  return (
    <section className="py-16 lg:py-20 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-2/5 lg:w-1/3 flex-shrink-0">
              <div
                className="h-56 md:h-full min-h-[280px] w-full"
                style={{
                  background:
                    "linear-gradient(135deg,#1B3A2A 0%,#2D5A3D 50%,#3D7A5E 100%)",
                }}
              >
                {/* Placeholder for community photo */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-white/30 text-center p-8">
                    <div className="text-5xl mb-2">🌿</div>
                    <p className="text-sm">Comunidad Puerto Octay</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="flex-1 p-8 lg:p-12 flex items-center">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full">
                <div className="flex-1">
                  <div
                    className="text-6xl text-[#8B1A1A] font-serif leading-none mb-4"
                    aria-hidden="true"
                  >
                    "
                  </div>
                  <blockquote className="text-xl lg:text-2xl font-semibold text-gray-900 leading-relaxed mb-6">
                    {testimonial.quote}
                  </blockquote>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                {/* PLOC Seal */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#8B1A1A] flex items-center justify-center shadow-lg">
                    <svg
                      viewBox="0 0 80 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-16 h-16"
                    >
                      <circle cx="40" cy="40" r="36" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
                      <line x1="18" y1="50" x2="62" y2="50" stroke="white" strokeWidth="2" />
                      <path d="M40 18 L58 50 L22 50 Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
                      <text x="40" y="68" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">PLOC</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
