"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

interface PaymentGateProps {
  children: React.ReactNode;
  feature?: string;
}

export function PaymentGate({ children, feature = "this feature" }: PaymentGateProps) {
  const { profile } = useAuth();

  if (profile?.is_pro) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6 bg-gray-900/90 rounded-xl border border-purple-500/20">
          <p className="text-white font-semibold">Unlock {feature}</p>
          <p className="text-white/50 text-sm mt-1">Upgrade to Sovereign Pass</p>
          <Link
            href="/shop"
            className="mt-3 inline-block px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Upgrade — $2.49/week
          </Link>
        </div>
      </div>
    </div>
  );
}
