"use client";

import { useState } from "react";

export function DebugPanel() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  if (process.env.NEXT_PUBLIC_DEBUG_PANEL !== "true") return null;

  async function handleMorph() {
    setLoading("morph");
    setResult(null);
    try {
      const res = await fetch("/api/morph", { method: "POST" });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
      if (res.ok) {
        setTimeout(() => window.location.assign("/"), 1500);
      }
    } catch (e) {
      setResult(`Error: ${e}`);
    }
    setLoading(null);
  }

  async function handleEndVote() {
    setLoading("end");
    setResult(null);
    try {
      const res = await fetch("/api/debug/end-cycle", { method: "POST" });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(`Error: ${e}`);
    }
    setLoading(null);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end">
      {result && (
        <div className="bg-gray-900 border border-white/10 rounded-lg p-3 max-w-sm text-xs text-white/70 whitespace-pre-wrap">
          {result}
          <button onClick={() => setResult(null)} className="block mt-2 text-red-400 text-xs">
            dismiss
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={async () => {
            setLoading("status");
            setResult(null);
            try {
              const res = await fetch("/api/debug/status");
              const data = await res.json();
              setResult(JSON.stringify(data, null, 2));
            } catch (e) {
              setResult(`Error: ${e}`);
            }
            setLoading(null);
          }}
          disabled={loading !== null}
          className="px-3 py-2 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-lg"
        >
          {loading === "status" ? "..." : "Status"}
        </button>
        <button
          onClick={handleEndVote}
          disabled={loading !== null}
          className="px-3 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-lg"
        >
          {loading === "end" ? "Ending..." : "End Vote"}
        </button>
        <button
          onClick={handleMorph}
          disabled={loading !== null}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-lg"
        >
          {loading === "morph" ? "Morphing..." : "Morph Now"}
        </button>
      </div>
      <span className="text-[10px] text-white/30">DEBUG</span>
    </div>
  );
}
