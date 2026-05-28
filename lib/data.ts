import type {
  Campaign,
  NewsArticle,
  Document,
  TeamMember,
  SiteSettings,
  Metric,
  Testimonial,
} from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProgressPercent(raised: number, goal: number): number {
  return Math.min(Math.round((raised / goal) * 100), 100);
}

// ─── Metrics (defined first — used by defaultSiteSettings) ───────────────────

export const defaultMetrics: Metric[] = [
  {
    id: "1",
    label: "Proyectos apoyados",
    value: "27",
    description: "desde 2021",
    icon: "heart-handshake",
    sortOrder: 1,
  },
  {
    id: "2",
    label: "Personas beneficiadas",
    value: "6.430",
    description: "en la comuna",
    icon: "users",
    sortOrder: 2,
  },
  {
    id: "3",
    label: "Empresas colaboradoras",
    value: "48",
    description: "del territorio",
    icon: "building-2",
    sortOrder: 3,
  },
  {
    id: "4",
    label: "Aportes recurrentes",
    value: "312",
    description: "cada mes",
    icon: "refresh-cw",
    sortOrder: 4,
  },
];

// ─── Testimonial (defined before defaultSiteSettings) ────────────────────────

export const defaultTestimonial: Testimonial = {
  id: "1",
  quote:
    "Puerto Octay es más que un lugar, es nuestra casa. Cuidarlo y proyectarlo depende de todos nosotros.",
  name: "Equipo Corporación Ploc",
  role: "Trabajando por Puerto Octay",
  imageUrl: "/images/testimonial-community.jpg",
  isActive: true,
};

// ─── Site Settings (editable from admin dashboard) ───────────────────────────

export const defaultSiteSettings: SiteSettings = {
  logoUrl: "/images/logo-ploc.svg",
  logoFooterUrl: "/images/logo-ploc-white.svg",
  sealUrl: "/images/sello-ploc.svg",
  primaryColor: "#8B1A1A",
  secondaryColor: "#111827",
  heroImageUrl: "/images/hero-puerto-octay-2.jpg",
  heroTitle: "Juntos construimos\nel futuro de",
  heroHighlight: "Puerto Octay",
  heroSubtitle: "Bienvenidos a la plataforma de Crowdfunding de Corporación PLOC. Elige un proyecto y haz tu donación para hacerlo posible.",
  heroCommunityCount: "846",
  heroCommunityText: "personas que ya apoyan a Puerto Octay",
  heroDonarText: "Donar ahora",
  heroProyectosText: "Conoce los proyectos",
  metrics: defaultMetrics,
  projectsSectionTitle: "Iniciativas que transforman nuestro territorio",
  projectsSectionSubtitle: "PROYECTOS DESTACADOS",
  testimonial: defaultTestimonial,
  testimonialQuote: "Puerto Octay es más que un lugar, es nuestra casa. Cuidarlo y proyectarlo depende de todos nosotros.",
  testimonialName: "Equipo Corporación Ploc",
  testimonialRole: "Trabajando por Puerto Octay",
  transparencyTitle: "Tu aporte se usa con responsabilidad",
  transparencySubtitle:
    "Así distribuimos los recursos para maximizar el impacto en Puerto Octay.",
  transparencyItems: [
    { id: "1", percentage: 70, label: "Proyectos y programas", icon: "sprout" },
    { id: "2", percentage: 15, label: "Fortalecimiento comunitario", icon: "users" },
    { id: "3", percentage: 10, label: "Gestión y administración", icon: "settings" },
    { id: "4", percentage: 5, label: "Comunicación y difusión", icon: "megaphone" },
  ],
  ctaTitle: "Sigamos construyendo el futuro\nde Puerto Octay, juntos.",
  ctaSubtitle:
    "Cada aporte cuenta. Cada persona suma. Sé parte del cambio desde tu territorio.",
  ctaButtonText: "Donar ahora",
  contactAddress: "Puerto Octay, Región de Los Lagos, Chile",
  contactEmail: "contacto@corporacionploc.org",
  contactPhone: "(56) 9 9733 5142",
  socialFacebook: "https://www.facebook.com/corporacionPLOC",
  socialInstagram: "https://www.instagram.com/corporacion_ploc",
  socialYoutube: "",
  socialLinkedin: "https://www.linkedin.com/company/corporacion-ploc",
  footerDescription:
    "Conectamos personas, ideas y recursos para impulsar proyectos que fortalecen la vida local del sur de Chile.",
  showMembershipSection: false,
  showTransparencySection: false,
};

// ─── Campaigns / Projects ─────────────────────────────────────────────────────

export const mainCampaign: Campaign = {
  id: "main-2024",
  slug: "fondo-comunidad-ploc",
  name: "Fondo Comunidad PLOC",
  shortDescription: "Transformemos juntos Puerto Octay",
  description:
    "El Fondo Comunidad PLOC financia proyectos comunitarios, culturales, patrimoniales y de desarrollo territorial en Puerto Octay. Cada aporte impulsa iniciativas reales que mejoran la calidad de vida de quienes habitan y quieren el sur de Chile.",
  category: "Comunidad",
  goal: 30000000,
  raised: 18750000,
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  imageUrl: "/images/hero-puerto-octay.jpg",
  status: "active",
  isFeatured: true,
  isMainCampaign: true,
  sortOrder: 0,
  donationAmounts: [10000, 25000, 50000],
  ctaText: "Quiero aportar",
  createdAt: "2024-01-01T00:00:00Z",
};

export const featuredCampaigns: Campaign[] = [
  {
    id: "ruta-patrimonial",
    slug: "ruta-patrimonial-puerto-octay",
    name: "Ruta Patrimonial Puerto Octay",
    shortDescription:
      "Puesta en valor de nuestra historia, arquitectura y oficios tradicionales.",
    description:
      "La Ruta Patrimonial de Puerto Octay conecta los principales hitos arquitectónicos y culturales de la comuna: casas alemanas restauradas como la Casa Werner y Casa Schmidt, el Mercado Municipal, y los sitios de memoria de la inmigración alemana al lago Llanquihue. Este proyecto financia señalética, materiales interpretativos y formación de guías locales.",
    category: "Patrimonio",
    goal: 9000000,
    raised: 6480000,
    startDate: "2024-03-01",
    imageUrl: "/images/proyecto-patrimonio.jpg",
    status: "active",
    isFeatured: true,
    isMainCampaign: false,
    sortOrder: 1,
    donationAmounts: [5000, 10000, 25000],
    ctaText: "Apoyar este proyecto",
    createdAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "escuela-musica",
    slug: "escuela-musica-comunitaria",
    name: "Escuela de Música Comunitaria",
    shortDescription:
      "Formación musical gratuita para niñas, niños y jóvenes de la comuna.",
    description:
      "La Escuela de Música Comunitaria ofrece clases gratuitas de instrumentos, canto y teoría musical para niñas, niños y jóvenes de Puerto Octay y sectores rurales aledaños. El proyecto forma parte del eje Comunidad de PLOC y busca fortalecer la identidad cultural local a través de la música.",
    category: "Cultura",
    goal: 7500000,
    raised: 4320000,
    startDate: "2024-02-01",
    imageUrl: "/images/proyecto-musica.jpg",
    status: "active",
    isFeatured: true,
    isMainCampaign: false,
    sortOrder: 2,
    donationAmounts: [5000, 10000, 25000],
    ctaText: "Apoyar este proyecto",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "parque-costero",
    slug: "parque-costero-sostenible",
    name: "Parque Costero Sostenible",
    shortDescription:
      "Mejoramos espacios públicos y promovemos el turismo responsable.",
    description:
      "El Parque Costero Sostenible conecta el borde del lago Llanquihue con espacios verdes de uso comunitario. El proyecto contempla pasarelas de madera nativa, áreas de picnic, senderos interpretativos sobre flora y fauna local, y señalética de educación ambiental. Se enmarca en el eje de Medio Ambiente de la Corporación PLOC.",
    category: "Desarrollo Territorial",
    goal: 12500000,
    raised: 7950000,
    startDate: "2024-01-15",
    imageUrl: "/images/proyecto-parque.jpg",
    status: "active",
    isFeatured: true,
    isMainCampaign: false,
    sortOrder: 3,
    donationAmounts: [5000, 10000, 25000],
    ctaText: "Apoyar este proyecto",
    createdAt: "2024-01-15T00:00:00Z",
  },
];

export const allCampaigns: Campaign[] = [mainCampaign, ...featuredCampaigns];

// ─── News ─────────────────────────────────────────────────────────────────────

export const news: NewsArticle[] = [
  {
    id: "1",
    slug: "red-organizaciones-lacustres-norpatagonicas",
    title: "Red de Organizaciones Lacustres Norpatagónicas",
    excerpt:
      "Instancia de diálogo colaborativo entre diversas organizaciones de la sociedad civil para el desarrollo sostenible de ecosistemas lacustres.",
    content:
      "La Red de Organizaciones Lacustres Norpatagónicas es una instancia de diálogo colaborativo entre diversas organizaciones de la sociedad civil, iniciada en 2021 de forma virtual. Su objetivo es promover el desarrollo sostenible de los ecosistemas lacustres de la región y coordinar acciones conjuntas entre comunidades, municipios y organizaciones territoriales.",
    date: "2023-01-13",
    category: "General",
    isPublished: true,
  },
  {
    id: "2",
    slug: "restauracion-casa-werner-puerto-octay",
    title: "Obras de Restauración Casa Werner en Puerto Octay",
    excerpt:
      "Inauguración de exposición fotográfica documentando el proceso de recuperación de las fachadas de esta casa patrimonial en Puerto Octay.",
    content:
      "La Casa Werner es uno de los hitos del patrimonio arquitectónico de Puerto Octay, representativo de la inmigración alemana al lago Llanquihue. Las obras de restauración de sus fachadas fueron documentadas en una exposición fotográfica inaugurada en noviembre de 2022, que refleja el proceso de puesta en valor del patrimonio local impulsado por la Corporación PLOC.",
    date: "2022-11-23",
    category: "Patrimonio",
    isPublished: true,
  },
  {
    id: "3",
    slug: "exposicion-obras-osvaldo-thiers",
    title: "Exposición de Obras del Maestro Osvaldo Thiers",
    excerpt:
      "Primera exhibición de obras del artista hiperrealista y surrealista local en el Mercado Municipal de Puerto Octay.",
    content:
      "El Mercado Municipal de Puerto Octay acogió la primera exposición de obras del maestro Osvaldo Thiers, artista hiperrealista y surrealista de la zona. La muestra fue inaugurada el 30 de septiembre e integró el programa cultural de la corporación, poniendo en valor la producción artística local.",
    date: "2022-11-23",
    category: "Cultura",
    isPublished: true,
  },
  {
    id: "4",
    slug: "reunion-equipo-municipal",
    title: "Reunión con Equipo Municipal de Puerto Octay",
    excerpt:
      "Encuentro del directorio de PLOC con autoridades municipales para exponer avances e iniciativas de la corporación.",
    content:
      "El directorio de la Corporación PLOC se reunió con el equipo municipal de Puerto Octay para presentar los avances de sus iniciativas y establecer una agenda de trabajo colaborativo. Este encuentro reafirma el compromiso de PLOC con la articulación público-privada para el desarrollo del territorio.",
    date: "2022-11-23",
    category: "Institucional",
    isPublished: true,
  },
  {
    id: "5",
    slug: "inauguracion-mercado-municipal",
    title: "Inauguración Mercado Municipal",
    excerpt:
      "Apertura de infraestructura que valora el patrimonio arquitectónico y resuelve la falta de lugares de comercialización locales.",
    content:
      "La apertura del Mercado Municipal de Puerto Octay marca un hito para la economía local y la puesta en valor del patrimonio arquitectónico de la comuna. El espacio ofrece a productores y artesanos locales un lugar de comercialización digno y en un contexto patrimonialmente relevante.",
    date: "2022-03-14",
    category: "Desarrollo Territorial",
    isPublished: true,
  },
  {
    id: "6",
    slug: "nueva-costanera-puerto-octay",
    title: "Nueva Costanera de Puerto Octay",
    excerpt:
      "Inicio de obras en agosto 2021 para el nuevo borde costero con inversión de 3.200 millones de la Dirección de Obras Portuarias.",
    content:
      "Las obras del nuevo borde costero de Puerto Octay comenzaron en agosto de 2021, con una inversión de 3.200 millones de pesos de la Dirección de Obras Portuarias. El proyecto transformará la relación de la comunidad con el lago Llanquihue, creando espacios de recreación, conectividad y disfrute del paisaje.",
    date: "2021-11-30",
    category: "Desarrollo Territorial",
    isPublished: true,
  },
  {
    id: "7",
    slug: "restauracion-casa-schmidt",
    title: "Restauración Casa Schmidt",
    excerpt:
      "Obra de restauración iniciada en primer trimestre 2021 tras incendio de 2019 que afectó el 30% de esta casa patrimonial.",
    content:
      "La Casa Schmidt, uno de los íconos del patrimonio alemán de Puerto Octay, comenzó su proceso de restauración en el primer trimestre de 2021, tras el incendio de 2019 que afectó el 30% de su estructura. La Corporación PLOC acompañó la gestión y articulación de recursos para esta obra emblemática.",
    date: "2021-08-25",
    category: "Patrimonio",
    isPublished: true,
  },
];

// ─── Documents ────────────────────────────────────────────────────────────────

export const documents: Document[] = [
  {
    id: "1",
    title: "Memoria Anual PLOC 2023",
    description: "Informe de actividades, proyectos y resultados del año 2023.",
    url: "#",
    category: "Memorias",
    date: "2024-03-01",
    isPublic: true,
  },
  {
    id: "2",
    title: "Estatutos Corporación PLOC",
    description: "Documento fundacional y estatutos vigentes de la corporación.",
    url: "#",
    category: "Documentos Legales",
    date: "2021-01-01",
    isPublic: true,
  },
  {
    id: "3",
    title: "Informe de Transparencia 2023",
    description: "Distribución y uso de fondos durante el año 2023.",
    url: "#",
    category: "Transparencia",
    date: "2024-02-01",
    isPublic: true,
  },
];

// ─── Team Members ─────────────────────────────────────────────────────────────

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Directorio PLOC",
    role: "Gobierno Corporativo",
    bio: "La Corporación PLOC es dirigida por un directorio comprometido con el desarrollo sostenible e integrado de Puerto Octay.",
    sortOrder: 1,
  },
];
