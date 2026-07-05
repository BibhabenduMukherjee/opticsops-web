import Link from "next/link";
import { Nav } from "@/components/nav";

export const metadata = {
  title: "OpticsOps vs Datadog, Grafana, New Relic — honest comparison",
  description:
    "An honest feature comparison between OpticsOps and established observability platforms. We point out where we fall short.",
};

type Cell = { v: string; ok?: boolean; warn?: boolean; bad?: boolean };
type Row = { feature: string; opticsops: Cell; datadog: Cell; newrelic: Cell; grafana: Cell };

const rows: Row[] = [
  {
    feature: "Setup time",
    opticsops: { v: "~2 min (2 env vars)", ok: true },
    datadog:   { v: "30–90 min (agent + config)", warn: true },
    newrelic:  { v: "30–60 min (agent + account)", warn: true },
    grafana:   { v: "Hours (Prometheus + Loki + Tempo + dashboards)", bad: true },
  },
  {
    feature: "Node.js auto-tracing",
    opticsops: { v: "Yes — zero code change", ok: true },
    datadog:   { v: "Yes (proprietary APM agent)", ok: true },
    newrelic:  { v: "Yes (proprietary agent)", ok: true },
    grafana:   { v: "With OTEL Collector + Tempo", warn: true },
  },
  {
    feature: "Other languages",
    opticsops: { v: "Node.js only", bad: true },
    datadog:   { v: "15+ languages", ok: true },
    newrelic:  { v: "10+ languages", ok: true },
    grafana:   { v: "Any (OTEL-native)", ok: true },
  },
  {
    feature: "Service / dependency map",
    opticsops: { v: "Yes — live SSE updates", ok: true },
    datadog:   { v: "Yes (Service Catalog + APM)", ok: true },
    newrelic:  { v: "Yes (distributed tracing UI)", ok: true },
    grafana:   { v: "With Tempo + plugin", warn: true },
  },
  {
    feature: "Log correlation",
    opticsops: { v: "Not yet (planned)", bad: true },
    datadog:   { v: "Yes (unified platform)", ok: true },
    newrelic:  { v: "Yes", ok: true },
    grafana:   { v: "Yes (Loki + trace IDs)", ok: true },
  },
  {
    feature: "DB query tracing",
    opticsops: { v: "Not yet (planned)", bad: true },
    datadog:   { v: "Yes (APM database monitoring)", ok: true },
    newrelic:  { v: "Yes", ok: true },
    grafana:   { v: "With OTEL instrumentation", warn: true },
  },
  {
    feature: "Alerting",
    opticsops: { v: "Not yet (planned)", bad: true },
    datadog:   { v: "Yes (monitors + notifications)", ok: true },
    newrelic:  { v: "Yes (alerts + policies)", ok: true },
    grafana:   { v: "Yes (Alertmanager)", ok: true },
  },
  {
    feature: "Self-hostable",
    opticsops: { v: "Yes — you own the data", ok: true },
    datadog:   { v: "No — SaaS only", bad: true },
    newrelic:  { v: "No — SaaS only", bad: true },
    grafana:   { v: "Yes (full self-host)", ok: true },
  },
  {
    feature: "Open source",
    opticsops: { v: "MIT", ok: true },
    datadog:   { v: "Proprietary", bad: true },
    newrelic:  { v: "Proprietary", bad: true },
    grafana:   { v: "Apache 2.0 (OSS core)", ok: true },
  },
  {
    feature: "Price — small team (~10k spans/day)",
    opticsops: { v: "~₹0–500/month (your Cloud infra)", ok: true },
    datadog:   { v: "$31+/host/month — ~₹2,600+", bad: true },
    newrelic:  { v: "Free tier, then $25+/month", warn: true },
    grafana:   { v: "Free OSS, ~$0 self-hosted + ops time", ok: true },
  },
  {
    feature: "Price — growing team (1M spans/day)",
    opticsops: { v: "~₹2,000/month (upsize VM)", ok: true },
    datadog:   { v: "$300–1,000+/month", bad: true },
    newrelic:  { v: "$99+/month", warn: true },
    grafana:   { v: "Free OSS + your infra cost", ok: true },
  },
  {
    feature: "Tail-based sampling built in",
    opticsops: { v: "Yes — only errors + slow traces stored", ok: true },
    datadog:   { v: "Yes (APM retention filters)", ok: true },
    newrelic:  { v: "Partial (adaptive sampling)", warn: true },
    grafana:   { v: "With OpenTelemetry Collector", warn: true },
  },
  {
    feature: "Compliance / SOC2 / HIPAA",
    opticsops: { v: "Not audited — not suitable", bad: true },
    datadog:   { v: "SOC2, HIPAA, ISO 27001", ok: true },
    newrelic:  { v: "SOC2, HIPAA, FedRAMP", ok: true },
    grafana:   { v: "SOC2 (Cloud), self-host = your responsibility", warn: true },
  },
];

function tag(c: Cell) {
  if (c.ok)   return "text-emerald-400";
  if (c.warn) return "text-amber-400";
  if (c.bad)  return "text-rose-400";
  return "text-slate-400";
}

const wins = [
  "2-minute setup vs hours for any alternative",
  "You own the data — spans never leave your GCP project",
  "Cost: 10–100× cheaper than Datadog/New Relic for small teams",
  "MIT licensed — fork, modify, self-host entirely",
  "Tail sampling built in — no sampling config to write",
  "W3C Trace Context standard — compatible with any OTEL backend",
];

const loses = [
  "Node.js only — no Python, Go, Java, Ruby, .NET",
  "No log correlation (planned)",
  "No DB query tracing — pg, redis, mongoose not instrumented yet (planned)",
  "No alerting or notification rules yet (planned)",
  "No compliance certifications (SOC2, HIPAA) — not suitable for regulated industries",
  "Single VM ClickHouse — no replication, no automated backups",
  "Early beta — APIs and schema may change without migration",
  "Dashboard is basic — no custom queries, no saved views, no teams",
];

export default function ComparePage() {
  return (
    <div className="mesh-bg relative min-h-screen">
      <div className="grid-overlay pointer-events-none absolute inset-0" />
      <Nav />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-8">

        {/* Hero */}
        <section className="mb-14 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            OpticsOps vs the alternatives
          </h1>
          <p className="mt-4 text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            An honest comparison. We point out where we are behind — which is in a lot of places.
            OpticsOps is early stage and targets a specific niche: Node.js teams who want
            zero-config tracing without a $300/month bill.
          </p>
        </section>

        {/* Disclaimer */}
        <div className="mb-10 rounded-xl border border-amber-500/25 bg-amber-500/5 px-6 py-4 text-xs leading-relaxed text-slate-400">
          <strong className="text-amber-300">Disclaimer:</strong> Prices are estimates as of mid-2026 and change frequently.
          Datadog, New Relic, and Grafana are mature products with hundreds of engineers behind them.
          This table reflects publicly documented features — not a guarantee of capability.
          OpticsOps is beta software built by a small team. Do not use it for production systems
          where downtime, data loss, or compliance failures have serious consequences.
        </div>

        {/* Comparison table */}
        <section className="mb-16 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left w-48">Feature</th>
                <th className="px-4 py-3 text-left text-sky-400">OpticsOps</th>
                <th className="px-4 py-3 text-left">Datadog</th>
                <th className="px-4 py-3 text-left">New Relic</th>
                <th className="px-4 py-3 text-left">Grafana stack</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {rows.map((r) => (
                <tr key={r.feature} className="hover:bg-slate-800/20 transition">
                  <td className="px-4 py-3.5 text-slate-300 font-medium text-xs">{r.feature}</td>
                  <td className={`px-4 py-3.5 text-xs font-medium ${tag(r.opticsops)}`}>{r.opticsops.v}</td>
                  <td className={`px-4 py-3.5 text-xs ${tag(r.datadog)}`}>{r.datadog.v}</td>
                  <td className={`px-4 py-3.5 text-xs ${tag(r.newrelic)}`}>{r.newrelic.v}</td>
                  <td className={`px-4 py-3.5 text-xs ${tag(r.grafana)}`}>{r.grafana.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Where we win / lose */}
        <section className="mb-16 grid gap-6 sm:grid-cols-2">
          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 text-sm font-semibold text-emerald-400">Where OpticsOps wins</h3>
            <ul className="space-y-2.5">
              {wins.map((w) => (
                <li key={w} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                  <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="mb-4 text-sm font-semibold text-rose-400">Where OpticsOps falls short</h3>
            <ul className="space-y-2.5">
              {loses.map((l) => (
                <li key={l} className="flex gap-2 text-xs leading-relaxed text-slate-400">
                  <span className="mt-0.5 shrink-0 text-rose-500">✗</span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who should use this */}
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-semibold text-white">Who should use OpticsOps</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Good fit",
                color: "border-emerald-500/30 bg-emerald-500/5",
                items: [
                  "Node.js microservices (2–20 services)",
                  "Early-stage teams who can't justify $300+/month yet",
                  "Apps where service map + error traces is enough",
                  "Teams who want data on their own infrastructure",
                  "Developers evaluating observability before committing to a platform",
                ],
              },
              {
                title: "Probably not a fit",
                color: "border-amber-500/30 bg-amber-500/5",
                items: [
                  "Polyglot stacks (Python + Go + Node.js mixed)",
                  "Teams that need log search alongside traces",
                  "Apps with heavy DB query performance needs",
                  "On-call teams who need paging / alerting rules",
                ],
              },
              {
                title: "Definitely not a fit",
                color: "border-rose-500/30 bg-rose-500/5",
                items: [
                  "Healthcare, fintech, or legal — needs compliance certs",
                  "High-availability production with SLA requirements",
                  "Teams who need multi-region or HA ClickHouse",
                  "Enterprises needing SSO, RBAC, or audit logs",
                ],
              },
            ].map((col) => (
              <div key={col.title} className={`rounded-xl border px-5 py-4 ${col.color}`}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="text-xs leading-relaxed text-slate-400">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture link */}
        <section className="mb-12 rounded-xl border border-slate-700/50 bg-slate-800/30 px-6 py-5 text-center">
          <p className="text-sm text-slate-400">
            Wondering exactly how the single-VM tradeoff and data isolation work?{" "}
            <Link href="/arch" className="text-sky-400 hover:text-sky-300 transition">
              Read the architecture docs →
            </Link>
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <p className="text-slate-400 text-sm mb-4">
            If OpticsOps fits your situation — it is free to try with no credit card.
          </p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-blue-500"
          >
            Get your API key →
          </Link>
        </section>

      </main>

      <footer className="relative z-10 border-t border-slate-800/60 py-6 text-center text-xs text-slate-600">
        Comparison last updated July 2026 · Prices and features change — verify before deciding
      </footer>
    </div>
  );
}
