'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function LandingSplash() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.prefetch?.('/en/about');
    if (pathname !== '/') return;

    const t = setTimeout(() => {
      if (window.location.pathname === '/') {
        router.replace('/en/about');
      }
    }, 1200);

    return () => clearTimeout(t);
  }, [pathname, router]);

  if (pathname !== '/') return null;

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-black"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="text-white text-2xl font-semibold">Loading…</div>
    </div>
  );
}
