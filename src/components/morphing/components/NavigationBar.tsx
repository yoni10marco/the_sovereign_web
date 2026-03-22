import type { NavigationProps } from "@/lib/morphing/config-schema";

export function NavigationBar({ logo_text, links }: NavigationProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <span className="text-xl font-bold" style={{ color: "var(--morph-primary)" }}>
        {logo_text}
      </span>
      <div className="flex gap-6">
        {links?.map((link, i) => (
          <span
            key={i}
            className="text-sm font-medium opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
          >
            {link.label}
          </span>
        ))}
      </div>
    </nav>
  );
}
