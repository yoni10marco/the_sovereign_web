"use client";

import { useState } from "react";
import type { CodeBlockProps } from "@/lib/morphing/config-schema";

export function CodeBlock({ code, language, title, show_line_numbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lines = code.split("\n");

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {(title || language) && (
        <div
          className="flex items-center justify-between px-4 py-2 text-xs font-mono opacity-60"
          style={{
            background: "var(--morph-secondary)",
            borderRadius: `var(--morph-radius) var(--morph-radius) 0 0`,
            borderBottom: "1px solid rgba(128,128,128,0.2)",
          }}
        >
          <span>{title || language}</span>
          {language && <span className="uppercase">{language}</span>}
        </div>
      )}
      <div
        className="relative"
        style={{
          background: "var(--morph-secondary)",
          borderRadius: title || language ? `0 0 var(--morph-radius) var(--morph-radius)` : "var(--morph-radius)",
        }}
      >
        <button
          onClick={copy}
          className="absolute top-3 right-3 text-xs px-3 py-1 rounded opacity-60 hover:opacity-100 transition-opacity"
          style={{ background: "rgba(128,128,128,0.2)" }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <pre className="overflow-x-auto p-4 text-sm font-mono leading-relaxed">
          {show_line_numbers ? (
            lines.map((line, i) => (
              <div key={i} className="flex gap-4">
                <span className="select-none opacity-30 text-right w-6 flex-shrink-0">{i + 1}</span>
                <code>{line}</code>
              </div>
            ))
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
