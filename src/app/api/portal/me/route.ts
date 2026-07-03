import { NextResponse, type NextRequest } from 'next/server';

const INGEST = (process.env.OPTICSOPS_INGEST_URL ?? '').replace(/\/$/, '');

export async function GET(request: NextRequest) {
  const token = request.cookies.get('oo_session')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);
  try {
    const res = await fetch(`${INGEST}/v1/portal/me`, {
      headers: { Authorization: `Bearer ${token}` },
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
