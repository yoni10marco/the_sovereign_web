"use client";

import { Crown, Heart, Bomb } from "lucide-react";
import { PRODUCTS } from "@/lib/polar";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ShopPage() {
  const { profile } = useAuth();

  const handlePurchase = async (product: keyof typeof PRODUCTS) => {
    // TODO: Replace with actual Polar checkout
    alert(`Polar checkout coming soon for: ${PRODUCTS[product].name}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Shop</h1>
      <p className="text-white/50 mb-8">Power up your influence on The Sovereign Web.</p>

      {/* Sovereign Pass */}
      <div className="mb-12 p-8 bg-gradient-to-br from-purple-900/20 to-purple-600/10 border border-purple-500/20 rounded-2xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={20} className="text-yellow-400" />
              <h2 className="text-2xl font-bold">Sovereign Pass</h2>
              {profile?.is_pro && (
                <span className="px-2 py-0.5 text-xs font-bold bg-yellow-500/20 text-yellow-400 rounded-full">ACTIVE</span>
              )}
            </div>
            <p className="text-white/60 max-w-lg">
              Go ad-free, get 25 likes per pulse with stacking, and stand out with a golden Pro badge.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>No ads — ever</li>
              <li>25 likes per pulse (5x more)</li>
              <li>Stack up to 2 pulses</li>
              <li>Golden username & Pro badge</li>
            </ul>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">$2.49</div>
            <div className="text-sm text-white/40">/week</div>
          </div>
        </div>
        <button
          onClick={() => handlePurchase("subscription")}
          disabled={profile?.is_pro}
          className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
        >
          {profile?.is_pro ? "You're Already Pro" : "Subscribe Now"}
        </button>
      </div>

      {/* Micro-transactions */}
      <h2 className="text-xl font-bold mb-4">Boosts</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <Heart size={24} className="text-purple-400" />
            <div>
              <h3 className="font-semibold">{PRODUCTS.like_pack.name}</h3>
              <p className="text-sm text-white/50">{PRODUCTS.like_pack.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-bold">${(PRODUCTS.like_pack.price_cents / 100).toFixed(2)}</span>
            <button
              onClick={() => handlePurchase("like_pack")}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Buy
            </button>
          </div>
        </div>

        <div className="p-6 bg-white/5 border border-red-500/10 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <Bomb size={24} className="text-red-400" />
            <div>
              <h3 className="font-semibold text-red-400">{PRODUCTS.dislike_bomb.name}</h3>
              <p className="text-sm text-white/50">{PRODUCTS.dislike_bomb.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-bold">${(PRODUCTS.dislike_bomb.price_cents / 100).toFixed(2)}</span>
            <button
              onClick={() => handlePurchase("dislike_bomb")}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
