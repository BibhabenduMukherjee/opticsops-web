import { NextResponse } from "next/server";

const INGEST_URL = process.env.OPTICSOPS_INGEST_URL ?? "http://localhost:4318";

// 4 KB is more than enough for { name, email }
const MAX_BODY_BYTES = 4 * 1024;

// 8 second timeout — Cloud Run cold start can be slow
const FETCH_TIMEOUT_MS = 8_000;

export async function POST(request: Request) {
  // Reject oversized bodies before parsing
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const obj = raw as Record<string, unknown>;

  // Only forward the two fields we expect — drop anything else
  const name  = typeof obj.name  === "string" ? obj.name.trim()  : undefined;
  const email = typeof obj.email === "string" ? obj.email.trim() : undefined;

  if (!name || name.length < 2 || name.length > 64) {
    return NextResponse.json({ error: "name must be 2–64 characters" }, { status: 400 });
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${INGEST_URL.replace(/\/$/, "")}/v1/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    clearTimeout(timer);
    const timedOut = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      { error: timedOut ? "Request timed out. Try again." : "Could not reach the OpticsOps API. Try again later." },
      { status: timedOut ? 504 : 502 },
    );
  }
}
