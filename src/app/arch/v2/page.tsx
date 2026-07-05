import Link from "next/link";
import { Nav } from "@/components/nav";

export const metadata = {
  title: "Architecture v2 — Reliability & security — OpticsOps",
  description: "How OpticsOps protects your API key, handles sign-in, and keeps one project's usage from affecting another's.",
};

const hardening = [
  {
    title: "API keys are never stored in plaintext",
    tag: "Keys",
    color: "border-sky-500/40 bg-sky-500/5",
    body: "Your key is shown to you exactly once — in the welcome email, and again if you regenerate it. After that, only a one-way cryptographic hash is kept, the same approach used for passwords. There's no \"forgot my key, show it to me again\" — only regenerate.",
  },
  {
    title: "Sign-in codes are single-use and short-lived",
    tag: "Login",
    color: "border-emerald-500/40 bg-emerald-500/5",
    body: "Each login code works exactly once. Submit it again — even seconds later, even before it expires — and it's rejected. Codes expire automatically, and repeated wrong guesses lock the code out well before brute-forcing six digits becomes practical.",
  },
  {
    title: "Your API key never travels in a URL your server logs",
    tag: "Dashboard",
    color: "border-violet-500/40 bg-violet-500/5",
    body: "The one-click dashboard link carries your key in a part of the URL that browsers never transmit to any server. Every other request the dashboard makes sends it as a request header instead — never as part of a URL.",
  },
  {
    title: "Every project has a fair-use ceiling",
    tag: "Reliability",
    color: "border-amber-500/40 bg-amber-500/5",
    body: "OpticsOps runs on shared infrastructure, so every project has a daily processing allowance (10,000 spans/day on the free tier) that keeps one team's traffic from degrading service for everyone else. Ordinary usage — even a busy service with real error volume — stays well under it.",
  },
];

export default function ArchV2Page() {
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
              v2
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-500">Current</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Reliability &amp; security hardening
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-400 max-w-2xl">
            Everything in{" "}
            <Link href="/arch/v1" className="text-sky-400 hover:text-sky-300 transition">
              v1
            </Link>{" "}
            still holds — this is what got added on top of it. Four things worth knowing if
            you&apos;re deciding whether to point production traffic at this.
          </p>
        </section>

        <section className="mb-16 space-y-4">
          {hardening.map((h) => (
            <div key={h.title} className={`rounded-xl border px-6 py-5 ${h.color}`}>
              <div className="mb-2 flex items-center gap-2.5">
                <span className="rounded border border-slate-600/40 bg-slate-900/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  {h.tag}
                </span>
                <h2 className="text-sm font-semibold text-slate-100">{h.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{h.body}</p>
            </div>
          ))}
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-xl font-semibold text-white">Sessions</h2>
          <div className="glass-card rounded-xl p-6">
            <p className="text-sm leading-relaxed text-slate-300">
              Signing in issues a session cookie that JavaScript can&apos;t read (<code className="text-sky-400">httpOnly</code>),
              only sent over HTTPS, and valid for 7 days — it survives closing your browser, so
              you&apos;re not asked to sign in again every visit. Signing out clears it from your
              browser immediately. A well-formed session token is a bearer credential like any other,
              so treat access to your machine and inbox accordingly.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-6 py-5">
          <h3 className="mb-3 text-sm font-semibold text-amber-300">Where this still falls short</h3>
          <ul className="space-y-2 text-xs leading-relaxed text-slate-400">
            <li>
              <strong className="text-slate-300">No compliance certification.</strong> No SOC2, HIPAA,
              or similar — see the <Link href="/compare" className="text-sky-400 hover:text-sky-300">comparison page</Link> for
              what that rules out.
            </li>
            <li>
              <strong className="text-slate-300">Single ClickHouse VM.</strong> Still the case as of{" "}
              <Link href="/arch/v1" className="text-sky-400 hover:text-sky-300">v1</Link> — no
              replication, no automated failover.
            </li>
            <li>
              <strong className="text-slate-300">No SSO, RBAC, or audit logs.</strong> One API key per
              project, one login per account. Fine for a small team, not built for an enterprise org chart yet.
            </li>
            <li>
              <strong className="text-slate-300">Early beta.</strong> This page will get a v3 the next
              time something material changes — it&apos;s a record, not a permanent guarantee.
            </li>
          </ul>
        </section>

      </main>

      <footer className="relative z-10 border-t border-slate-800/60 py-6 text-center text-xs text-slate-600">
        OpticsOps is MIT licensed · Built on OpenTelemetry + W3C Trace Context
      </footer>
    </div>
  );
}
