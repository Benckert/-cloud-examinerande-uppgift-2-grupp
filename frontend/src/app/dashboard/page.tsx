"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import EntryCard from "@/components/EntryCard";
import { getEntries } from "@/lib/supabase/queries";
import { getCurrentUser } from "@/lib/supabase/auth";
import { Entry } from "@/types/database.types";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const data = await getEntries();
        setEntries(data);
      } catch (err: any) {
        setError(err.message || "Failed to load entries");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-warm-gray text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="px-6 py-6 flex flex-col items-center">
        <div className="flex flex-col mb-12 w-full max-w-4xl">
          <div className="flex  justify-between">
            <h2 className="text-3xl font-serif text-dark-brown mb-2">
              Your Entries
            </h2>
            <Link href="/new-entry">
              <button className="btn-primary cursor-pointer">New Entry</button>
            </Link>
          </div>

          <p className="text-warm-gray text-sm">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-warm-gray mb-6">
              You haven't written any entries yet.
            </p>
            <Link href="/new-entry">
              <button className="btn-secondary">Write your first entry</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8 w-full max-w-4xl">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
