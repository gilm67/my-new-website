import { LocaleProvider } from '@/locale/LocaleContext';
import HiringManagersContent from '@/site/pages/HiringManagersContent';

export const dynamic = 'force-static';

export default function Page() {
  // default English page
  return (
    <LocaleProvider locale="en">
      <HiringManagersContent />
    </LocaleProvider>
  );
}
