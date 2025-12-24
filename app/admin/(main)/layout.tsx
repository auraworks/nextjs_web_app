import { redirect } from 'next/navigation';
import { createClient } from '@/lib/server';
import AdminSidebar from './sidebar/page';

export default async function AdminMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 현재 로그인한 사용자 확인
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // 사용자의 role 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-full">
      <AdminSidebar />
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
