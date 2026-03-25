"use client";

import { Castle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";

interface Space {
  id: string;
  title: string;
  prompt: string;
  status: string;
  expires_at: string;
  purchased_at: string;
}

function SpaceCard({ space }: { space: Space }) {
  const now = new Date();
  const expiresAt = new Date(space.expires_at);
  const isExpired = now > expiresAt || space.status === "expired";
  const hoursLeft = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));

  const statusColors: Record<string, string> = {
    active: "text-green-400 bg-green-400/10 border-green-400/20",
    generating: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    expired: "text-white/30 bg-white/5 border-white/10",
  };

  const statusLabel: Record<string, string> = {
    active: "Live",
    generating: "Generating...",
    pending: "Pending",
    expired: "Expired",
  };

  const colorClass = statusColors[space.status] ?? statusColors.expired;
  const label = statusLabel[space.status] ?? space.status;

  return (
    <div className={`border rounded-xl p-5 transition-colors ${isExpired ? "border-white/10 opacity-60" : "border-white/10 hover:border-white/20"}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-lg leading-tight">{space.title}</h3>
        <span className={`shrink-0 text-xs px-2 py-1 rounded-full border ${colorClass}`}>{label}</span>
      </div>
      <p className="text-white/40 text-sm line-clamp-2 mb-4">{space.prompt}</p>
      <div className="flex items-center justify-between text-xs text-white/30">
        {isExpired ? (
          <span>Expired {new Date(space.expires_at).toLocaleDateString()}</span>
        ) : (
          <span>{hoursLeft}h remaining</span>
        )}
        {space.status === "active" && (
          <Link
            href={`/spaces/${space.id}`}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors text-xs"
          >
            View Space
          </Link>
        )}
        {space.status === "generating" && (
          <Link
            href={`/spaces/${space.id}`}
            className="px-3 py-1 bg-white/10 text-white/50 rounded-lg text-xs cursor-wait"
          >
            Building...
          </Link>
        )}
      </div>
    </div>
  );
}

export default function SpacesPage() {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch("/api/spaces/my")
      .then((r) => r.json())
      .then((d) => setSpaces(d.spaces ?? []))
      .finally(() => setLoading(false));
  }, [user]);

  const activeSpaces = spaces.filter((s) => s.status !== "expired");
  const expiredSpaces = spaces.filter((s) => s.status === "expired");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sovereign Spaces</h1>
          <p className="text-white/50">
            Your own corner of The Sovereign Web. Full creative control, no voting required.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/spaces/explore"
            className="shrink-0 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Explore
          </Link>
          <Link
            href="/spaces/create"
            className="shrink-0 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors text-sm"
          >
            + New Space
          </Link>
        </div>
      </div>

      {/* Pricing info */}
      <div className="mb-8 p-5 bg-white/3 border border-white/10 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <p className="font-semibold mb-1 flex items-center gap-2"><Castle size={16} className="text-amber-400" />Own a Private Space</p>
          <p className="text-white/50 text-sm">
            Your site, your rules. The AI builds whatever you dream up — live for 24 hours with no community votes.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-2xl font-bold">$9.99</span>
          <span className="text-white/40 text-sm"> / 24h</span>
          <p className="text-xs text-amber-400 mt-1">Free during beta</p>
        </div>
      </div>

      {!user ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <p className="text-white/50 mb-4">Log in to create and manage your spaces.</p>
          <Link
            href="/login"
            className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-colors"
          >
            Log In
          </Link>
        </div>
      ) : loading ? (
        <div className="text-center py-16 text-white/30">Loading your spaces...</div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <Castle size={40} className="text-amber-400/40 mx-auto mb-4" />
          <p className="text-white/50 mb-6">You don&apos;t have any spaces yet.</p>
          <Link
            href="/spaces/create"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors"
          >
            Create Your First Space
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {activeSpaces.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Active</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {activeSpaces.map((s) => <SpaceCard key={s.id} space={s} />)}
              </div>
            </section>
          )}
          {expiredSpaces.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Expired</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {expiredSpaces.map((s) => <SpaceCard key={s.id} space={s} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
