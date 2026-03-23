import type { PricingProps } from "@/lib/morphing/config-schema";

export function PricingTable({ plans }: PricingProps) {
  return (
    <section className="px-4 sm:px-8 py-12 sm:py-16">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
        {plans?.map((plan, i) => (
          <div
            key={i}
            className={`p-6 sm:p-8 border ${plan.highlighted ? "border-2" : "border-current/10"} flex flex-col`}
            style={{
              borderRadius: "var(--morph-radius)",
              borderColor: plan.highlighted ? "var(--morph-accent)" : undefined,
            }}
          >
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <div className="mt-2 text-3xl font-bold" style={{ color: "var(--morph-accent)" }}>
              {plan.price}
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              {plan.features?.map((f, j) => (
                <li key={j} className="text-sm flex items-start gap-2">
                  <span style={{ color: "var(--morph-accent)" }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="mt-8 w-full py-3 font-semibold transition-transform hover:scale-105"
              style={{
                backgroundColor: plan.highlighted ? "var(--morph-accent)" : "transparent",
                color: plan.highlighted ? "var(--morph-background)" : undefined,
                border: plan.highlighted ? "none" : "1px solid currentColor",
                borderRadius: "var(--morph-radius)",
                opacity: plan.highlighted ? 1 : 0.7,
              }}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
