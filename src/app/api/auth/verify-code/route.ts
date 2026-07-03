import { NextResponse } from 'next/server';

const INGEST = (process.env.OPTICSOPS_INGEST_URL ?? '').replace(/\/$/, '');
const IS_PROD = process.env.NODE_ENV === 'production';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const obj = body as Record<string, unknown>;
  const email = typeof obj.email === 'string' ? obj.email.trim() : '';
  const code = typeof obj.code === 'string' ? obj.code.trim() : '';

  if (!email || !code) {
    return NextResponse.json({ error: 'email and code are required' }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const res = await fetch(`${INGEST}/v1/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const data = await res.json().catch(() => ({})) as Record<string, unknown>;
    if (!res.ok || typeof data.token !== 'string') {
      return NextResponse.json(data, { status: res.status });
    }

    // Set httpOnly session cookie — JS cannot read this (XSS protection)
    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set('oo_session', data.token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });
    return response;
  } catch (err) {
    clearTimeout(timer);
    const timedOut = err instanceof Error && err.name === 'AbortError';
    return NextResponse.json(
      { error: timedOut ? 'Request timed out.' : 'Service unavailable.' },
      { status: timedOut ? 504 : 502 },
    );
  }
}
