import type { ComponentType as MorphComponentType } from "@/lib/morphing/config-schema";
import { NavigationBar } from "./components/NavigationBar";
import { HeroSection } from "./components/HeroSection";
import { BentoGrid } from "./components/BentoGrid";
import { ArticleBlock } from "./components/ArticleBlock";
import { GalleryGrid } from "./components/GalleryGrid";
import { TickerBar } from "./components/TickerBar";
import { CTABanner } from "./components/CTABanner";
import { TestimonialCarousel } from "./components/TestimonialCarousel";
import { StatCounter } from "./components/StatCounter";
import { FeatureCards } from "./components/FeatureCards";
import { FAQAccordion } from "./components/FAQAccordion";
import { PricingTable } from "./components/PricingTable";
import { TeamGrid } from "./components/TeamGrid";
import { FooterBlock } from "./components/FooterBlock";
import { QuoteBlock } from "./components/QuoteBlock";
import { VideoEmbed } from "./components/VideoEmbed";
import { MapEmbed } from "./components/MapEmbed";
import { CountdownTimer } from "./components/CountdownTimer";
import { ImageCarousel } from "./components/ImageCarousel";
import { Timeline } from "./components/Timeline";
import { LogoCloud } from "./components/LogoCloud";
import { SocialLinks } from "./components/SocialLinks";
import { ImageTextSplit } from "./components/ImageTextSplit";
import { CalloutBox } from "./components/CalloutBox";
import { MasonryGallery } from "./components/MasonryGallery";
import { ContactForm } from "./components/ContactForm";
import { EmbedBlock } from "./components/EmbedBlock";
import { CodeBlock } from "./components/CodeBlock";
import { Marquee } from "./components/Marquee";
import { ProfileCard } from "./components/ProfileCard";
import { NumberedSteps } from "./components/NumberedSteps";
import { ComparisonTable } from "./components/ComparisonTable";
import { NewsletterSignup } from "./components/NewsletterSignup";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPONENT_REGISTRY: Record<MorphComponentType, React.ComponentType<any>> = {
  navigation: NavigationBar,
  hero: HeroSection,
  bento_grid: BentoGrid,
  article: ArticleBlock,
  gallery: GalleryGrid,
  ticker: TickerBar,
  cta_banner: CTABanner,
  testimonials: TestimonialCarousel,
  stats: StatCounter,
  features: FeatureCards,
  faq: FAQAccordion,
  pricing: PricingTable,
  team: TeamGrid,
  footer: FooterBlock,
  quote: QuoteBlock,
  video_embed: VideoEmbed,
  map_embed: MapEmbed,
  countdown_timer: CountdownTimer,
  image_carousel: ImageCarousel,
  timeline: Timeline,
  logo_cloud: LogoCloud,
  social_links: SocialLinks,
  image_text_split: ImageTextSplit,
  callout_box: CalloutBox,
  masonry_gallery: MasonryGallery,
  contact_form: ContactForm,
  embed_block: EmbedBlock,
  code_block: CodeBlock,
  marquee: Marquee,
  profile_card: ProfileCard,
  numbered_steps: NumberedSteps,
  comparison_table: ComparisonTable,
  newsletter_signup: NewsletterSignup,
};
