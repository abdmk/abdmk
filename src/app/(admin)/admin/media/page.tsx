import { promises as fs } from 'node:fs';
import path from 'node:path';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { isAuthed } from '@/lib/auth';
import { MediaLibrary } from './MediaLibrary';

export default async function MediaPage() {
  if (!(await isAuthed())) redirect('/admin/login');

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  let files: { name: string; src: string; size: number }[] = [];
  try {
    const entries = await fs.readdir(uploadsDir);
    const stats = await Promise.all(
      entries.map(async (name) => {
        const stat = await fs.stat(path.join(uploadsDir, name));
        return { name, src: `/uploads/${name}`, size: stat.size, mtime: stat.mtimeMs };
      }),
    );
    files = stats.sort((a, b) => b.mtime - a.mtime);
  } catch {
    /* uploads dir may not exist yet */
  }

  return (
    <AdminShell>
      <MediaLibrary initialFiles={files} />
    </AdminShell>
  );
}
