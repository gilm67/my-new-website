import { Suspense } from 'react';
import PortabilityClient from './portability-client';

export const dynamic = 'force-dynamic'; // or remove if you prefer static

export default function Page() {
  return (
    <Suspense fallback={<div className="ep-container py-10">Loading…</div>}>
      <PortabilityClient />
    </Suspense>
  );
}
