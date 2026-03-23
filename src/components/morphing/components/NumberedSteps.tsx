import type { NumberedStepsProps } from "@/lib/morphing/config-schema";

export function NumberedSteps({ title, steps, layout = "vertical" }: NumberedStepsProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="px-6 py-12">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-10" style={{ color: "var(--morph-primary)" }}>
          {title}
        </h2>
      )}
      <div
        className={
          layout === "horizontal"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
            : "flex flex-col gap-0 max-w-2xl mx-auto"
        }
      >
        {steps.map((step, i) => (
          <div key={i} className={layout === "vertical" ? "flex gap-5 relative" : "flex flex-col items-center text-center"}>
            {/* Connector line for vertical */}
            {layout === "vertical" && i < steps.length - 1 && (
              <div
                className="absolute left-5 top-10 w-0.5 h-full -z-0"
                style={{ background: "var(--morph-secondary)" }}
              />
            )}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 z-10"
              style={{ background: "var(--morph-accent)", color: "var(--morph-background)" }}
            >
              {i + 1}
            </div>
            <div className={layout === "vertical" ? "pb-8" : "mt-4"}>
              <h3 className="font-bold text-lg">{step.title}</h3>
              <p className="opacity-70 text-sm mt-1 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
