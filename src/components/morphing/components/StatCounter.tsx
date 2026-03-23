import type { StatsProps } from "@/lib/morphing/config-schema";

export function StatCounter({ stats }: StatsProps) {
  return (
    <section className="px-4 sm:px-8 py-12 sm:py-16">
      <div className="flex flex-wrap justify-center gap-8 sm:gap-12 max-w-4xl mx-auto">
        {stats?.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ color: "var(--morph-accent)" }}>
              {stat.value}
            </div>
            <div className="mt-2 text-sm opacity-70">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
