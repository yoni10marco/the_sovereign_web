"use client";

import { useAuth } from "./AuthProvider";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return <div className="h-8 w-20 bg-white/10 animate-pulse rounded" />;
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {profile?.is_pro && (
        <span className="px-2 py-0.5 text-xs font-bold bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
          PRO
        </span>
      )}
      <span className="text-sm font-medium text-white/80">
        {profile?.is_pro ? (
          <span className="text-yellow-400">{profile.username}</span>
        ) : (
          profile?.username
        )}
      </span>
      <button
        onClick={handleSignOut}
        className="px-3 py-1.5 text-xs text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
