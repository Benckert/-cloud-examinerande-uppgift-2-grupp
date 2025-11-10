"use client";

import { useRouter } from "next/navigation";

type HeaderProps = {
  user: { name: string } | null;
};

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="border-b border-warm-gray/20 bg-white px-6">
      <div className="max-w-4xl mx-auto py-6 flex items-center justify-between">
        <h1 className="text-2xl font-serif text-dark-brown">
          {user
            ? `${user.name}${user.name.endsWith("s") ? "" : "'s"} Journal`
            : "Journal"}
        </h1>
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
