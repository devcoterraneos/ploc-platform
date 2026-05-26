import type { Metadata } from "next";
import { Leaf, Users, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce la Corporación PLOC — Plan Desarrollo Integrado Puerto Octay. Quiénes somos, nuestra misión y líneas de trabajo.",
};

const workAreas = [
  {
    icon: Building2,
    name: "Patrimonio",
    description:
      "Rescate, puesta en valor y difusión del patrimonio arquitectónico, cultural e histórico de Puerto Octay. Restauración de casas patrimoniales, registro y documentación del legado de la inmigración alemana al lago Llanquihue.",
  },
  {
    icon: Leaf,
    name: "Medio Ambiente",
    description:
      "Promoción del desarrollo sostenible, cuidado del ecosistema lacustre y forestal de la comuna. Proyectos de educación ambiental, recuperación de espacios naturales y fomento del turismo responsable.",
  },
  {
    icon: Users,
    name: "Comunidad",
    description:
      "Fortalecimiento del tejido social de Puerto Octay mediante actividades culturales, artísticas y de formación. Apoyo a organizaciones locales, jóvenes, adultos mayores y grupos vulnerables.",
  },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F9FAFB] border-b border-gray-100 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-[#8B1A1A] tracking-widest uppercase mb-3">
            Sobre PLOC
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Quiénes somos
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
            La Corporación PLOC es la instancia articuladora del desarrollo
            sostenible e integrado de Puerto Octay, Región de Los Lagos, Chile.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Mission */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Nuestra misión
          </h2>
          <div className="bg-red-50 border-l-4 border-[#8B1A1A] pl-6 py-4 rounded-r-xl">
            <p className="text-xl font-semibold text-gray-800 italic">
              "Trabajamos por el desarrollo sostenible e integrado de Puerto Octay"
            </p>
          </div>
          <p className="mt-4 text-gray-600 leading-relaxed">
            PLOC nace de la convicción de que el desarrollo de un territorio depende de sus propios
            actores. Articulamos personas, organizaciones, empresas e instituciones en torno a
            proyectos concretos que mejoran la calidad de vida de quienes habitan y quieren Puerto Octay.
          </p>
        </div>

        {/* About */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Historia y contexto
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              Puerto Octay es una ciudad del extremo norte del lago Llanquihue, en la Región de Los Lagos,
              que conserva uno de los patrimonios arquitectónicos más relevantes del proceso de colonización
              alemana en el sur de Chile. Sus casas de madera, su Mercado Municipal y su relación con el lago
              y el Volcán Osorno definen una identidad única que vale la pena preservar y proyectar.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              La Corporación PLOC fue fundada por vecinos, emprendedores, profesionales y organizaciones
              comprometidas con el presente y el futuro de la comuna. Desde 2021 hemos apoyado más de 27
              proyectos e iniciativas que benefician a miles de personas en el territorio.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Operamos con tres ejes principales: Patrimonio, Medio Ambiente y Comunidad, articulados en
              redes locales y territoriales, y complementados por el programa Sello Octay, que certifica a
              actores locales comprometidos con los valores de la corporación.
            </p>
          </div>
        </div>

        {/* Work areas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Líneas de trabajo
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {workAreas.map((area) => (
              <div
                key={area.name}
                className="bg-[#F9FAFB] rounded-2xl p-6 border border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <area.icon className="w-5 h-5 text-[#8B1A1A]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{area.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sello Octay */}
        <div id="alianzas" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sello Octay
          </h2>
          <p className="text-gray-600 leading-relaxed">
            El Sello Octay es un programa de certificación que reconoce a actores locales —
            emprendedores, organizaciones, empresas y personas — que comparten el compromiso con
            el desarrollo sostenible, el cuidado del patrimonio y la vida comunitaria de Puerto Octay.
            Ser parte del Sello Octay es una forma concreta de articularse con la misión de PLOC.
          </p>
        </div>

        {/* Contact info */}
        <div id="trabaja" className="bg-[#8B1A1A] text-white rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">¿Quieres sumarte a PLOC?</h2>
          <p className="text-white/80 mb-4">
            Si eres vecino/a, organización, empresa o institución con ganas de aportar al
            desarrollo de Puerto Octay, contáctanos.
          </p>
          <a
            href="mailto:contacto@corporacionploc.org"
            className="inline-block bg-white text-[#8B1A1A] font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-50 transition-colors"
          >
            contacto@corporacionploc.org
          </a>
        </div>
      </div>
    </div>
  );
}
