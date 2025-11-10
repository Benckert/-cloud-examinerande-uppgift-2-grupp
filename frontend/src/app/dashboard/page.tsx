"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import EntryCard from "@/components/EntryCard";
import { Entry } from "@/types/database.types";
import Link from "next/link";
import { usersApi } from "@/lib/api/users";
import { entriesApi } from "@/lib/api/entries";

export default function DashboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await usersApi.getCurrentUser();

        if (!currentUser) {
          router.push("/login");
          return;
        }

        setUser(currentUser);

        const data = await entriesApi.getAll();
        setEntries(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load entries");
        } else {
          setError(String(err) || "Failed to load entries");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleDelete = (deletedId: string) => {
    setEntries(entries.filter(entry => entry._id !== deletedId));
  };

  const handleUpdate = (id: string, updatedEntry: Partial<Entry>) => {
    setEntries(entries.map(entry =>
      entry._id === id ? { ...entry, ...updatedEntry } : entry
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header user={user} />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-warm-gray text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header user={user} />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header user={user} />

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
              You haven&apos;t written any entries yet.
            </p>
            <Link href="/new-entry">
              <button className="btn-secondary">Write your first entry</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8 w-full max-w-4xl">
            {entries.map((entry) => (
              <EntryCard
                key={entry._id}
                entry={entry}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
