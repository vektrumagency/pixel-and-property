"use client";

import Link from "next/link";
import { useState } from "react";
import { reorderProjects } from "@/app/admin/(dashboard)/projects/actions";

export type ProjectRow = {
  id: string;
  name: string;
  category: "digital" | "management";
  location: string;
  year: string;
  published: boolean;
};

const categories: ProjectRow["category"][] = ["digital", "management"];

export function ProjectsTable({ rows }: { rows: ProjectRow[] }) {
  const [items, setItems] = useState(rows);
  const [dragId, setDragId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  function move(fromId: string, toId: string) {
    if (fromId === toId) return;
    setItems((prev) => {
      const from = prev.findIndex((x) => x.id === fromId);
      const to = prev.findIndex((x) => x.id === toId);
      if (from < 0 || to < 0) return prev;
      // Dragging across categories is not a reorder — it would need a category
      // change, which belongs in the edit form.
      if (prev[from].category !== prev[to].category) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  async function persist() {
    setDragId(null);
    setStatus("saving");
    // Each category is numbered from 1, so ids are sent one category at a time.
    for (const category of categories) {
      const ids = items.filter((x) => x.category === category).map((x) => x.id);
      if (!ids.length) continue;
      const result = await reorderProjects(ids);
      if (result?.error) {
        setStatus("error");
        return;
      }
    }
    setStatus("idle");
  }

  return (
    <div className="space-y-8">
      {status === "error" && (
        <p className="rounded border border-red-300 bg-red-50 px-4 py-3 text-[0.78rem] text-red-700">
          Failed to save the new order. Reload the page and try again.
        </p>
      )}

      {categories.map((category) => {
        const group = items.filter((x) => x.category === category);
        if (!group.length) return null;
        return (
          <div key={category}>
            <div className="mb-2 flex items-center gap-3">
              <h2 className="text-[0.78rem] font-medium capitalize text-neutral-700">
                {category}
              </h2>
              <span className="text-[0.65rem] text-neutral-400">
                {status === "saving" ? "Saving order…" : "Drag a row to reorder"}
              </span>
            </div>
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <table className="w-full text-[0.78rem]">
                <thead className="border-b border-neutral-200 bg-neutral-50 text-left">
                  <tr>
                    <th className="w-8 px-2 py-3" />
                    <th className="px-4 py-3 font-medium text-neutral-600">Name</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Location</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Year</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {group.map((p) => (
                    <tr
                      key={p.id}
                      draggable
                      onDragStart={() => setDragId(p.id)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragId) move(dragId, p.id);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        persist();
                      }}
                      onDragEnd={() => setDragId(null)}
                      className={`hover:bg-neutral-50 ${
                        dragId === p.id ? "opacity-40" : ""
                      }`}
                    >
                      <td className="cursor-grab px-2 py-3 text-center text-neutral-400 active:cursor-grabbing">
                        ⠿
                      </td>
                      <td className="px-4 py-3 font-medium text-black">{p.name}</td>
                      <td className="px-4 py-3 text-neutral-600">{p.location}</td>
                      <td className="px-4 py-3 text-neutral-600">{p.year}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                            p.published
                              ? "bg-green-100 text-green-700"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {p.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/projects/${p.id}`}
                          className="text-[0.72rem] text-black underline-offset-2 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
