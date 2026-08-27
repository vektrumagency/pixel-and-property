"use client";

import { useState } from "react";

type Grouped = { id: string; category: string };

/**
 * Row-drag ordering for the admin tables. Rows reorder as the pointer moves and
 * are saved on drop. A drag across two categories is ignored, because that
 * would be a category change rather than a reorder.
 */
export function useDragOrder<T extends Grouped>(
  rows: T[],
  save: (idsByCategory: Record<string, string[]>) => Promise<{ error?: string } | void>
) {
  const [items, setItems] = useState(rows);
  const [dragId, setDragId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  function move(fromId: string, toId: string) {
    if (fromId === toId) return;
    setItems((prev) => {
      const from = prev.findIndex((x) => x.id === fromId);
      const to = prev.findIndex((x) => x.id === toId);
      if (from < 0 || to < 0) return prev;
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
    const idsByCategory: Record<string, string[]> = {};
    for (const item of items) {
      (idsByCategory[item.category] ??= []).push(item.id);
    }
    const result = await save(idsByCategory);
    setStatus(result && "error" in result && result.error ? "error" : "idle");
  }

  /** Spread onto each <tr> to make it draggable. */
  function rowProps(id: string) {
    return {
      draggable: true,
      onDragStart: () => setDragId(id),
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        if (dragId) move(dragId, id);
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        persist();
      },
      onDragEnd: () => setDragId(null),
    };
  }

  return { items, dragId, status, rowProps };
}
