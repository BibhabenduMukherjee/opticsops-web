'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProjectData {
  projectName: string;
  email: string;
  maskedApiKey: string;
  apiKey: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={copy}
      className="rounded px-2.5 py-1 text-xs font-medium text-slate-400 border border-slate-600 hover:border-slate-400 hover:text-slate-200 transition"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function PortalPage() {
  const router = useRouter();
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [error, setError] = useState('');
  const [showFullKey, setShowFullKey] = useState(false);

  const fetchProject = useCallback(async () => {
    const res = await fetch('/api/portal/me');
    if (res.status === 401) { router.push('/login'); return; }
    if (!res.ok) { setError('Failed to load project data.'); return; }
    setData(await res.json());
  }, [router]);

  useEffect(() => {
    fetchProject().finally(() => setLoading(false));
  }, [fetchProject]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  async function regenerateKey() {
    setRegenerating(true);
    setConfirmRegen(false);
    try {
      const res = await fetch('/api/portal/regenerate-key', { method: 'POST' });
      if (!res.ok) { setError('Failed to regenerate key.'); return; }
      const updated = await res.json() as { maskedApiKey: string; apiKey: string };
      setData((prev) => prev ? { ...prev, ...updated } : prev);
      setShowFullKey(true);
    } finally {
      setRegenerating(false);
    }
  }

  const dashboardUrl = data
    ? `${process.env.NEXT_PUBLIC_INGEST_URL ?? ''}/dashboard?apiKey=${data.apiKey}`
    : '';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sm font-bold text-sky-400">O</div>
          <span className="text-sm font-semibold tracking-tight text-white">OpticsOps</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">{data?.email}</span>
          <button
            onClick={logout}
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            Sign out
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Project header */}
          <div>
            <h1 className="text-2xl font-semibold text-white">{data.projectName}</h1>
            <p className="mt-1 text-sm text-slate-400">Your telemetry portal</p>
          </div>

          {/* API Key card */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200">API Key</h2>
              <button
                onClick={() => setShowFullKey((v) => !v)}
                className="text-xs text-slate-500 hover:text-slate-300 transition"
              >
                {showFullKey ? 'Hide' : 'Reveal'}
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3">
              <code className="flex-1 font-mono text-sm text-slate-300 break-all">
                {showFullKey ? data.apiKey : data.maskedApiKey}
              </code>
              <CopyButton text={data.apiKey} />
            </div>
            <div className="mt-4 flex items-center gap-3">
              {confirmRegen ? (
                <>
                  <span className="text-xs text-amber-400">This will break running services using the old key.</span>
                  <button
                    onClick={regenerateKey}
                    disabled={regenerating}
                    className="rounded px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition disabled:opacity-50"
                  >
                    {regenerating ? 'Regenerating…' : 'Confirm regenerate'}
                  </button>
                  <button
                    onClick={() => setConfirmRegen(false)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirmRegen(true)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition"
                >
                  Regenerate key
                </button>
              )}
            </div>
          </div>

          {/* Quick start */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6">
            <h2 className="mb-4 text-sm font-semibold text-slate-200">Quick start</h2>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-300 leading-relaxed">
{`npm install @opticsops/agent

OTEL_SERVICE_NAME=my-service \\
OPTICSOPS_API_KEY=${data.maskedApiKey} \\
node --import @opticsops/agent/register app.js`}
            </pre>
          </div>

          {/* Service map link */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">Service Map</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Live view of your services and dependencies.
                </p>
              </div>
              <a
                href={dashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-300 transition hover:bg-sky-500/20"
              >
                Open service map →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
