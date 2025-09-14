'use client';
import { useSearchParams } from 'next/navigation';

export default function Client() {
  const sp = useSearchParams();
  return <div className="ep-container py-10">Simulator (client)</div>;
}
