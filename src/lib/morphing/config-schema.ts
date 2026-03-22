export interface SiteConfig {
  id: string;
  cycle_number: number;
  theme: ThemeConfig;
  components: ComponentConfig[];
}

export interface ThemeConfig {
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  accent_color: string;
  font_heading: string;
  font_body: string;
  border_radius: string;
}

export interface ComponentConfig {
  type: ComponentType;
  id: string;
  props: Record<string, unknown>;
  order: number;
}

export type ComponentType =
  | "navigation"
  | "hero"
  | "bento_grid"
  | "article"
  | "gallery"
  | "ticker"
  | "cta_banner"
  | "testimonials"
  | "stats"
  | "features"
  | "faq"
  | "pricing"
  | "team"
  | "footer"
  | "quote";

export interface HeroProps {
  headline: string;
  subheadline: string;
  background_image?: string;
  cta_text?: string;
  cta_url?: string;
  alignment: "left" | "center" | "right";
}

export interface NavigationProps {
  logo_text: string;
  links: { label: string; url: string }[];
}

export interface BentoGridProps {
  items: { title: string; description: string; image?: string; span?: number }[];
}

export interface ArticleProps {
  title: string;
  body: string;
  image?: string;
}

export interface GalleryProps {
  images: { src: string; alt: string; caption?: string }[];
  columns: number;
}

export interface TickerProps {
  items: string[];
  speed: "slow" | "normal" | "fast";
}

export interface CTABannerProps {
  headline: string;
  description: string;
  button_text: string;
  button_url: string;
}

export interface TestimonialProps {
  testimonials: { quote: string; author: string; role?: string; avatar?: string }[];
}

export interface StatsProps {
  stats: { value: string; label: string }[];
}

export interface FeaturesProps {
  features: { title: string; description: string; icon?: string }[];
}

export interface FAQProps {
  items: { question: string; answer: string }[];
}

export interface PricingProps {
  plans: { name: string; price: string; features: string[]; highlighted?: boolean }[];
}

export interface TeamProps {
  members: { name: string; role: string; image?: string; bio?: string }[];
}

export interface FooterProps {
  text: string;
  links: { label: string; url: string }[];
}

export interface QuoteProps {
  quote: string;
  author: string;
  source?: string;
}
