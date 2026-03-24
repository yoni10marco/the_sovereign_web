"use client";

import { useState } from "react";
import { Zap, Check } from "lucide-react";
import { AdSlot } from "@/components/layout/AdSlot";
import { useAuth } from "@/components/auth/AuthProvider";

interface ClaimPulseButtonProps {
  onClaimed?: () => void;
}

export function ClaimPulseButton({ onClaimed }: ClaimPulseButtonProps) {
  const { profile } = useAuth();
  const [step, setStep] = useState<"idle" | "ad" | "claiming" | "done">("idle");

  const handleClick = async () => {
    if (!profile?.is_pro) {
      // Free users see reward ad first
      setStep("ad");
      // TODO: Replace with actual Propeller reward ad callback
      // Simulate ad watch delay
      setTimeout(() => claimPulse(), 1000);
    } else {
      await claimPulse();
    }
  };

  const claimPulse = async () => {
    setStep("claiming");
    const res = await fetch("/api/pulse/claim", { method: "POST" });
    if (res.ok) {
      setStep("done");
      onClaimed?.();
      setTimeout(() => setStep("idle"), 2000);
    } else {
      setStep("idle");
    }
  };

  return (
    <div>
      {step === "ad" && <AdSlot placement="reward" />}
      <button
        onClick={handleClick}
        disabled={step !== "idle"}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
      >
        {step === "idle" && <><Zap size={14} className="inline mr-1" />Claim Your Pulse</>}
        {step === "ad" && "Watching ad..."}
        {step === "claiming" && "Claiming..."}
        {step === "done" && <><Check size={14} className="inline mr-1" />Pulse Claimed!</>}
      </button>
    </div>
  );
}
