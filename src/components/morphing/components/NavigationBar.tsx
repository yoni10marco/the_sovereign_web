import type { NavigationProps, PageConfig } from "@/lib/morphing/config-schema";

interface NavigationBarProps extends NavigationProps {
  _navigate?: (slug: string | null) => void;
  _currentSlug?: string | null;
  _pages?: PageConfig[];
}

export function NavigationBar({ logo_text, links, nav_style = "default", _navigate, _currentSlug, _pages = [] }: NavigationBarProps) {
  const externalLinks = (links ?? []).filter(({ url }) => url.startsWith("http") || url.startsWith("#"));

  const subPageButtons = _pages.map((page) => (
    <button
      key={page.slug}
      onClick={() => _navigate?.(page.slug)}
      style={{ color: _currentSlug === page.slug ? "var(--morph-accent)" : undefined }}
      className="text-sm font-medium opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
    >
      {page.title}
    </button>
  ));

  const extLinks = externalLinks.map(({ label, url }, i) =>
    url.startsWith("http") ? (
      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
        className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">
        {label}
      </a>
    ) : (
      <a key={i} href={url} className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">
        {label}
      </a>
    )
  );

  // Back button — always shown when on a sub-page
  const backButton = _currentSlug && _navigate ? (
    <button
      onClick={() => _navigate(null)}
      className="text-sm font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
    >
      ← Home
    </button>
  ) : null;

  const logoBtn = (cls = "text-xl font-bold") => (
    <button className={cls} style={{ color: "var(--morph-primary)", fontFamily: "var(--morph-font-heading)" }}
      onClick={() => _navigate?.(null)}>
      {logo_text}
    </button>
  );

  // ── CENTERED: logo on top, links below centered ──
  if (nav_style === "centered") {
    return (
      <nav className="flex flex-col items-center gap-3 px-6 py-5 border-b" style={{ borderColor: "var(--morph-primary)22" }}>
        {logoBtn("text-2xl font-bold")}
        <div className="flex gap-6 items-center flex-wrap justify-center">
          {backButton}
          {subPageButtons}
          {extLinks}
        </div>
      </nav>
    );
  }

  // ── PILL: links inside rounded pill capsules ──
  if (nav_style === "pill") {
    return (
      <nav className="flex items-center justify-between px-6 py-4">
        {logoBtn()}
        <div className="flex gap-2 items-center flex-wrap">
          {backButton && (
            <button
              onClick={() => _navigate!(null)}
              className="text-sm font-medium px-4 py-1.5 rounded-full border transition-all opacity-80 hover:opacity-100"
              style={{ borderColor: "var(--morph-primary)55" }}
            >
              ← Home
            </button>
          )}
          {_pages.map((page) => (
            <button
              key={page.slug}
              onClick={() => _navigate?.(page.slug)}
              className="text-sm font-medium px-4 py-1.5 rounded-full transition-all"
              style={{
                background: _currentSlug === page.slug ? "var(--morph-primary)" : "var(--morph-primary)18",
                color: _currentSlug === page.slug ? "var(--morph-background)" : undefined,
              }}
            >
              {page.title}
            </button>
          ))}
          {externalLinks.map(({ label, url }, i) =>
            url.startsWith("http") ? (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium px-4 py-1.5 rounded-full opacity-80 hover:opacity-100 transition-all"
                style={{ background: "var(--morph-primary)18" }}>
                {label}
              </a>
            ) : (
              <a key={i} href={url}
                className="text-sm font-medium px-4 py-1.5 rounded-full opacity-80 hover:opacity-100 transition-all"
                style={{ background: "var(--morph-primary)18" }}>
                {label}
              </a>
            )
          )}
        </div>
      </nav>
    );
  }

  // ── MINIMAL: tiny text, barely-there nav ──
  if (nav_style === "minimal") {
    return (
      <nav className="flex items-center justify-between px-8 py-3">
        <button className="text-sm font-semibold tracking-widest uppercase opacity-80 hover:opacity-100 transition-opacity"
          style={{ color: "var(--morph-text)", letterSpacing: "0.15em" }}
          onClick={() => _navigate?.(null)}>
          {logo_text}
        </button>
        <div className="flex gap-8 items-center">
          {backButton}
          {subPageButtons}
          {extLinks}
        </div>
      </nav>
    );
  }

  // ── BOLD: full-width colored bar ──
  if (nav_style === "bold") {
    return (
      <nav className="px-6 py-0" style={{ background: "var(--morph-primary)" }}>
        <div className="flex items-center justify-between h-14">
          <button className="text-lg font-black tracking-tight"
            style={{ color: "var(--morph-background)" }}
            onClick={() => _navigate?.(null)}>
            {logo_text}
          </button>
          <div className="flex gap-6 items-center">
            {_currentSlug && _navigate && (
              <button onClick={() => _navigate(null)}
                className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity"
                style={{ color: "var(--morph-background)" }}>
                ← Home
              </button>
            )}
            {_pages.map((page) => (
              <button key={page.slug} onClick={() => _navigate?.(page.slug)}
                className="text-sm font-bold transition-opacity"
                style={{
                  color: "var(--morph-background)",
                  opacity: _currentSlug === page.slug ? 1 : 0.75,
                  borderBottom: _currentSlug === page.slug ? "2px solid var(--morph-background)" : undefined,
                }}>
                {page.title}
              </button>
            ))}
            {externalLinks.map(({ label, url }, i) =>
              url.startsWith("http") ? (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-bold opacity-75 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--morph-background)" }}>
                  {label}
                </a>
              ) : (
                <a key={i} href={url} className="text-sm font-bold opacity-75 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--morph-background)" }}>
                  {label}
                </a>
              )
            )}
          </div>
        </div>
      </nav>
    );
  }

  // ── SIDEBAR: vertical left-side nav ──
  if (nav_style === "sidebar") {
    return (
      <nav className="flex flex-col gap-4 px-6 py-6 border-r w-48 min-h-screen fixed left-0 top-0 z-50"
        style={{ background: "var(--morph-background)", borderColor: "var(--morph-primary)22" }}>
        {logoBtn("text-lg font-bold mb-2")}
        {backButton}
        {subPageButtons}
        {extLinks}
      </nav>
    );
  }

  // ── DEFAULT: logo left, links right ──
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      {logoBtn()}
      <div className="flex gap-6 items-center flex-wrap">
        {backButton}
        {subPageButtons}
        {extLinks}
      </div>
    </nav>
  );
}
