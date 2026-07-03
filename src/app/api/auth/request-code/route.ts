import { NextResponse } from 'next/server';

const INGEST = (process.env.OPTICSOPS_INGEST_URL ?? '').replace(/\/$/, '');

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const obj = body as Record<string, unknown>;
  const email = typeof obj.email === 'string' ? obj.email.trim() : '';
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const res = await fetch(`${INGEST}/v1/auth/request-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    clearTimeout(timer);
    const timedOut = err instanceof Error && err.name === 'AbortError';
    return NextResponse.json(
      { error: timedOut ? 'Request timed out.' : 'Service unavailable.' },
      { status: timedOut ? 504 : 502 },
    );
  }
}
