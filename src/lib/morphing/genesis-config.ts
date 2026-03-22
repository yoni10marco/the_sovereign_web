import type { SiteConfig } from "./config-schema";

export const GENESIS_CONFIG: SiteConfig = {
  id: "genesis",
  cycle_number: 0,
  theme: {
    primary_color: "#a855f7",
    secondary_color: "#1e1b2e",
    background_color: "#0a0a0f",
    text_color: "#e2e8f0",
    accent_color: "#c084fc",
    font_heading: "Inter",
    font_body: "Inter",
    border_radius: "0.75rem",
  },
  components: [
    {
      type: "navigation",
      id: "nav-1",
      order: 0,
      props: {
        logo_text: "The Sovereign Web",
        links: [
          { label: "Leaderboard", url: "/leaderboard" },
          { label: "Submit", url: "/submit" },
          { label: "Hall of Fame", url: "/hall-of-fame" },
          { label: "Shop", url: "/shop" },
        ],
      },
    },
    {
      type: "hero",
      id: "hero-1",
      order: 1,
      props: {
        headline: "The Web Belongs to You",
        subheadline: "Every 24 hours, this website transforms based on YOUR vote. Submit a vision. Rally the crowd. Reshape the internet.",
        alignment: "center",
        cta_text: "Submit Your Vision →",
        cta_url: "/submit",
      },
    },
    {
      type: "stats",
      id: "stats-1",
      order: 2,
      props: {
        stats: [
          { value: "24h", label: "Until Next Morph" },
          { value: "∞", label: "Possibilities" },
          { value: "1", label: "Winner" },
          { value: "YOU", label: "The Architect" },
        ],
      },
    },
    {
      type: "features",
      id: "features-1",
      order: 3,
      props: {
        features: [
          { title: "Submit", description: "Upload your vision with an image and prompt. What should this site become?", icon: "🎨" },
          { title: "Vote", description: "Use your Pulse likes to vote for the ideas you love. Every like counts.", icon: "❤️" },
          { title: "Morph", description: "At midnight UTC, the winning vision comes alive. The entire site transforms.", icon: "✨" },
        ],
      },
    },
    {
      type: "cta_banner",
      id: "cta-1",
      order: 4,
      props: {
        headline: "Ready to Shape the Web?",
        description: "Join the experiment. Your next idea could be what everyone sees tomorrow.",
        button_text: "Get Started",
        button_url: "/signup",
      },
    },
    {
      type: "footer",
      id: "footer-1",
      order: 5,
      props: {
        text: "© The Sovereign Web — A generative social experiment",
        links: [
          { label: "Leaderboard", url: "/leaderboard" },
          { label: "Hall of Fame", url: "/hall-of-fame" },
        ],
      },
    },
  ],
};
