"use client";

import { signOut } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="border-b border-warm-gray/20 bg-white px-6">
      <div className="max-w-4xl mx-auto py-6 flex items-center justify-between">
        <h1 className="text-2xl font-serif text-dark-brown">Journal</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-warm-gray hover:text-dark-brown transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
