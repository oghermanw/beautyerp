import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function SuperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'SUPER') {
    redirect('/login?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 relative">
      <Sidebar role="SUPER" userDisplayName={user.displayName} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Aura 美容院 - 總監控制中心 (SUPER)" role="SUPER" userDisplayName={user.displayName} />
        <main className="flex-1 p-3 md:p-6 pb-20 md:pb-6 overflow-y-auto">{children}</main>
      </div>
      <MobileNav role="SUPER" />
    </div>
  );
}
