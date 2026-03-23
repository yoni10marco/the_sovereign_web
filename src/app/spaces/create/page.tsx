"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

export default function CreateSpacePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<"form" | "generating">("form");
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 5 - images.length;
    const toAdd = files.slice(0, remaining);
    const oversized = toAdd.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      setError("Each image must be under 5MB");
      return;
    }
    setImages((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const file of images) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/upload-image", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          setError(uploadData.error || "Image upload failed");
          setLoading(false);
          return;
        }
        imageUrls.push(uploadData.url);
      }

      // Create space record (stub purchase)
      const purchaseRes = await fetch("/api/spaces/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, prompt, imageUrls }),
      });
      const purchaseData = await purchaseRes.json();
      if (!purchaseRes.ok) {
        setError(purchaseData.error || "Failed to create space");
        setLoading(false);
        return;
      }

      const { spaceId } = purchaseData;
      setStage("generating");

      // Trigger AI generation
      const genRes = await fetch("/api/spaces/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId }),
      });
      const genData = await genRes.json();
      if (!genRes.ok) {
        setError(genData.error || "Generation failed");
        setStage("form");
        setLoading(false);
        return;
      }

      router.push(`/spaces/${spaceId}`);
    } catch (err) {
      console.error("Create space error:", err);
      setError("Something went wrong: " + String(err));
      setStage("form");
      setLoading(false);
    }
  };

  if (stage === "generating") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-6 animate-pulse">🏰</div>
        <h2 className="text-2xl font-bold mb-3">Building Your Space...</h2>
        <p className="text-white/50">
          The AI is conjuring your sovereign corner of the web. This takes about 10–20 seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Your Space</h1>
        <p className="text-white/50">
          Describe your vision and the AI will build a full site just for you — live for 24 hours.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
          <span>💳</span>
          <span>$9.99 / 24 hours — payment stubbed, free during beta</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Space Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="e.g., My Cyberpunk Portfolio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Describe Your Site</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            maxLength={500}
            rows={5}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            placeholder="Describe the look, feel, content, and vibe you want. The AI has full creative control — be as specific or abstract as you like."
          />
          <p className="text-xs text-white/30 mt-1">{prompt.length}/500</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Reference Images <span className="text-white/30">({images.length}/5, optional)</span>
          </label>
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt={`Preview ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/60 text-white text-xs rounded-full"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {images.length < 5 && (
            <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-white/10 rounded-lg text-white/40 hover:border-white/20 hover:text-white/60 transition-colors cursor-pointer">
              <span>+ Add image (max 5MB each)</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !title || !prompt}
          className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold rounded-lg transition-colors"
        >
          {loading ? "Processing..." : "Launch My Space →"}
        </button>

        {!user && (
          <p className="text-center text-sm text-white/40">
            You need to{" "}
            <a href="/login" className="text-amber-400 hover:underline">
              log in
            </a>{" "}
            to create a space.
          </p>
        )}
      </form>
    </div>
  );
}
