import { NextResponse } from "next/server";

const INGEST_URL = process.env.OPTICSOPS_INGEST_URL ?? "http://localhost:4318";

export async function POST(request: Request) {
  let body: { name?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const res = await fetch(`${INGEST_URL.replace(/\/$/, "")}/v1/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the OpticsOps API. Try again later." },
      { status: 502 },
    );
  }
}