import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { isAuthed } from '@/lib/auth';
import { getNavigation } from '@/lib/content/store';
import { NavigationEditor } from './NavigationEditor';

export default async function NavigationPage() {
  if (!(await isAuthed())) redirect('/admin/login');
  const navigation = await getNavigation();
  return (
    <AdminShell>
      <NavigationEditor initial={navigation.main} />
    </AdminShell>
  );
}
