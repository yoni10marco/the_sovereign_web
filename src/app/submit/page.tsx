"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { AdSlot } from "@/components/layout/AdSlot";

export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAd, setShowAd] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be under 5MB");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    const supabase = createClient();

    try {
      // Get active cycle
      const { data: cycle } = await supabase
        .from("morph_cycles")
        .select("id")
        .eq("status", "active")
        .order("cycle_number", { ascending: false })
        .limit(1)
        .single();

      if (!cycle) {
        setError("No active cycle found");
        setLoading(false);
        return;
      }

      // Check if user already submitted
      const { data: existing } = await supabase
        .from("proposals")
        .select("id")
        .eq("cycle_id", cycle.id)
        .eq("user_id", user.id)
        .limit(1);

      if (existing && existing.length > 0) {
        setError("You've already submitted a proposal this cycle");
        setLoading(false);
        return;
      }

      // Upload image if provided
      let imageUrl: string | null = null;
      if (image) {
        const ext = image.name.split(".").pop();
        const path = `${user.id}/${cycle.id}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("proposal-images")
          .upload(path, image, { upsert: true });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          setError("Failed to upload image: " + uploadError.message);
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("proposal-images")
          .getPublicUrl(path);

        imageUrl = urlData.publicUrl;
      }

      // Insert proposal
      const { error: insertError } = await supabase.from("proposals").insert({
        cycle_id: cycle.id,
        user_id: user.id,
        title,
        prompt,
        image_url: imageUrl,
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      // Show interstitial ad after submission
      setShowAd(true);
      setTimeout(() => {
        router.push("/leaderboard");
      }, 2000);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Something went wrong: " + String(err));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {showAd && <AdSlot placement="interstitial" />}

      <h1 className="text-3xl font-bold mb-2">Submit Your Vision</h1>
      <p className="text-white/50 mb-8">
        What should this website become? Upload an image and describe your vision.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Minimalist Italian Cooking Blog"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            maxLength={500}
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Describe what the site should look like, what content it should have, the vibe..."
          />
          <p className="text-xs text-white/30 mt-1">{prompt.length}/500</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Reference Image</label>
          <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/20 transition-colors">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded" />
                <button
                  type="button"
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <p className="text-white/40">Click to upload an image (max 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !title || !prompt}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? "Submitting..." : "Submit Proposal"}
        </button>
      </form>
    </div>
  );
}
