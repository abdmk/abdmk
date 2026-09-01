import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { isAuthed } from '@/lib/auth';
import { AnalyticsView } from './AnalyticsView';

export default async function AnalyticsPage() {
  if (!(await isAuthed())) redirect('/admin/login');
  return (
    <AdminShell>
      <AnalyticsView />
    </AdminShell>
  );
}
