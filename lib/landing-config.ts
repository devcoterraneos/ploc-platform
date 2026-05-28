/**
 * landing-config.ts
 * CONFIGURACION CENTRAL WHITELABEL
 *
 * Para adaptar esta landing a otra organizacion, edita solo este archivo.
 * Todos los componentes de landing leen desde aqui.
 */

// --- Organizacion -----------------------------------------------------------

export const org = {
  name: "Corporacion PLOC",
  tagline: "Plan Puerto Octay",
  territory: "Puerto Octay",
  logo: "/images/logo-ploc.png",
  seal: "/images/sello-puerto-octay.png",
  primaryColor: "#8B1A1A",
  primaryHover: "#7A1616",
  email: "contacto@corporacionploc.org",
  phone: "(56) 9 9733 5142",
  address: "Puerto Octay, Region de Los Lagos, Chile",
  footerDescription:
    "Conectamos personas, ideas y recursos para impulsar proyectos que fortalecen la vida local del sur de Chile.",
  social: {
    facebook: "https://www.facebook.com/corporacionPLOC",
    instagram: "https://www.instagram.com/corporacion_ploc",
    youtube: "",
    linkedin: "https://www.linkedin.com/company/corporacion-ploc",
  },
  copyright: `© ${new Date().getFullYear()} Corporación PLOC. Todos los derechos reservados.`,
};

// --- Hero -------------------------------------------------------------------

export const hero = {
  image: "/images/hero-puerto-octay.jpg",
  imageAlt: "Volcán Osorno y Lago Llanquihue desde Puerto Octay",
  titleLine1: "Juntos construimos",
  titleLine2: "el futuro de nuestro",
  titleHighlight: "territorio",
  subtitle:
    "Tu apoyo impulsa proyectos que mejoran la calidad de vida y cuidan lo que nos hace únicos.",
  ctaPrimary: "Donar ahora",
  ctaSecondary: "Conoce los proyectos",
};

// --- Campana activa ---------------------------------------------------------

export const activeCampaign = {
  id: "fondo-comunidad-2024",
  label: "CAMPAÑA ACTIVA",
  name: "Fondo Comunidad PLOC",
  description: "Transformemos juntos Puerto Octay",
  goal: 30000000,
  raised: 18750000,
  suggestedAmounts: [10000, 25000, 50000],
  ctaText: "Quiero aportar",
};

// --- Proyectos destacados ---------------------------------------------------

export const featuredProjects = [
  {
    id: "ruta-patrimonial",
    slug: "ruta-patrimonial-puerto-octay",
    category: "Patrimonio",
    categoryColor: "#92400E",
    categoryBg: "#FEF3C7",
    name: "Ruta Patrimonial Puerto Octay",
    description:
      "Puesta en valor de nuestra historia, arquitectura y oficios tradicionales del sur de Chile.",
    objective:
      "Conectar y poner en valor los principales hitos patrimoniales de Puerto Octay, creando una experiencia cultural única para residentes y visitantes que fortalezca la identidad local.",
    resourcesUse:
      "Señalética patrimonial, materiales interpretativos, formación de guías locales y restauración de fachadas históricas.",
    goal: 9000000,
    raised: 6480000,
    imageUrl:
      "https://corporacionploc.org/webploc/wp-content/uploads/slider/cache/2b851c66c4b208b52168a790ea34f8b1/DJI_09792-scaled.jpg",
    imageGradient: "linear-gradient(135deg, #92400E 0%, #B45309 100%)",
    donationAmounts: [5000, 10000, 25000, 50000],
  },
  {
    id: "escuela-musica",
    slug: "escuela-musica-comunitaria",
    category: "Cultura",
    categoryColor: "#5B21B6",
    categoryBg: "#EDE9FE",
    name: "Escuela de Música Comunitaria",
    description:
      "Formación musical gratuita para niñas, niños y jóvenes de la comuna y sectores rurales aledаños.",
    objective:
      "Ofrecer formación musical gratuita y de calidad a niñas, niños y jóvenes de Puerto Octay, fortaleciendo la identidad cultural local a través de la música.",
    resourcesUse:
      "Instrumentos musicales, arriendo de espacio, honorarios de profesores y materiales pedagógicos para clases semanales.",
    goal: 7500000,
    raised: 4320000,
    imageUrl:
      "https://corporacionploc.org/webploc/wp-content/uploads/slider/cache/0b0fa0a43617c92ec68ccaebbaa510eb/DIA_PATRIMONIO-071.jpg",
    imageGradient: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)",
    donationAmounts: [5000, 10000, 25000, 50000],
  },
  {
    id: "parque-costero",
    slug: "parque-costero-sostenible",
    category: "Medio Ambiente",
    categoryColor: "#065F46",
    categoryBg: "#D1FAE5",
    name: "Parque Costero Sostenible",
    description:
      "Mejoramos espacios públicos del borde lacustre y promovemos el turismo responsable.",
    objective:
      "Recuperar y mejorar el borde lacustre del lago Llanquihue como espacio público de uso comunitario, promoviendo el turismo responsable y la educación ambiental.",
    resourcesUse:
      "Pasarelas de madera nativa, señalética ambiental, áreas de picnic, senderos interpretativos e infraestructura de acceso.",
    goal: 12500000,
    raised: 7950000,
    imageUrl:
      "https://corporacionploc.org/webploc/wp-content/uploads/slider/cache/d372f1b1444bbf31f8ea2f0a324cae1d/DJI_0025.jpg",
    imageGradient: "linear-gradient(135deg, #065F46 0%, #059669 100%)",
    donationAmounts: [5000, 10000, 25000, 50000],
  },
];

// --- Metricas de impacto ----------------------------------------------------

export const impactStats = [
  { value: "27", label: "Proyectos apoyados", sub: "desde 2021" },
  { value: "6.430", label: "Personas beneficiadas", sub: "en la comuna" },
  { value: "48", label: "Organizaciones locales", sub: "del territorio" },
  { value: "312", label: "Aportes recurrentes", sub: "cada mes" },
];

// --- Testimonio -------------------------------------------------------------

export const testimonial = {
  quote:
    "Cuando trabajamos juntos, nuestro territorio florece. Gracias a cada persona que confía y aporta.",
  name: "Equipo Corporación Ploc",
  role: "Trabajando por Puerto Octay",
  initials: "CP",
};

// --- Membresía / Socios -------------------------------------------------------

export const membership = {
  title: "Hazte socio/a",
  description:
    "Con tu aporte mensual, generamos cambios reales y sostenibles en el tiempo.",
  fromAmount: 5000,
  fromLabel: "al mes",
  ctaText: "Quiero ser socio/a",
};

// --- Transparencia ----------------------------------------------------------

export const transparency = {
  title: "Transparencia que genera confianza",
  subtitle:
    "Así distribuimos los recursos para maximizar el impacto en el territorio.",
  items: [
    { pct: 70, label: "Proyectos", icon: "🌱" },
    { pct: 15, label: "Fortalecimiento comunitario", icon: "🤝" },
    { pct: 10, label: "Gestión y administración", icon: "⚙️" },
    { pct: 5, label: "Comunicación y difusión", icon: "📣" },
  ],
};
