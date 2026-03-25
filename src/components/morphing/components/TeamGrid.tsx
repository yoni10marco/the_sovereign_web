import type { TeamProps } from "@/lib/morphing/config-schema";
import { SafeImage } from "../SafeImage";

export function TeamGrid({ members }: TeamProps) {
  return (
    <section className="px-4 sm:px-8 py-12 sm:py-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
        {members?.map((m, i) => (
          <div key={i} className="text-center">
            {m.image ? (
              <SafeImage src={m.image} alt={m.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto" />
            ) : (
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: "var(--morph-secondary)", color: "var(--morph-primary)" }}
              >
                {m.name.charAt(0)}
              </div>
            )}
            <h3 className="mt-3 sm:mt-4 font-semibold text-sm sm:text-base">{m.name}</h3>
            <p className="text-xs sm:text-sm opacity-60">{m.role}</p>
            {m.bio && <p className="mt-2 text-xs opacity-50">{m.bio}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
