import { Nav } from "@/components/nav";

export const metadata = {
  title: "How it works — OpticsOps",
  description: "How OpticsOps traces Node.js services automatically with zero instrumentation code.",
};

const steps = [
  {
    n: "1",
    title: "Install the agent",
    code: "npm install @opticsops/agent",
  },
  {
    n: "2",
    title: "Set two env vars",
    code: `OTEL_SERVICE_NAME=orders-api
OPTICSOPS_API_KEY=oo_your_key_here
OTEL_EXPORTER_OTLP_ENDPOINT=https://opticsops-ingest-551302578563.us-central1.run.app`,
  },
  {
    n: "3",
    title: "Preload the agent (no code change needed)",
    code: `# ESM apps
node --import @opticsops/agent/register app.js

# CommonJS apps
node --require @opticsops/agent/register app.js

# Or via NODE_OPTIONS (Docker / Kubernetes)
NODE_OPTIONS="--import @opticsops/agent/register" node app.js`,
  },
  {
    n: "4",
    title: "Open your service map",
    code: "https://opticsops-ingest.../dashboard?apiKey=oo_your_key",
  },
];

const pipeline = [
  {
    label: "Agent (in your process)",
    desc: "Monkey-patches Node.js http/https. Reads W3C traceparent headers on inbound requests, injects them on outbound calls. Zero framework dependency.",
    color: "border-sky-500/40 bg-sky-500/5",
  },
  {
    label: "Tail sampler",
    desc: "Buffers spans per trace. When the root span closes: if any span has status ≥ 500 or duration > 500 ms, the full trace is exported. Otherwise it is dropped.",
    color: "border-violet-500/40 bg-violet-500/5",
  },
  {
    label: "Heartbeat aggregator",
    desc: "Healthy, fast requests are never exported as spans. The agent counts source → destination call volume and flushes aggregate counts every 10 seconds.",
    color: "border-emerald-500/40 bg-emerald-500/5",
  },
  {
    label: "Ingest API (Cloud Run)",
    desc: "Receives OTLP spans (errors/slow) and heartbeat edge counts. Authenticates via X-Api-Key header. Writes to ClickHouse.",
    color: "border-amber-500/40 bg-amber-500/5",
  },
  {
    label: "ClickHouse (GCE VM)",
    desc: "Stores spans, heartbeat_edges, and a materialised view (service_edges_mv) that pre-aggregates edge call counts per minute.",
    color: "border-rose-500/40 bg-rose-500/5",
  },
  {
    label: "Dashboard (SSE + Cytoscape.js)",
    desc: "Queries the last 60 minutes of edges on load. Then opens a Server-Sent Events stream that refreshes every 5 seconds. Edges are coloured green / amber / red by error rate.",
    color: "border-sky-500/40 bg-sky-500/5",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mesh-bg relative min-h-screen">
      <div className="grid-overlay pointer-events-none absolute inset-0" />
      <Nav />

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-8">

        {/* Hero */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How OpticsOps works
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-400 max-w-2xl mx-auto">
            One npm package + two env vars. No manual spans. No framework plugins.
            No collector to deploy. Every HTTP hop is traced automatically.
          </p>
        </section>

        {/* Quick start */}
        <section className="mb-20">
          <h2 className="mb-8 text-xl font-semibold text-white">Quick start</h2>
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.n} className="glass-card rounded-xl p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-400">
                    {s.n}
                  </span>
                  <span className="text-sm font-medium text-slate-200">{s.title}</span>
                </div>
                <pre className="overflow-x-auto rounded-lg bg-slate-950/80 px-4 py-3 text-xs leading-relaxed text-slate-300 border border-slate-800">
                  {s.code}
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* What gets traced */}
        <section className="mb-20">
          <h2 className="mb-6 text-xl font-semibold text-white">What gets traced</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Traffic type</th>
                  <th className="px-5 py-3">What happens</th>
                  <th className="px-5 py-3">Storage cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="text-slate-300">
                  <td className="px-5 py-4 font-medium">Error (status ≥ 500)</td>
                  <td className="px-5 py-4">Full linked trace exported via OTLP</td>
                  <td className="px-5 py-4 text-rose-400">1 row per span</td>
                </tr>
                <tr className="text-slate-300">
                  <td className="px-5 py-4 font-medium">Slow (duration &gt; 500 ms)</td>
                  <td className="px-5 py-4">Full linked trace exported via OTLP</td>
                  <td className="px-5 py-4 text-amber-400">1 row per span</td>
                </tr>
                <tr className="text-slate-300">
                  <td className="px-5 py-4 font-medium">Healthy (fast + 2xx)</td>
                  <td className="px-5 py-4">Counted in heartbeat aggregation</td>
                  <td className="px-5 py-4 text-emerald-400">1 row per 10 s window</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            This is <strong className="text-slate-400">tail-based sampling</strong>. The sampling decision is made
            after the request completes — never before — so you always capture the full chain for
            any request that actually failed.
          </p>
        </section>

        {/* Data privacy */}
        <section className="mb-20">
          <h2 className="mb-6 text-xl font-semibold text-white">What the agent collects</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Collected</th>
                  <th className="px-5 py-3">Not collected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  ["HTTP method (GET, POST…)", "Request body"],
                  ["URL path + host", "Response body"],
                  ["HTTP status code", "Authorization / Cookie headers"],
                  ["Duration (ms)", "Query string values (only key names)"],
                  ["W3C traceparent for linking", "Database queries or file contents"],
                  ["Service name", "User PII (unless in the URL path)"],
                ].map(([col, nc]) => (
                  <tr key={col} className="text-slate-300">
                    <td className="px-5 py-3 text-emerald-400">✓ {col}</td>
                    <td className="px-5 py-3 text-slate-500">✗ {nc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pipeline */}
        <section className="mb-20">
          <h2 className="mb-6 text-xl font-semibold text-white">The pipeline</h2>
          <div className="space-y-3">
            {pipeline.map((p, i) => (
              <div key={p.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-mono">
                    {i + 1}
                  </div>
                  {i < pipeline.length - 1 && (
                    <div className="mt-1 w-px flex-1 bg-slate-800" />
                  )}
                </div>
                <div className={`mb-3 flex-1 rounded-xl border px-5 py-4 ${p.color}`}>
                  <p className="text-sm font-semibold text-slate-200">{p.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-6 py-5">
            <h3 className="mb-3 text-sm font-semibold text-amber-300">Honest limitations</h3>
            <ul className="space-y-2 text-xs leading-relaxed text-slate-400">
              <li>
                <strong className="text-slate-300">Node.js only.</strong> The agent patches Node's
                built-in <code className="text-sky-400">http</code> / <code className="text-sky-400">https</code> modules.
                Python, Go, Java — not supported yet.
              </li>
              <li>
                <strong className="text-slate-300">Tail sampling misses silent errors.</strong> If a service
                crashes before the root span closes (process kill, OOM), that trace is never exported.
              </li>
              <li>
                <strong className="text-slate-300">No DB query tracing yet.</strong> The service map shows
                HTTP edges only. PostgreSQL, Redis, MongoDB calls are not traced (planned).
              </li>
              <li>
                <strong className="text-slate-300">No log correlation.</strong> Logs and traces are
                separate — you cannot click a trace and see the associated log lines (planned).
              </li>
              <li>
                <strong className="text-slate-300">Single ClickHouse VM.</strong> One GCE VM is a
                single point of failure. No replication, no automatic backup.
              </li>
              <li>
                <strong className="text-slate-300">Early beta.</strong> APIs and the dashboard may change
                between releases without a migration path.
              </li>
            </ul>
          </div>
        </section>

      </main>

      <footer className="relative z-10 border-t border-slate-800/60 py-6 text-center text-xs text-slate-600">
        OpticsOps is MIT licensed · Built on OpenTelemetry + W3C Trace Context
      </footer>
    </div>
  );
}
