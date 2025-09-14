import { markets } from '@/lib/markets';

export default function TestImport() {
  return (
    <pre style={{padding:12}}>
      {JSON.stringify({ count: markets.length, slugs: markets.map(m => m.slug) }, null, 2)}
    </pre>
  );
}
