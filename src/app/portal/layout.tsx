import type { ReactNode } from 'react';

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0c1425] text-white">
      {children}
    </div>
  );
}
