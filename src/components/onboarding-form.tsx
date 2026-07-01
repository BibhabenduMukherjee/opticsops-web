"use client";

import { useState, type FormEvent } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function OnboardingForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? "Registration failed");
      }

      setState("success");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-4">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-400">
          ✓
        </div>
        <h3 className="text-xl font-semibold text-white">Check your inbox</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          We sent your API key and a link to your service map.
          Install the agent and you&apos;re live in under a minute.
        </p>
        <pre className="mt-6 rounded-xl border border-slate-700/60 bg-slate-950/80 p-4 text-left text-xs leading-relaxed text-slate-300 overflow-x-auto">
{`npm install @opticsops/agent

OTEL_SERVICE_NAME=your-service \\
OPTICSOPS_API_KEY=oo_...from email... \\
node --import @opticsops/agent/register app.js`}
        </pre>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
          Project name
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={64}
          placeholder="orders-api"
          className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
        />
        <p className="mt-1.5 text-xs text-slate-500">Becomes your OTEL_SERVICE_NAME</p>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20"
        />
        <p className="mt-1.5 text-xs text-slate-500">We&apos;ll email your API key — no password needed</p>
      </div>

      {state === "error" && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="glow-ring w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "loading" ? "Creating your project…" : "Get started free"}
      </button>
    </form>
  );
}