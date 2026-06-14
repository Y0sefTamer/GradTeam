import Sidebar from '@/components/Sidebar';
import { getCurrentUser } from '@/app/actions/students';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/api/logout');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar currentUser={currentUser} />
      <main className="flex-1 md:pl-64 min-h-screen flex flex-col">
        <div className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
