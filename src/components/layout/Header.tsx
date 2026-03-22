"use client";

import Link from "next/link";
import { UserMenu } from "@/components/auth/UserMenu";
import { PulseIndicator } from "@/components/pulse/PulseIndicator";
import { useAuth } from "@/components/auth/AuthProvider";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold text-white">
            <span className="text-purple-400">⚡</span> Sovereign Web
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/leaderboard" className="text-sm text-white/60 hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link href="/submit" className="text-sm text-white/60 hover:text-white transition-colors">
              Submit
            </Link>
            <Link href="/hall-of-fame" className="text-sm text-white/60 hover:text-white transition-colors">
              Hall of Fame
            </Link>
            <Link href="/shop" className="text-sm text-white/60 hover:text-white transition-colors">
              Shop
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user && <PulseIndicator />}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
