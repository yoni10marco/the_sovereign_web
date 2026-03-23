import type { NavigationProps, PageConfig } from "@/lib/morphing/config-schema";

interface NavigationBarProps extends NavigationProps {
  _navigate?: (slug: string | null) => void;
  _currentSlug?: string | null;
  _pages?: PageConfig[];
}

export function NavigationBar({ logo_text, links, _navigate, _currentSlug, _pages = [] }: NavigationBarProps) {
  const pagesSlugs = new Set(_pages.map((p) => p.slug));

  function renderLink(link: { label: string; url: string }, i: number) {
    const { label, url } = link;
    // Normalize: strip leading slash so "/about" matches slug "about"
    const slug = url.replace(/^\//, "");

    // Internal page navigation
    if (_navigate && pagesSlugs.has(slug)) {
      return (
        <button
          key={i}
          onClick={() => _navigate(slug)}
          className="text-sm font-medium opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
          style={{ color: _currentSlug === slug ? "var(--morph-accent)" : undefined }}
        >
          {label}
        </button>
      );
    }

    // External link
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

    // No match — hide the link entirely
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
