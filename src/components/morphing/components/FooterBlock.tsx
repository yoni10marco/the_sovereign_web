import type { FooterProps } from "@/lib/morphing/config-schema";

export function FooterBlock({ text, links }: FooterProps) {
  return (
    <footer className="px-8 py-8 border-t border-current/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm opacity-60">{text}</p>
        <div className="flex gap-6">
          {links?.map((link, i) => (
            <span key={i} className="text-sm opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
              {link.label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
