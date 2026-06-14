import { getCurrentUser } from '@/app/actions/students';
import ProfileClient from '@/components/ProfileClient';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-1">
          Manage your student information, tech stack preferences, and matching state.
        </p>
      </div>

      <ProfileClient initialUser={user} />
    </div>
  );
}
