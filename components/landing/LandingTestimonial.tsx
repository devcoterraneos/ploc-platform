import { testimonial } from "@/lib/landing-config";

export default function LandingTestimonial() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-8 bg-[#F9FAFB] rounded-2xl p-8 lg:p-10 border border-gray-100">
          {/* Quote mark */}
          <div className="text-[#8B1A1A] text-7xl font-serif leading-none flex-shrink-0 select-none opacity-30">
            &ldquo;
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-lg lg:text-xl text-gray-700 font-medium leading-relaxed mb-5">
              {testimonial.quote}
            </p>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#8B1A1A] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{testimonial.initials}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-xs text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
