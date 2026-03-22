import type { TeamProps } from "@/lib/morphing/config-schema";

export function TeamGrid({ members }: TeamProps) {
  return (
    <section className="px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {members?.map((m, i) => (
          <div key={i} className="text-center">
            {m.image ? (
              <img src={m.image} alt={m.name} className="w-24 h-24 rounded-full object-cover mx-auto" />
            ) : (
              <div
                className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-2xl font-bold"
                style={{ backgroundColor: "var(--morph-secondary)", color: "var(--morph-primary)" }}
              >
                {m.name.charAt(0)}
              </div>
            )}
            <h3 className="mt-4 font-semibold">{m.name}</h3>
            <p className="text-sm opacity-60">{m.role}</p>
            {m.bio && <p className="mt-2 text-xs opacity-50">{m.bio}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
