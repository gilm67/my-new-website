'use client';

import { useSearchParams } from 'next/navigation';

export default function PortabilityClient() {
  const sp = useSearchParams(); // safe here because this is a client component
  const ref = sp.get('ref') || '';

  // TODO: paste your real Portability Score™ widget UI here.
  // This is a minimal placeholder so the build passes.
  return (
    <div className="ep-container py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Portability Score™</h1>
      <p className="mt-3 text-white/80">
        This page is ready. Your query param <code>ref</code>: <span className="text-white/90">{ref || '—'}</span>
      </p>
    </div>
  );
}
