import { Entry } from "@/types/database.types";
import { entriesApi } from "../lib/api/entries"
import { moodEmojis } from "@/lib/moods/moodOptions";
import { useState } from "react";

interface EntryCardProps {
  entry: Entry;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updateEntry:  Partial<Entry>) => void;
}

export default function EntryCard({ entry, onDelete, onUpdate }: EntryCardProps) {
  const [modalClicked, setModalClicked] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    title: entry.title,
    content: entry.content,
    tags: entry.tags || ""
  })

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
      onDelete(entry._id);
      setModalClicked(false);
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEdit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      await entriesApi.update(entry._id, {
        title: editForm.title,
        content: editForm.content,
        tags: editForm.tags
      });

      onUpdate(entry._id, editForm);
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update entry:", error);
    }
  }

  const toggleModal = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    event.preventDefault();
    setModalClicked(prev => !prev)
  }

  return (
    <div className="card relative">

      {/* Delete modal */}
      {modalClicked && ( 
        <>
          <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-40" onClick={toggleModal}/>
          
            <div className={modalClicked ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md w-fit shadow-md border-2 border-solid border-red-600 z-50" : "hidden"}>
              <h3 className="text-2xl text-center">Are you sure you want to delete this entry?</h3>
              <p className="text-center">This action cannot be undone.</p>
              <div className="flex flex-end gap-3 justify-center mt-10">
                <button onClick={toggleModal} className="text-[14px] bg-neutral-200 p-2 pl-3 pr-3 rounded-md cursor-pointer hover:bg-neutral-300 transition">Cancel</button>
                <button onClick={handleDelete} className="text-[14px] bg-red-600 text-red-50 p-2 pl-3 pr-3 rounded-md cursor-pointer hover:bg-red-700 transition">Yes, I'm sure</button>
              </div>
            </div>
        </>
      )}

      {/* Edit mmodal */}
      {isEditing && (
        <>
        <h2 className="text-2xl mb-4">Edit Entry</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={editForm.content}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex justify-between gap-3 mt-4">
            {entry.tags && (
              <span className="flex items-center gap-2">
                <span className="text-lg">{moodEmojis[entry.tags] || "😐"}</span>
                <span className="capitalize">{entry.tags}</span>
              </span>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-[14px] bg-neutral-200 p-2 px-3 rounded-md hover:bg-neutral-300 transition">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEdit}
                className="text-[14px] bg-blue-600 text-white p-2 px-3 rounded-md hover:bg-blue-700 transition">
                  Save Changes
              </button>
            </div>
          </div>
        </form>
        </>
      )}

      <div className={isEditing ? "hidden" : "mb-4"}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif text-dark-brown">
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
      <p className={isEditing ? "hidden" : "text-dark-brown/80 leading-relaxed whitespace-pre-wrap"}>
        {entry.content}
      </p>
      <div className="flex items-center justify-between text-xs text-warm-gray mt-4">
          <span className="tracking-wide uppercase">{formattedDate}</span>
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(true)}><svg className={isEditing ? "hidden" : "p-1 rounded-md cursor-pointer hover:bg-blue-100 hover:fill-blue-800 transition"} xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#9f9f9f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg></button>
            <button onClick={toggleModal}><svg className={isEditing ? "hidden" : "p-1 rounded-md cursor-pointer hover:bg-red-100 hover:fill-red-800 transition"} xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#9f9f9f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
          </div>
      </div>
    </div>
  );
}
