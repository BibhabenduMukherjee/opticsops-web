# OpticsOps Web

Marketing site and self-service onboarding for OpticsOps.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

## Environment

| Variable | Description |
|----------|-------------|
| `OPTICSOPS_INGEST_URL` | Backend ingest API (for `/api/register` proxy) |

## Backend requirements

The ingest API must have:

- `POST /v1/register` — creates project + sends API key via Resend
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` configured on the backend

## Deploy

Deploy to Vercel and set `OPTICSOPS_INGEST_URL` to your Cloud Run ingest URL.