import { SiteHeader } from '@/components/site-header';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 page-with-header-only">
        {children}
      </main>
    </div>
  );
}
