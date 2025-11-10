import { Entry } from "@/types/database.types";
import { entriesApi } from "../lib/api/entries"
import { moodEmojis } from "@/lib/moods/moodOptions";

interface EntryCardProps {
  entry: Entry;
  onDelete: (id: string) => void;
}

export default function EntryCard({ entry, onDelete }: EntryCardProps) {
  console.log('Entry tags:', entry.tags);
  const formattedDate = new Date(entry.createdAt).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await entriesApi.delete(entry._id);
      onDelete(entry._id)
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-2xl font-serif text-dark-brown mb-3">
          {entry.title}
        </h2>
          {entry.tags && (
            <span className="flex items-center gap-2">
              <span className="text-lg">{moodEmojis[entry.tags] || "😐"}</span>
              <span className="capitalize">{entry.tags}</span>
            </span>
          )}
        </div>
        
      </div>
      <p className="text-dark-brown/80 leading-relaxed whitespace-pre-wrap">
        {entry.content}
      </p>
      <div className="flex items-center justify-between text-xs text-warm-gray mt-4">
          <span className="tracking-wide uppercase">{formattedDate}</span>
          <div className="flex gap-2">
            <button><svg className="p-1.5 pr-3 pl-3.5 rounded-md bg-neutral-100 cursor-pointer hover:bg-blue-100 hover:fill-blue-800 transition" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="48px" fill="#9f9f9f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg></button>
            <button onClick={handleDelete}><svg className="p-1.5 pr-3 pl-3.5 rounded-md bg-neutral-100 cursor-pointer hover:bg-red-100 hover:fill-red-800 transition" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="48px" fill="#9f9f9f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
          </div>
      </div>

    </div>
  );
}
