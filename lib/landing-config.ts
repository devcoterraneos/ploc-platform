/**
 * landing-config.ts
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * CONFIGURACIÃ“N CENTRAL WHITELABEL
 *
 * Para adaptar esta landing a otra organizaciÃ³n, edita solo este archivo.
 * Todos los componentes de landing leen desde aquÃ­.
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 */

// â”€â”€â”€ OrganizaciÃ³n â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const org = {
  name: "CorporaciÃ³n PLOC",
  tagline: "Plan Puerto Octay",
  territory: "Puerto Octay",
  logo: "/images/logo-ploc.png",
  seal: "/images/sello-puerto-octay.png",
  primaryColor: "#8B1A1A",
  primaryHover: "#7A1616",
  email: "contacto@corporacionploc.org",
  phone: "(56) 9 9733 5142",
  address: "Puerto Octay, RegiÃ³n de Los Lagos, Chile",
  footerDescription:
    "Conectamos personas, ideas y recursos para impulsar proyectos que fortalecen la vida local del sur de Chile.",
  social: {
    facebook: "https://www.facebook.com/corporacionPLOC",
    instagram: "https://www.instagram.com/corporacion_ploc",
    youtube: "",
    linkedin: "https://www.linkedin.com/company/corporacion-ploc",
  },
  copyright: `Â© ${new Date().getFullYear()} CorporaciÃ³n PLOC. Todos los derechos reservados.`,
};

// â”€â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const hero = {
  image: "/images/hero-puerto-octay.jpg",
  imageAlt: "VolcÃ¡n Osorno y Lago Llanquihue desde Puerto Octay",
  titleLine1: "Juntos construimos",
  titleLine2: "el futuro de nuestro",
  titleHighlight: "territorio",
  subtitle:
    "Tu apoyo impulsa proyectos que mejoran la calidad de vida y cuidan lo que nos hace Ãºnicos.",
  ctaPrimary: "Donar ahora",
  ctaSecondary: "Conoce los proyectos",
};

// â”€â”€â”€ CampaÃ±a activa â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const activeCampaign = {
  id: "fondo-comunidad-2024",
  label: "CAMPAÃ‘A ACTIVA",
  name: "Fondo Comunidad PLOC",
  description: "Transformemos juntos Puerto Octay",
  goal: 30000000,
  raised: 18750000,
  suggestedAmounts: [10000, 25000, 50000],
  ctaText: "Quiero aportar",
};

// â”€â”€â”€ Proyectos destacados â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
      "Conectar y poner en valor los principales hitos patrimoniales de Puerto Octay, creando una experiencia cultural Ãºnica para residentes y visitantes que fortalezca la identidad local.",
    resourcesUse:
      "SeÃ±alÃ©tica patrimonial, materiales interpretativos, formaciÃ³n de guÃ­as locales y restauraciÃ³n de fachadas histÃ³ricas.",
    goal: 9000000,
    raised: 6480000,
    imageGradient: "linear-gradient(135deg, #92400E 0%, #B45309 100%)",
    donationAmounts: [5000, 10000, 25000, 50000],
  },
  {
    id: "escuela-musica",
    slug: "escuela-musica-comunitaria",
    category: "Cultura",
    categoryColor: "#5B21B6",
    categoryBg: "#EDE9FE",
    name: "Escuela de MÃºsica Comunitaria",
    description:
      "FormaciÃ³n musical gratuita para niÃ±as, niÃ±os y jÃ³venes de la comuna y sectores rurales aledaÃ±os.",
    objective:
      "Ofrecer formaciÃ³n musical gratuita y de calidad a niÃ±as, niÃ±os y jÃ³venes de Puerto Octay, fortaleciendo la identidad cultural local a travÃ©s de la mÃºsica.",
    resourcesUse:
      "Instrumentos musicales, arriendo de espacio, honorarios de profesores y materiales pedagÃ³gicos para clases semanales.",
    goal: 7500000,
    raised: 4320000,
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
      "Mejoramos espacios pÃºblicos del borde lacustre y promovemos el turismo responsable.",
    objective:
      "Recuperar y mejorar el borde lacustre del lago Llanquihue como espacio pÃºblico de uso comunitario, promoviendo el turismo responsable y la educaciÃ³n ambiental.",
    resourcesUse:
      "Pasarelas de madera nativa, seÃ±alÃ©tica ambiental, Ã¡reas de picnic, senderos interpretativos y infraestructura de acceso.",
    goal: 12500000,
    raised: 7950000,
    imageGradient: "linear-gradient(135deg, #065F46 0%, #059669 100%)",
    donationAmounts: [5000, 10000, 25000, 50000],
  },
];

// â”€â”€â”€ MÃ©tricas de impacto â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const impactStats = [
  { value: "27", label: "Proyectos apoyados", sub: "desde 2021" },
  { value: "6.430", label: "Personas beneficiadas", sub: "en la comuna" },
  { value: "48", label: "Organizaciones locales", sub: "del territorio" },
  { value: "312", label: "Aportes recurrentes", sub: "cada mes" },
];

// â”€â”€â”€ Testimonio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const testimonial = {
  quote:
    "Cuando trabajamos juntos, nuestro territorio florece. Gracias a cada persona que confÃ­a y aporta.",
  name: "MarÃ­a AngÃ©lica Mansilla",
  role: "Vecina y voluntaria",
  initials: "MA",
};

// â”€â”€â”€ MembresÃ­a / Socios â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const membership = {
  title: "Hazte socio/a",
  description:
    "Con tu aporte mensual, generamos cambios reales y sostenibles en el tiempo.",
  fromAmount: 5000,
  fromLabel: "al mes",
  ctaText: "Quiero ser socio/a",
};

// â”€â”€â”€ Transparencia â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const transparency = {
  title: "Transparencia que genera confianza",
  subtitle: "AsÃ­ distribuimos los recursos para maximizar el impacto en el territorio.",
  items: [
    { pct: 70, label: "Proyectos", icon: "ðŸŒ±" },
    { pct: 15, label: "Fortalecimiento comunitario", icon: "ðŸ¤" },
    { pct: 10, label: "GestiÃ³n y administraciÃ³n", icon: "âš™ï¸" },
    { pct: 5, label: "ComunicaciÃ³n y difusiÃ³n", icon: "ðŸ“£" },
  ],
};
