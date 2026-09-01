import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { isAuthed } from '@/lib/auth';
import { InquiriesView } from './InquiriesView';

export default async function InquiriesPage() {
  if (!(await isAuthed())) redirect('/admin/login');
  return (
    <AdminShell>
      <InquiriesView />
    </AdminShell>
  );
}
