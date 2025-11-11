"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { entriesApi } from "@/lib/api/entries";
import { usersApi } from "@/lib/api/users";
import { moodOptions } from "@/lib/moods/moodOptions";

export default function NewEntryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<string>("neutral");
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const user = await usersApi.getCurrentUser();
      if (!user) {
        router.push("/login");
      }

      setUser(user);
    }

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    /* validering och saker som trim bör också flyttas till backend */
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);

    try {
      await entriesApi.create({ title, content, tags: mood });
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to create entry");
      } else {
        setError(String(err) || "Failed to create entry");
      }
    } finally {
      setLoading(false);
    }
  };

  /* Datum formattering och insättning bör flyttas till backend */
  const displayDate = new Date().toLocaleDateString("sv-SW", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen">
      <Header user={user} />

      <main className="max-w-4xl mx-auto py-6">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-warm-gray hover:text-dark-brown text-sm mb-4 cursor-pointer"
          >
            ← Back to entries
          </button>
          <h1 className="text-4xl font-serif text-dark-brown mb-2">
            New Entry
          </h1>
          <p className="text-warm-gray text-xs">{displayDate.toUpperCase()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm mb-2 text-dark-brown font-medium"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field text-xl font-serif"
              placeholder="Give your entry a title..."
              required
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="mood"
              className="block text-sm mb-2 text-dark-brown font-medium"
            >
              How are you feeling today?
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="input-field text-xl"
              disabled={loading}
            >
              {moodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.emoji} {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm mb-2 text-dark-brown font-medium"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field min-h-[400px] resize-y leading-relaxed"
              placeholder="Write your thoughts..."
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="btn-primary cursor-pointer"
              aria-label="save-entry"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Entry"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
