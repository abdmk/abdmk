import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { SettingsEditor } from '@/components/admin/SettingsEditor';
import { isAuthed } from '@/lib/auth';
import { getSettings } from '@/lib/content/store';

export default async function SettingsPage() {
  if (!(await isAuthed())) redirect('/admin/login');
  return (
    <AdminShell>
      <SettingsEditor initial={await getSettings()} />
    </AdminShell>
  );
}
