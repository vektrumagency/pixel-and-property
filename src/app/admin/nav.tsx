"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

const links = [
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/assets", label: "Assets" },
  { href: "/admin/leads", label: "Leads" },
];

export function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="flex w-56 flex-col border-r border-neutral-200 bg-white px-4 py-8">
      <div className="mb-8">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-black">
          Pixel & Property
        </span>
        <p className="mt-1 truncate text-[0.62rem] text-neutral-400">{userEmail}</p>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded px-3 py-2 text-[0.72rem] transition-colors ${
              pathname.startsWith(href)
                ? "bg-black text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={signOut}
        className="mt-auto rounded px-3 py-2 text-left text-[0.72rem] text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
      >
        Sign out
      </button>
    </aside>
  );
}
