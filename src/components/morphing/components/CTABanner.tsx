import type { CTABannerProps } from "@/lib/morphing/config-schema";

export function CTABanner({ headline, description, button_text }: CTABannerProps) {
  return (
    <section
      className="px-8 py-20 text-center"
      style={{ backgroundColor: "var(--morph-primary)", color: "var(--morph-background)" }}
    >
      <h2 className="text-3xl md:text-4xl font-bold">{headline}</h2>
      <p className="mt-4 text-lg opacity-80 max-w-2xl mx-auto">{description}</p>
      <button
        className="mt-8 px-8 py-3 font-semibold transition-transform hover:scale-105"
        style={{
          backgroundColor: "var(--morph-accent)",
          borderRadius: "var(--morph-radius)",
        }}
      >
        {button_text}
      </button>
    </section>
  );
}
