import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * List uploaded media files with stats.
 */
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  try {
    const entries = await fs.readdir(UPLOADS_DIR);
    const files = await Promise.all(
      entries.map(async (name) => {
        const stat = await fs.stat(path.join(UPLOADS_DIR, name));
        return { name, src: `/uploads/${name}`, size: stat.size, mtime: stat.mtimeMs };
      }),
    );
    files.sort((a, b) => b.mtime - a.mtime);
    return NextResponse.json(files);
  } catch {
    return NextResponse.json([]);
  }
}

/**
 * Delete an uploaded file by name.
 */
export async function DELETE(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'missing name' }, { status: 400 });
  }

  // Path-traversal guard: reject anything with slashes, dots-only segments, or
  // null bytes. The resolved path must stay inside UPLOADS_DIR.
  if (
    name.includes('/') ||
    name.includes('\\') ||
    name.includes('\0') ||
    name === '.' ||
    name === '..' ||
    name.startsWith('.')
  ) {
    return NextResponse.json({ error: 'invalid filename' }, { status: 400 });
  }

  const resolved = path.resolve(UPLOADS_DIR, name);
  if (!resolved.startsWith(UPLOADS_DIR + path.sep)) {
    return NextResponse.json({ error: 'invalid filename' }, { status: 400 });
  }

  try {
    await fs.unlink(resolved);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'file not found' }, { status: 404 });
  }
}
