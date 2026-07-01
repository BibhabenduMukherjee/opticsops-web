import { OnboardingForm } from "@/components/onboarding-form";
import { Nav } from "@/components/nav";

const features = [
  {
    title: "Zero instrumentation",
    body: "Preload the agent — every HTTP call is traced automatically.",
  },
  {
    title: "Linked traces",
    body: "One trace ID across services. Errors show the full chain.",
  },
  {
    title: "Signal over noise",
    body: "Healthy traffic is counted. Only anomalies export full spans.",
  },
];

export default function Home() {
  return (
    <div className="mesh-bg relative min-h-screen overflow-hidden">
      <div className="grid-overlay pointer-events-none absolute inset-0" />

      <Nav />

      <main className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-16">
        <section>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            Now on npm — Node.js 18+
          </p>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
            See which service
            <span className="block bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
              actually broke
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400">
            OpticsOps wraps your Node process and traces every HTTP hop — no manual spans,
            no framework plugins. Get your API key, install one package, see your live service map.
          </p>

          <div className="mt-10 space-y-4">
            {features.map((f) => (
              <div key={f.title} className="flex gap-3">
                <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-sky-500/20 text-center text-[10px] leading-5 text-sky-400">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{f.title}</p>
                  <p className="text-sm text-slate-500">{f.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="float-slow mt-10 hidden rounded-xl border border-slate-800 bg-slate-950/50 p-4 font-mono text-xs text-slate-400 lg:block">
            <p className="text-slate-500"># one command to trace your app</p>
            <p className="mt-1 text-sky-300/90">
              node --import @opticsops/agent/register app.js
            </p>
          </div>
        </section>

        <section className="glass-card glow-ring rounded-2xl p-8 sm:p-10">
          <h2 className="text-lg font-semibold text-white">Start free</h2>
          <p className="mt-1 text-sm text-slate-400">
            We&apos;ll email your API key and dashboard link. No credit card.
          </p>
          <div className="mt-8">
            <OnboardingForm />
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800/60 py-6 text-center text-xs text-slate-600">
        OpenTelemetry · W3C Trace Context · MIT License
      </footer>
    </div>
  );
}