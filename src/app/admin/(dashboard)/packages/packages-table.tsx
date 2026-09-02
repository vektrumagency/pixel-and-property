"use client";

import Link from "next/link";
import { useState } from "react";
import { setPackagePopular } from "@/app/admin/(dashboard)/packages/actions";

export type PackageRow = {
  id: string;
  name: string;
  section: "management" | "digital";
  popular: boolean;
  published: boolean;
  sortOrder: number;
};

/**
 * One section's table (management or digital) with an inline Popular
 * toggle. Kept scoped to a single section so toggling one row on can only
 * ever clear the OTHER rows already visible in this same table - matching
 * the section-exclusive rule enforced server-side in setPackagePopular.
 */
export function PackagesTable({ label, rows }: { label: string; rows: PackageRow[] }) {
  const [items, setItems] = useState(rows);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle(id: string, next: boolean) {
    setError(null);
    const previous = items;
    setItems((current) =>
      current.map((p) => ({
        ...p,
        popular: p.id === id ? next : next ? false : p.popular,
      }))
    );
    setPendingId(id);
    const result = await setPackagePopular(id, next);
    setPendingId(null);
    if (result?.error) {
      setItems(previous);
      setError(result.error);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {error && (
        <p className="border-b border-red-200 bg-red-50 px-4 py-2 text-[0.72rem] text-red-700">
          {error}
        </p>
      )}
      <table className="w-full text-[0.78rem]">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-left">
          <tr>
            <th className="px-4 py-3 font-medium text-neutral-600">Name</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Most Popular</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Sort</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-3 text-neutral-400">
                No {label.toLowerCase()} packages yet.
              </td>
            </tr>
          )}
          {items.map((p) => (
            <tr key={p.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3 font-medium text-black">{p.name}</td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={p.popular}
                  disabled={pendingId === p.id}
                  onChange={(e) => toggle(p.id, e.target.checked)}
                  className="h-4 w-4 disabled:opacity-50"
                  aria-label={`Mark "${p.name}" as most popular`}
                />
              </td>
              <td className="px-4 py-3 text-neutral-600">{p.sortOrder}</td>
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
                  href={`/admin/packages/${p.id}`}
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
  );
}
