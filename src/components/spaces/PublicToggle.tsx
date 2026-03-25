"use client";

import { useState } from "react";
import { Globe, Lock } from "lucide-react";

interface PublicToggleProps {
  spaceId: string;
  initialIsPublic: boolean;
}

export function PublicToggle({ spaceId, initialIsPublic }: PublicToggleProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const res = await fetch(`/api/spaces/${spaceId}/toggle-public`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setIsPublic(data.is_public);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
        isPublic
          ? "text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20"
          : "text-white/40 border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      {isPublic ? <Globe size={12} /> : <Lock size={12} />}
      {isPublic ? "Public" : "Private"}
    </button>
  );
}
