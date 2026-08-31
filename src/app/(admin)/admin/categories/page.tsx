import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { CategoriesEditor } from '@/components/admin/CategoriesEditor';
import { isAuthed } from '@/lib/auth';
import { getCategories } from '@/lib/content/store';

export default async function CategoriesPage() {
  if (!(await isAuthed())) redirect('/admin/login');
  return (
    <AdminShell>
      <CategoriesEditor initial={await getCategories()} />
    </AdminShell>
  );
}
