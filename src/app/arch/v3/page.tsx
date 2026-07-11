import Link from "next/link";
import { Nav } from "@/components/nav";

export const metadata = {
  title: "Architecture v3 — Cross-instance consistency — OpticsOps",
  description: "How OpticsOps keeps sign-up, key security, and usage limits correct while running across multiple backend instances.",
};

const consistency = [
  {
    title: "Sign-up is rate-limited per real visitor, not per proxy hop",
    tag: "Abuse prevention",
    color: "border-sky-500/40 bg-sky-500/5",
    body: "Account creation is rate-limited by the originating client's IP address, correctly resolved through our load balancer rather than collapsed to one shared address — so the limit actually distinguishes between different visitors, consistently, no matter which backend instance handles the request.",
  },
  {
    title: "Key rotation takes effect platform-wide, in seconds",
    tag: "Keys",
    color: "border-emerald-500/40 bg-emerald-500/5",
    body: "OpticsOps' backend runs across several instances for availability. When you rotate your API key, that change now propagates to every instance within seconds — not just the one that handled your rotation request — so an old key stops working everywhere, quickly.",
  },
  {
    title: "Usage limits hold at the boundary, not just on average",
    tag: "Reliability",
    color: "border-violet-500/40 bg-violet-500/5",
    body: "Daily usage allowances are checked consistently across every backend instance, with extra verification specifically as a project approaches its limit — the moment it matters most for keeping the platform fair for everyone sharing it.",
  },
];

export default function ArchV3Page() {
  return (
    <div className="mesh-bg relative min-h-screen">
      <div className="grid-overlay pointer-events-none absolute inset-0" />
      <Nav />

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-8">

        <div className="mb-8">
          <Link href="/arch" className="text-xs text-slate-500 hover:text-sky-400 transition">
            ← Architecture
          </Link>
        </div>

        <section className="mb-14">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-bold text-emerald-400">
              v3
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-500">Current</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Cross-instance consistency
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-400 max-w-2xl">
            Everything in{" "}
            <Link href="/arch/v2" className="text-sky-400 hover:text-sky-300 transition">
              v2
            </Link>{" "}
            still holds. Our backend runs across multiple instances for availability — this round
            of work made sure that scaling out doesn&apos;t come at the cost of correctness for the
            things that matter: who you are, whether your key is still valid, and how much you&apos;ve used.
          </p>
        </section>

        <section className="mb-16 space-y-4">
          {consistency.map((c) => (
            <div key={c.title} className={`rounded-xl border px-6 py-5 ${c.color}`}>
              <div className="mb-2 flex items-center gap-2.5">
                <span className="rounded border border-slate-600/40 bg-slate-900/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  {c.tag}
                </span>
                <h2 className="text-sm font-semibold text-slate-100">{c.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{c.body}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 px-6 py-5 text-center">
          <p className="text-sm text-slate-400">
            The rest of the honest limitations — no compliance certification, single ClickHouse VM,
            no SSO or RBAC — haven&apos;t changed this round. See{" "}
            <Link href="/arch/v2" className="text-sky-400 hover:text-sky-300 transition">
              v2
            </Link>{" "}
            for the full list. This page will get a v4 the next time something material does.
          </p>
        </section>

      </main>

      <footer className="relative z-10 border-t border-slate-800/60 py-6 text-center text-xs text-slate-600">
        OpticsOps is MIT licensed · Built on OpenTelemetry + W3C Trace Context
      </footer>
    </div>
  );
}
