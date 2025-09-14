import { Suspense } from 'react';
import Client from './client';

export default function Page() {
  return (
    <Suspense fallback={<div className="ep-container py-10">Loading…</div>}>
      <Client />
    </Suspense>
  );
}
