"use client";

import { useAuth } from "@/components/auth/AuthProvider";

interface AdSlotProps {
  placement: "banner-top" | "banner-bottom" | "interstitial" | "reward";
  className?: string;
}

export function AdSlot({ placement, className = "" }: AdSlotProps) {
  const { profile } = useAuth();

  // Pro users don't see ads
  if (profile?.is_pro) return null;

  // TODO: Replace with Propeller Ads script injection
  // Propeller will inject into data-ad-placement divs
  return (
    <div
      data-ad-placement={placement}
      className={`bg-white/5 border border-white/5 text-center py-2 text-xs text-white/20 ${className}`}
    >
      {placement === "interstitial" ? (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-xl text-center">
            <p className="text-white/40 text-sm">[Interstitial Ad Placeholder]</p>
            <button
              onClick={(e) => (e.currentTarget.parentElement!.parentElement!.style.display = "none")}
              className="mt-4 px-4 py-2 text-sm bg-purple-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        `[${placement} ad]`
      )}
    </div>
  );
}
