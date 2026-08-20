"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin/projects");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-lg border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-lg font-semibold text-black">Admin Login</h1>
          <p className="text-[0.72rem] text-neutral-500">Pixel & Property</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] font-medium text-neutral-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="rounded border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.68rem] font-medium text-neutral-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="rounded border border-neutral-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
        </div>

        {error && (
          <p className="text-[0.72rem] text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black py-2.5 text-[0.72rem] font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
