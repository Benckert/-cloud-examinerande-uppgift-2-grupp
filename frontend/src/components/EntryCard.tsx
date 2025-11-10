import { Entry } from "@/types/database.types";
import { moodEmojis } from "@/lib/moods/moodOptions";

interface EntryCardProps {
  entry: Entry;
}

export default function EntryCard({ entry }: EntryCardProps) {
  console.log('Entry tags:', entry.tags);
  const formattedDate = new Date(entry.createdAt).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="card">
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-warm-gray mb-2 ">
          <span className="tracking-wide uppercase">{formattedDate}</span>
          {entry.tags && (
            <span className="flex items-center gap-2">
              <span className="text-lg">{moodEmojis[entry.tags] || "😐"}</span>
              <span className="capitalize">{entry.tags}</span>
            </span>
          )}
        </div>
        <h2 className="text-2xl font-serif text-dark-brown mb-3">
          {entry.title}
        </h2>
      </div>
      <p className="text-dark-brown/80 leading-relaxed whitespace-pre-wrap">
        {entry.content}
      </p>
    </div>
  );
}
