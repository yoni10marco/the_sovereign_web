import type { NavigationProps, PageConfig } from "@/lib/morphing/config-schema";

interface NavigationBarProps extends NavigationProps {
  _navigate?: (slug: string | null) => void;
  _currentSlug?: string | null;
  _pages?: PageConfig[];
}

// Same normalization as sanitizer — strip leading slash + replace non-slug chars + lowercase
function normalizeSlug(url: string): string {
  return url.replace(/^\//, "").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

export function NavigationBar({ logo_text, links, _navigate, _currentSlug, _pages = [] }: NavigationBarProps) {
  // Try to find the best-matching page slug for a given url
  function resolvePageSlug(url: string): string | null {
    if (!_navigate || _pages.length === 0) return null;
    const normalized = normalizeSlug(url);
    // 1. Exact match
    const exact = _pages.find((p) => p.slug === normalized);
    if (exact) return exact.slug;
    // 2. Fuzzy match: nav url is prefix/suffix of a page slug or vice versa
    const fuzzy = _pages.find(
      (p) => p.slug.startsWith(normalized) || normalized.startsWith(p.slug) || p.slug.includes(normalized) || normalized.includes(p.slug)
    );
    return fuzzy?.slug ?? null;
  }

  function renderLink(link: { label: string; url: string }, i: number) {
    const { label, url } = link;

    // External link — check before slug resolution
    if (url.startsWith("http")) {
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
        >
          {label}
        </a>
      );
    }

    // Anchor scroll
    if (url.startsWith("#")) {
      return (
        <a
          key={i}
          href={url}
          className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
        >
          {label}
        </a>
      );
    }

    // Internal page navigation — exact or fuzzy slug match
    const pageSlug = resolvePageSlug(url);
    if (pageSlug) {
      return (
        <button
          key={i}
          onClick={() => _navigate!(pageSlug)}
          className="text-sm font-medium opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
          style={{ color: _currentSlug === pageSlug ? "var(--morph-accent)" : undefined }}
        >
          {label}
        </button>
      );
    }

    // No match — hide
    return null;
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <button
        className="text-xl font-bold"
        style={{ color: "var(--morph-primary)" }}
        onClick={() => _navigate?.(null)}
      >
        {logo_text}
      </button>
      <div className="flex gap-6 items-center">
        {_currentSlug && _navigate && (
          <button
            onClick={() => _navigate(null)}
            className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
          >
            ← Home
          </button>
        )}
        {links?.map((link, i) => renderLink(link, i))}
      </div>
    </nav>
  );
}
