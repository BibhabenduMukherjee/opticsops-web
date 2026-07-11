import Link from "next/link";
import { Nav } from "@/components/nav";

export const metadata = {
  title: "Architecture — OpticsOps",
  description: "How OpticsOps is built, and how that's changed over time.",
};

const versions = [
  {
    href: "/arch/v3",
    tag: "v3",
    status: "Current",
    statusColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    title: "Cross-instance consistency",
    desc: "How sign-up, key security, and usage limits stay correct while our backend runs across multiple instances — written for anyone deciding whether to trust us with their telemetry.",
  },
  {
    href: "/arch/v2",
    tag: "v2",
    status: "Previous",
    statusColor: "border-slate-600/40 bg-slate-800/40 text-slate-400",
    title: "Reliability & security hardening",
    desc: "Everything in v1, plus how we handle API keys, login sessions, and per-project fair-use limits.",
  },
  {
    href: "/arch/v1",
    tag: "v1",
    status: "Original",
    statusColor: "border-slate-600/40 bg-slate-800/40 text-slate-400",
    title: "Core architecture",
    desc: "The four pieces — agent, ingest API, ClickHouse, portal — and how one request travels from your service to the dashboard.",
  },
];

export default function ArchIndexPage() {
  return (
    <div className="mesh-bg relative min-h-screen">
      <div className="grid-overlay pointer-events-none absolute inset-0" />
      <Nav />

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-8">
        <section className="mb-14 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Architecture
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-400 max-w-2xl mx-auto">
            How OpticsOps is put together, kept as a versioned record rather than a single page we
            silently edit. If something changes materially, it gets a new version here instead of
            quietly disappearing.
          </p>
        </section>

        <section className="space-y-4">
          {versions.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="glass-card group flex items-start gap-5 rounded-xl p-6 transition hover:border-sky-500/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 font-mono text-sm font-bold text-sky-400">
                {v.tag}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-2.5">
                  <h2 className="text-base font-semibold text-white group-hover:text-sky-300 transition">
                    {v.title}
                  </h2>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.statusColor}`}>
                    {v.status}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-400">{v.desc}</p>
              </div>
              <span className="mt-1 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-sky-400">
                →
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-14 rounded-xl border border-slate-700/50 bg-slate-800/30 px-6 py-5 text-center">
          <p className="text-sm text-slate-400">
            Want the practical quick-start instead of the architecture?{" "}
            <Link href="/how-it-works" className="text-sky-400 hover:text-sky-300 transition">
              See how it works →
            </Link>
          </p>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800/60 py-6 text-center text-xs text-slate-600">
        OpticsOps is MIT licensed · Built on OpenTelemetry + W3C Trace Context
      </footer>
    </div>
  );
}
