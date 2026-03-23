"use client";

import { useState } from "react";
import type { FAQProps } from "@/lib/morphing/config-schema";

export function FAQAccordion({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-3xl mx-auto">
      <div className="space-y-2">
        {items?.map((item, i) => (
          <div
            key={i}
            className="border border-current/10"
            style={{ borderRadius: "var(--morph-radius)" }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left px-4 sm:px-6 py-4 flex items-center justify-between font-medium"
            >
              {item.question}
              <span className="ml-4 text-lg">{openIndex === i ? "−" : "+"}</span>
            </button>
            {openIndex === i && (
              <div className="px-4 sm:px-6 pb-4 text-sm opacity-75">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
