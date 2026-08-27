"use client";

import { useState } from "react";
import { ProjectsTable, type ProjectRow } from "@/app/admin/(dashboard)/projects/projects-table";
import { ProjectsGrid } from "@/app/admin/(dashboard)/projects/projects-grid";

type View = "list" | "grid";

const STORAGE_KEY = "admin:projects:view";

function storedView(): View {
  // Reading during the first render would not match the server output, so the
  // stored choice is applied on the first click-free render via lazy state.
  try {
    return localStorage.getItem(STORAGE_KEY) === "grid" ? "grid" : "list";
  } catch {
    return "list";
  }
}

export function ProjectsView({ rows }: { rows: ProjectRow[] }) {
  const [view, setView] = useState<View>("list");
  const [restored, setRestored] = useState(false);

  // Restore the remembered view after mount, so the server and client agree on
  // the first paint. Private windows and blocked storage simply keep the list.
  if (!restored) {
    if (typeof window !== "undefined") {
      const saved = storedView();
      if (saved !== view) setView(saved);
      setRestored(true);
    }
  }

  function choose(next: View) {
    setView(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // A remembered view is a convenience, never a requirement.
    }
  }

  return (
    <div>
      <div className="mb-4 inline-flex overflow-hidden rounded border border-neutral-300">
        {(["list", "grid"] as View[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => choose(option)}
            aria-pressed={view === option}
            className={`px-3 py-1.5 text-[0.7rem] capitalize transition-colors ${
              view === option
                ? "bg-black text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {view === "list" ? <ProjectsTable rows={rows} /> : <ProjectsGrid rows={rows} />}
    </div>
  );
}
