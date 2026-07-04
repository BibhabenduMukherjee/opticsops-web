import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  // unsafe-eval: React dev mode only (callstack reconstruction); omitted in production
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",    // Tailwind v4 inline styles
  "font-src 'self'",                      // Geist self-hosted via next/font
  "img-src 'self' data:",
  "connect-src 'self'",                   // only /api/* — ingest URL never exposed to browser
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "X-Frame-Options",           value: "DENY" },
  { key: "X-DNS-Prefetch-Control",    value: "off" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Content-Security-Policy",   value: CSP },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
