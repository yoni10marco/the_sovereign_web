export interface SiteConfig {
  id: string;
  cycle_number: number;
  theme: ThemeConfig;
  components: ComponentConfig[];
  pages?: PageConfig[];
}

export interface PageConfig {
  slug: string;
  title: string;
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
  background_pattern?: "none" | "dots" | "grid" | "diagonal" | "gradient" | "crosshatch" | "noise";
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
  | "quote"
  | "video_embed"
  | "map_embed"
  | "countdown_timer"
  | "image_carousel"
  | "timeline"
  | "logo_cloud"
  | "social_links"
  | "image_text_split"
  | "callout_box"
  | "masonry_gallery"
  | "contact_form"
  | "embed_block"
  | "code_block"
  | "marquee"
  | "profile_card"
  | "numbered_steps"
  | "comparison_table"
  | "newsletter_signup";

// ---- Existing prop interfaces ----

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

// ---- New prop interfaces ----

export interface VideoEmbedProps {
  url: string;
  title?: string;
  aspect?: "16:9" | "4:3";
}

export interface MapEmbedProps {
  location: string;
  height?: number;
  zoom?: number;
}

export interface CountdownTimerProps {
  target_date: string;
  title?: string;
  description?: string;
}

export interface ImageCarouselProps {
  images: { src: string; alt: string; caption?: string }[];
  auto_play?: boolean;
  interval?: number;
}

export interface TimelineProps {
  items: { date: string; title: string; description: string; icon?: string }[];
  orientation?: "vertical" | "horizontal";
}

export interface LogoCloudProps {
  title?: string;
  logos: { src: string; alt: string; url?: string }[];
  columns?: number;
}

export interface SocialLinksProps {
  links: { platform: string; url: string; label?: string }[];
  size?: "sm" | "md" | "lg";
  layout?: "row" | "grid";
}

export interface ImageTextSplitProps {
  image: string;
  alt?: string;
  title: string;
  body: string;
  cta_text?: string;
  cta_url?: string;
  image_side?: "left" | "right";
}

export interface CalloutBoxProps {
  type: "info" | "warning" | "success" | "tip";
  title?: string;
  body: string;
}

export interface MasonryGalleryProps {
  images: { src: string; alt: string; caption?: string }[];
  columns?: number;
}

export interface ContactFormProps {
  title?: string;
  description?: string;
  fields?: ("name" | "email" | "message" | "phone")[];
  button_text?: string;
}

export interface EmbedBlockProps {
  url: string;
  title?: string;
  height?: number;
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  show_line_numbers?: boolean;
}

export interface MarqueeProps {
  items: string[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  separator?: string;
}

export interface ProfileCardProps {
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  social_links?: { platform: string; url: string }[];
}

export interface NumberedStepsProps {
  title?: string;
  steps: { title: string; description: string }[];
  layout?: "vertical" | "horizontal";
}

export interface ComparisonTableProps {
  title?: string;
  columns: string[];
  rows: { feature: string; values: (string | boolean)[] }[];
}

export interface NewsletterSignupProps {
  title?: string;
  description?: string;
  placeholder?: string;
  button_text?: string;
  disclaimer?: string;
}
