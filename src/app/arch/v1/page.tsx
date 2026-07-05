import Link from "next/link";
import { Nav } from "@/components/nav";

export const metadata = {
  title: "Architecture v1 — Core design — OpticsOps",
  description: "The four pieces of OpticsOps and how one request travels from your service to the dashboard.",
};

const pieces = [
  {
    name: "Your service",
    kind: "npm package",
    desc: "The @opticsops/agent package loads into your Node.js process at startup. It patches the built-in http/https modules and undici (native fetch) so every HTTP call is observed automatically — no code changes, no framework plugin.",
    color: "border-sky-500/40 bg-sky-500/5",
  },
  {
    name: "Ingest API",
    kind: "Fastify on Cloud Run",
    desc: "Receives traces and health-check summaries from every instrumented service, authenticates each request, and is the only component with credentials to the datastore. Also serves the dashboard.",
    color: "border-amber-500/40 bg-amber-500/5",
  },
  {
    name: "Datastore",
    kind: "ClickHouse",
    desc: "Stores traces and call-graph data, scoped per project. Every query the ingest API runs is filtered to the calling project — one project's data is never visible from another's key.",
    color: "border-rose-500/40 bg-rose-500/5",
  },
  {
    name: "Portal",
    kind: "Next.js on Vercel",
    desc: "Where you sign up, sign in, and manage your API key. It never talks to the datastore directly, and never sees your ClickHouse credentials — it goes through the same authenticated ingest API everything else does.",
    color: "border-violet-500/40 bg-violet-500/5",
  },
];

const steps = [
  {
    n: "1",
    title: "A request enters your service",
    body: "The agent starts a span. If the request arrived from another instrumented service, it's linked to that service's trace via a standard W3C traceparent header — not a proprietary format.",
  },
  {
    n: "2",
    title: "Your handler calls another service",
    body: "The agent starts a child span and injects the trace header into the outgoing call, so the next hop can link back to this one — automatically, however deep the call chain goes.",
  },
  {
    n: "3",
    title: "The response comes back",
    body: "Fast and healthy → counted in a rolling aggregate, nothing exported. Slow or an error → the full linked trace for that request is captured and sent. This is tail-based sampling: the decision happens after the request finishes, so a failing request is never the one that got sampled out.",
  },
  {
    n: "4",
    title: "Data lands, scoped to your project",
    body: "The ingest API authenticates the incoming request and writes it against your project only. Every read later — the dashboard, the API — is scoped the same way.",
  },
  {
    n: "5",
    title: "You watch it happen",
    body: "The dashboard polls and streams live updates: which services exist, how they call each other, and the trace of anything that went wrong, in the order it actually happened.",
  },
];

export default function ArchV1Page() {
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
            <span className="rounded-full border border-slate-600/40 bg-slate-800/40 px-2.5 py-1 font-mono text-xs font-bold text-slate-400">
              v1
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-500">Original design</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Core architecture
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-400 max-w-2xl">
            Four pieces moving one signal end to end: a request happens somewhere in your service,
            gets traced, and shows up on a dashboard. This is the shape of it.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-xl font-semibold text-white">The four pieces</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {pieces.map((p) => (
              <div key={p.name} className={`rounded-xl border px-5 py-4 ${p.color}`}>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-200">{p.name}</p>
                  <p className="font-mono text-[11px] text-slate-500">{p.kind}</p>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            The agent and the portal never talk to each other, and neither ever holds a datastore
            credential — the ingest API is the only thing that does.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-xl font-semibold text-white">One request, start to finish</h2>
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`grid grid-cols-[32px_1fr] gap-4 py-5 ${i < steps.length - 1 ? "border-b border-slate-800/60" : ""}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/15 font-mono text-xs font-bold text-sky-400">
                  {s.n}
                </span>
                <div>
                  <p className="mb-1 text-sm font-medium text-slate-200">{s.title}</p>
                  <p className="text-xs leading-relaxed text-slate-400">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-xl font-semibold text-white">Isolation model</h2>
          <div className="glass-card rounded-xl p-6">
            <p className="text-sm leading-relaxed text-slate-300">
              Every project gets its own API key at signup. Every write and every read is scoped to
              the project that key belongs to — there&apos;s no shared view, no cross-project query
              path, and no way to see another project&apos;s services, traces, or call graph from your
              key. There&apos;s one datastore behind the whole platform, not one per customer;
              isolation is enforced in the application layer on every single query, not by physically
              separate infrastructure per project.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-700/50 bg-slate-800/30 px-6 py-5 text-center">
          <p className="text-sm text-slate-400">
            Curious what changed since this version?{" "}
            <Link href="/arch/v2" className="text-sky-400 hover:text-sky-300 transition">
              Read v2 →
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
