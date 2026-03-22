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
};
