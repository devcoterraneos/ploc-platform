// ─── Campaigns ───────────────────────────────────────────────────────────────

export type CampaignStatus = "active" | "paused" | "finished" | "draft";
export type CampaignCategory =
  | "Patrimonio"
  | "Cultura"
  | "Medio Ambiente"
  | "Comunidad"
  | "Desarrollo Territorial"
  | "Educación";

export interface Campaign {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: CampaignCategory;
  goal: number;
  raised: number;
  startDate: string;
  endDate?: string;
  imageUrl: string;
  gallery?: string[];
  videoUrl?: string;
  status: CampaignStatus;
  isFeatured: boolean;
  isMainCampaign: boolean;
  sortOrder: number;
  donationAmounts: number[];
  ctaText: string;
  createdAt: string;
}

// ─── Donations ───────────────────────────────────────────────────────────────

export type DonationType = "one_time" | "recurring";
export type DonationStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "flow" | "transfer" | "cash" | "other";

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  campaignId: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  status: DonationStatus;
  type: DonationType;
  flowOrderId?: string;
  notes?: string;
}

// ─── Members (Socios) ─────────────────────────────────────────────────────────

export type MemberStatus = "active" | "cancelled" | "failed" | "pending";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  monthlyAmount: number;
  startDate: string;
  status: MemberStatus;
  campaignId?: string;
  flowSubscriptionId?: string;
  paymentHistory?: Payment[];
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  status: DonationStatus;
}

// ─── Metrics ─────────────────────────────────────────────────────────────────

export interface Metric {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: string;
  sortOrder: number;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  imageUrl?: string;
  isActive: boolean;
}

// ─── News ─────────────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  imageUrl?: string;
  isPublished: boolean;
}

// ─── Documents ────────────────────────────────────────────────────────────────

export interface Document {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  date: string;
  isPublic: boolean;
}

// ─── Team Members ────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  linkedIn?: string;
  sortOrder: number;
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  logoUrl: string;
  logoFooterUrl: string;
  sealUrl: string;
  primaryColor: string;
  secondaryColor: string;
  heroImageUrl: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroDonarText: string;
  heroProyectosText: string;
  heroCommunityCount: string;
  heroCommunityText: string;
  metrics: Metric[];
  projectsSectionTitle: string;
  projectsSectionSubtitle: string;
  testimonial: Testimonial;
  transparencyTitle: string;
  transparencySubtitle: string;
  transparencyItems: TransparencyItem[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialLinkedin: string;
  footerDescription: string;
}

export interface TransparencyItem {
  id: string;
  percentage: number;
  label: string;
  icon: string;
}

// ─── Flow Payment ─────────────────────────────────────────────────────────────

export interface FlowConfig {
  apiKey: string;
  secretKey: string;
  returnUrl: string;
  confirmUrl: string;
  mode: "sandbox" | "production";
}

export interface FlowPaymentRequest {
  subject: string;
  amount: number;
  email: string;
  name: string;
  campaignId: string;
  type: DonationType;
}

// ─── Supabase table names ─────────────────────────────────────────────────────

export type SupabaseTable =
  | "campaigns"
  | "donations"
  | "members"
  | "transactions"
  | "site_settings"
  | "testimonials"
  | "metrics"
  | "project_categories"
  | "admins"
  | "flow_config"
  | "news"
  | "documents"
  | "team_members"
  | "pages"
  | "media_library";
