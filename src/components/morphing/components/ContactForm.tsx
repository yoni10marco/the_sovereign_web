"use client";

import { useState } from "react";
import type { ContactFormProps } from "@/lib/morphing/config-schema";

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  message: "Message",
};

export function ContactForm({
  title = "Get in Touch",
  description,
  fields = ["name", "email", "message"],
  button_text = "Send Message",
}: ContactFormProps) {
  const [sent, setSent] = useState(false);

  return (
    <div className="px-6 py-12 max-w-2xl mx-auto">
      {title && (
        <h2 className="text-3xl font-bold mb-3 text-center" style={{ color: "var(--morph-primary)" }}>
          {title}
        </h2>
      )}
      {description && <p className="text-center opacity-70 mb-8">{description}</p>}

      {sent ? (
        <div
          className="text-center py-8"
          style={{ background: "var(--morph-secondary)", borderRadius: "var(--morph-radius)" }}
        >
          <p className="text-2xl mb-2">✅</p>
          <p className="font-semibold">Message sent!</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="flex flex-col gap-4"
        >
          {fields.map((field) => (
            field === "message" ? (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-sm font-medium opacity-70">{FIELD_LABELS[field]}</label>
                <textarea
                  rows={4}
                  placeholder={FIELD_LABELS[field]}
                  className="px-4 py-3 text-sm outline-none resize-none"
                  style={{
                    background: "var(--morph-secondary)",
                    borderRadius: "var(--morph-radius)",
                    color: "var(--morph-text)",
                    border: "1px solid rgba(128,128,128,0.2)",
                  }}
                />
              </div>
            ) : (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-sm font-medium opacity-70">{FIELD_LABELS[field]}</label>
                <input
                  type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                  placeholder={FIELD_LABELS[field]}
                  className="px-4 py-3 text-sm outline-none"
                  style={{
                    background: "var(--morph-secondary)",
                    borderRadius: "var(--morph-radius)",
                    color: "var(--morph-text)",
                    border: "1px solid rgba(128,128,128,0.2)",
                  }}
                />
              </div>
            )
          ))}
          <button
            type="submit"
            className="px-6 py-3 font-semibold transition-opacity hover:opacity-80 mt-2"
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
    </div>
  );
}
