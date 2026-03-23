import type { CalloutBoxProps } from "@/lib/morphing/config-schema";

const TYPE_CONFIG = {
  info: { icon: "ℹ️", color: "#3b82f6" },
  warning: { icon: "⚠️", color: "#f59e0b" },
  success: { icon: "✅", color: "#22c55e" },
  tip: { icon: "💡", color: "#a855f7" },
};

export function CalloutBox({ type, title, body }: CalloutBoxProps) {
  const { icon, color } = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;

  return (
    <div className="px-6 py-4">
      <div
        className="flex gap-4 p-5 max-w-3xl mx-auto"
        style={{
          borderLeft: `4px solid ${color}`,
          background: "var(--morph-secondary)",
          borderRadius: "var(--morph-radius)",
        }}
      >
        <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
        <div>
          {title && <p className="font-bold mb-1">{title}</p>}
          <p className="opacity-80 text-sm leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}
