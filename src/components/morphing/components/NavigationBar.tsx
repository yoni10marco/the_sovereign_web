import type { NavigationProps, PageConfig } from "@/lib/morphing/config-schema";

interface NavigationBarProps extends NavigationProps {
  _navigate?: (slug: string | null) => void;
  _currentSlug?: string | null;
  _pages?: PageConfig[];
}


export function NavigationBar({ logo_text, links, _navigate, _currentSlug, _pages = [] }: NavigationBarProps) {
  // External / anchor links from Gemini (sub-page slugs are handled via _pages directly)
  const externalLinks = (links ?? []).filter(({ url }) => url.startsWith("http") || url.startsWith("#"));

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <button
        className="text-xl font-bold"
        style={{ color: "var(--morph-primary)" }}
        onClick={() => _navigate?.(null)}
      >
        {logo_text}
      </button>
      <div className="flex gap-6 items-center flex-wrap">
        {/* Back to homepage button when on a sub-page */}
        {_currentSlug && _navigate && (
          <button
            onClick={() => _navigate(null)}
            className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
          >
            ← Home
          </button>
        )}
        {/* Sub-page buttons — sourced directly from _pages, never from Gemini link urls */}
        {_pages.map((page) => (
          <button
            key={page.slug}
            onClick={() => _navigate?.(page.slug)}
            className="text-sm font-medium opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
            style={{ color: _currentSlug === page.slug ? "var(--morph-accent)" : undefined }}
          >
            {page.title}
          </button>
        ))}
        {/* External / anchor links from Gemini */}
        {externalLinks.map(({ label, url }, i) =>
          url.startsWith("http") ? (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
            >
              {label}
            </a>
          ) : (
            <a key={i} href={url} className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">
              {label}
            </a>
          )
        )}
      </div>
    </nav>
  );
}
