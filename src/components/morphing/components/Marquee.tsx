import type { MarqueeProps } from "@/lib/morphing/config-schema";

const SPEED_DURATION: Record<string, string> = {
  slow: "40s",
  normal: "20s",
  fast: "10s",
};

export function Marquee({ items, speed = "normal", direction = "left", separator = "•" }: MarqueeProps) {
  if (!items || items.length === 0) return null;

  const content = items.map((item, i) => (
    <span key={i} className="flex items-center gap-6">
      <span>{item}</span>
      <span className="opacity-40">{separator}</span>
    </span>
  ));

  // Duplicate for seamless loop
  const allItems = [...content, ...content];
  const duration = SPEED_DURATION[speed] ?? SPEED_DURATION.normal;
  const animationDirection = direction === "right" ? "reverse" : "normal";

  return (
    <div
      className="py-4 overflow-hidden"
      style={{ background: "var(--morph-secondary)" }}
    >
      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{
          animationDuration: duration,
          animationDirection,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationName: "marquee",
          gap: "1.5rem",
        }}
      >
        {allItems}
      </div>
    </div>
  );
}
