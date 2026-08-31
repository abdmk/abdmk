import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/LoginForm';
import { isAuthed } from '@/lib/auth';

export default async function LoginPage() {
  if (await isAuthed()) redirect('/admin');
  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <LoginForm />
    </div>
  );
}
