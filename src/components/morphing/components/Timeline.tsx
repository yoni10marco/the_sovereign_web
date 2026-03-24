import type { TimelineProps } from "@/lib/morphing/config-schema";
import { IconRenderer } from "../IconRenderer";

export function Timeline({ items, orientation = "vertical" }: TimelineProps) {
  if (!items || items.length === 0) return null;

  if (orientation === "horizontal") {
    return (
      <div className="px-6 py-12 overflow-x-auto">
        <div className="flex gap-0 min-w-max relative">
          <div className="absolute top-5 left-0 right-0 h-0.5" style={{ background: "var(--morph-accent)" }} />
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center w-48 relative px-2">
              <div
                className="w-4 h-4 rounded-full z-10 mb-4 flex-shrink-0"
                style={{ background: "var(--morph-accent)" }}
              />
              <p className="text-xs font-semibold uppercase tracking-wider opacity-60 text-center">{item.date}</p>
              <p className="text-sm font-bold mt-1 text-center">{item.title}</p>
              <p className="text-xs opacity-60 mt-1 text-center">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <div className="relative">
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5"
          style={{ background: "var(--morph-secondary)" }}
        />
        {items.map((item, i) => (
          <div key={i} className="relative flex gap-6 mb-10 last:mb-0">
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm z-10"
              style={{ background: "var(--morph-accent)", color: "var(--morph-background)" }}
            >
              {item.icon ? <IconRenderer name={item.icon} size={16} /> : String(i + 1)}
            </div>
            <div className="pt-1">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">{item.date}</p>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="opacity-70 mt-1 text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
