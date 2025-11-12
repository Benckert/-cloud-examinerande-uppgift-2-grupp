"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import EntryCard from "@/components/EntryCard";
import { Entry } from "@/types/database.types";
import Link from "next/link";
import { usersApi } from "@/lib/api/users";
import { entriesApi } from "@/lib/api/entries";
import AISummary from "@/components/AISummary";

export default function DashboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);

  // Search-related state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  /*
   * Load initial data on component mount
   * Fetches the current user and their journal entries
   */
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

  useEffect(() => {
    // Clear any previous search errors
    setSearchError(null);

    // If search query is empty, reload all entries
    if (searchQuery.trim() === "") {
      // Don't search if we're still loading initial data
      if (!loading) {
        handleReloadEntries();
      }
      return;
    }

    // Set a timer to execute search after 300ms of no typing
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    // Cleanup function: cancel the timer if searchQuery changes
    // This ensures we only search after user stops typing
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, loading]);

  /*
   * Reload all entries (clear search)
   * Fetches all user entries from the API
   */
  const handleReloadEntries = async () => {
    try {
      setIsSearching(true);
      const data = await entriesApi.getAll();
      setEntries(data);
      setSearchError(null);
    } catch (err) {
      setSearchError("Failed to load entries");
      console.error("Failed to reload entries:", err);
    } finally {
      setIsSearching(false);
    }
  };

  /*
   * Execute search for journal entries
   * Calls the search API endpoint with the provided query
   */
  const handleSearch = async (query: string) => {
    // Don't search if query is empty (whitespace only)
    if (!query.trim()) {
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await entriesApi.search(query);
      setEntries(results);
    } catch (err) {
      setSearchError("Search failed. Please try again.");
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  /*
   * Handle entry deletion
   * Removes the deleted entry from the local state
   */
  const handleDelete = (deletedId: string) => {
    setEntries(entries.filter((entry) => entry._id !== deletedId));
  };

  const handleUpdate = (id: string, updatedEntry: Partial<Entry>) => {
    setEntries(
      entries.map((entry) =>
        entry._id === id ? { ...entry, ...updatedEntry } : entry
      )
    );
  };

  // Loading state UI
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

  // Error state UI
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
        <div className="flex flex-col mb-8 w-full max-w-4xl">
          <div className="flex justify-between mb-2">
            <h2 className="text-3xl font-serif text-dark-brown mb-2">
              Your Entries
            </h2>

            <Link href="/new-entry">
              <button className="btn-primary cursor-pointer">New Entry</button>
            </Link>
          </div>
          {/* Entry count and search status */}
          <p className="text-warm-gray text-sm mb-4">
            {isSearching ? (
              "Searching..."
            ) : (
              <>
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
                {searchQuery.trim() && ` found for "${searchQuery}"`}
              </>
            )}
          </p>

          {/* Search input field */}
          <input
            type="text"
            placeholder="Search entries by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full border border-warm-gray/20 rounded-sm shadow-sm focus:border-dark-brown"
            aria-label="Search journal entries"
          />

          {/* Search error message */}
          {searchError && (
            <p className="text-red-600 text-sm mb-2">{searchError}</p>
          )}
        </div>

        {/* Empty state - no entries */}
        {entries.length === 0 && !searchQuery.trim() ? (
          <div className="text-center py-16">
            <p className="text-warm-gray mb-6">
              You haven&apos;t written any entries yet.
            </p>
            <Link href="/new-entry">
              <button className="btn-secondary">Write your first entry</button>
            </Link>
          </div>
        ) : entries.length === 0 && searchQuery.trim() ? (
          // No search results found
          <div className="text-center py-16">
            <p className="text-warm-gray mb-4">
              No entries found matching &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="btn-secondary"
            >
              Clear search
            </button>
          </div>
        ) : (
          // Display entries
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
        <AISummary />
      </main>
    </div>
  );
}
