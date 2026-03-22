import type { TickerProps } from "@/lib/morphing/config-schema";

export function TickerBar({ items, speed = "normal" }: TickerProps) {
  const duration = speed === "slow" ? "30s" : speed === "fast" ? "10s" : "20s";

  return (
    <div className="overflow-hidden py-3 border-y border-current/10" style={{ backgroundColor: "var(--morph-secondary)" }}>
      <div
        className="flex gap-8 whitespace-nowrap animate-marquee"
        style={{ animationDuration: duration }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-sm font-medium opacity-80">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
