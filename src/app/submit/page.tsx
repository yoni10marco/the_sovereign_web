"use client";

import { useState } from "react";
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
  const [generating, setGenerating] = useState(false);

  const COOL_IDEAS = [
    { title: "Neon Tokyo Ramen House", prompt: "A vibrant cyberpunk-themed ramen restaurant site with neon pink and electric blue colors, glowing menu items, a dark background with rain effects vibe, Japanese typography mixed with futuristic fonts, featuring a gallery of steaming ramen bowls, customer testimonials from fictional Tokyo locals, and a ticker scrolling daily specials." },
    { title: "Underwater Research Station", prompt: "A deep-sea research station website with dark ocean blue and bioluminescent green accents, featuring stats about ocean depth and species discovered, a team section of marine biologists, an FAQ about deep-sea exploration, a gallery of mysterious sea creatures, and a quote from Jacques Cousteau. Fonts should feel scientific yet elegant." },
    { title: "Vintage Vinyl Record Shop", prompt: "A warm retro record store site with amber, cream, and dark brown tones. Use a serif heading font and a clean body font. Include a hero welcoming music lovers, a bento grid of genre categories, testimonials from vinyl collectors, pricing for membership tiers, and a ticker of now-playing tracks. The vibe is cozy, nostalgic, and analog." },
    { title: "Solar Punk Community Garden", prompt: "A bright, optimistic solarpunk community garden site with lush greens, warm yellows, and terracotta. Feature a hero about growing together, stats on vegetables harvested and members, a gallery of garden plots, an FAQ about joining, team profiles of gardeners, and a CTA to sign up for a plot. Use rounded corners and friendly fonts." },
    { title: "Astral Meditation Retreat", prompt: "A serene cosmic meditation retreat website with deep indigo, soft purple, and starlight gold. Include a calming hero about finding inner peace, features highlighting different meditation techniques with celestial emoji icons, testimonials from past attendees, pricing for weekend and week-long retreats, and a gallery of the mountain retreat location under starry skies." },
    { title: "Brutalist Architecture Magazine", prompt: "A bold brutalist architecture magazine site with concrete gray, stark white, and a single accent of burnt orange. Use a heavy geometric heading font and minimal body font. Feature an article about the beauty of raw concrete, a gallery of iconic brutalist buildings, stats about the movement, a quote from Tadao Ando, and a bento grid of featured stories." },
    { title: "Tropical Surf School", prompt: "A sun-drenched surf school website with ocean teal, sandy beige, and coral pink. Include a hero with a big wave headline, features about lesson types with wave and sun emojis, testimonials from stoked students, a pricing table for group and private lessons, a gallery of epic surf shots, and a footer with beach vibes. Use a playful rounded font." },
    { title: "Haunted Victorian Library", prompt: "A dark, mysterious Victorian library site with deep burgundy, aged parchment, and gold leaf accents. Use an ornate serif heading font. Feature a hero about forbidden knowledge, a gallery of dusty tome collections, an FAQ about membership to the secret society, testimonials from ghostly patrons, stats about rare books catalogued, and a quote from Edgar Allan Poe." },
    { title: "Pixel Art Game Studio", prompt: "A retro pixel art game studio website with bright 8-bit colors — electric blue, hot pink, lime green on a dark background. Use a pixelated heading font and clean body font. Include a hero announcing the latest game, a bento grid of game titles, features about the studio with gaming emojis, team profiles of developers, and a ticker of achievement unlocks." },
    { title: "Alpine Coffee Roastery", prompt: "A cozy mountain coffee roastery site with rich espresso brown, cream, forest green, and warm copper accents. Feature a hero about beans roasted at altitude, a gallery of the roasting process and mountain views, stats on beans roasted and countries sourced from, pricing for subscription boxes, testimonials from coffee enthusiasts, and a quote about the perfect cup." },
  ];

  const handleGenerateCool = () => {
    setGenerating(true);
    const idea = COOL_IDEAS[Math.floor(Math.random() * COOL_IDEAS.length)];
    // Animate typing effect
    setTitle("");
    setPrompt("");
    let i = 0;
    const titleInterval = setInterval(() => {
      if (i < idea.title.length) {
        setTitle(idea.title.slice(0, i + 1));
        i++;
      } else {
        clearInterval(titleInterval);
        let j = 0;
        const promptInterval = setInterval(() => {
          if (j < idea.prompt.length) {
            setPrompt(idea.prompt.slice(0, j + 1));
            j++;
          } else {
            clearInterval(promptInterval);
            setGenerating(false);
          }
        }, 8);
      }
    }, 20);
  };

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

    try {
      let imageUrl: string | null = null;
      if (image) {
        const fd = new FormData();
        fd.append("file", image);
        const uploadRes = await fetch("/api/upload-image", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          setError(uploadData.error || "Image upload failed");
          setLoading(false);
          return;
        }
        imageUrl = uploadData.url;
      }

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, prompt, imageUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Show interstitial ad after submission
      setLoading(false);
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

      <button
        type="button"
        onClick={handleGenerateCool}
        disabled={generating || loading}
        className="w-full py-3 px-4 mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white font-semibold rounded-lg transition-all"
      >
        {generating ? "Generating..." : "Generate Cool Submission"}
      </button>

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
