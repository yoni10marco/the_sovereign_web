"use client";

import { useState } from "react";
import type { NewsletterSignupProps } from "@/lib/morphing/config-schema";

export function NewsletterSignup({
  title = "Stay in the loop",
  description,
  placeholder = "Enter your email",
  button_text = "Subscribe",
  disclaimer,
}: NewsletterSignupProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      className="px-6 py-16 text-center"
      style={{ background: "var(--morph-secondary)" }}
    >
      <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--morph-primary)" }}>
        {title}
      </h2>
      {description && <p className="opacity-70 mb-8 max-w-md mx-auto">{description}</p>}

      {submitted ? (
        <p className="text-lg font-semibold" style={{ color: "var(--morph-accent)" }}>
          ✅ You&apos;re subscribed!
        </p>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
        >
          <input
            type="email"
            required
            placeholder={placeholder}
            className="flex-1 px-4 py-3 text-sm outline-none"
            style={{
              background: "var(--morph-background)",
              color: "var(--morph-text)",
              borderRadius: "var(--morph-radius)",
              border: "1px solid rgba(128,128,128,0.2)",
            }}
          />
          <button
            type="submit"
            className="px-6 py-3 font-semibold transition-opacity hover:opacity-80 whitespace-nowrap"
            style={{
              background: "var(--morph-accent)",
              color: "var(--morph-background)",
              borderRadius: "var(--morph-radius)",
            }}
          >
            {button_text}
          </button>
        </form>
      )}
      {disclaimer && <p className="mt-4 text-xs opacity-40">{disclaimer}</p>}
    </div>
  );
}
