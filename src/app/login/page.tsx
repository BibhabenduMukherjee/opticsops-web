'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Step = 'email' | 'code';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
        return;
      }
      setStep('code');
    } catch {
      setError('Could not reach the server. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Incorrect code.');
        return;
      }
      router.push('/portal');
    } catch {
      setError('Could not reach the server. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0c1425] flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sm font-bold text-sky-400">
          O
        </div>
        <span className="text-sm font-semibold tracking-tight text-white">OpticsOps</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-8">
          {step === 'email' ? (
            <>
              <h1 className="text-lg font-semibold text-white mb-1">Sign in</h1>
              <p className="text-sm text-slate-400 mb-6">
                Enter the email you registered with and we&apos;ll send you a code.
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send code'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-white mb-1">Check your email</h1>
              <p className="text-sm text-slate-400 mb-6">
                We sent a 6-digit code to <span className="text-slate-200">{email}</span>.
                It expires in 10 minutes.
              </p>
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  autoFocus
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-center text-2xl font-mono tracking-widest text-white placeholder-slate-600 focus:border-sky-500 focus:outline-none"
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || code.length < 6}
                  className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
                >
                  {loading ? 'Verifying…' : 'Sign in'}
                </button>
              </form>
              <button
                onClick={() => { setStep('email'); setCode(''); setError(''); }}
                className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-300 transition"
              >
                Use a different email
              </button>
            </>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/" className="text-sky-400 hover:underline">
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
}
