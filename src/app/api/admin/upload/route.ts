import { randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

/**
 * Media upload.
 *
 * Files land in /public/uploads and are referenced by path, so uploaded media
 * behaves exactly like the demo artwork. The extension allowlist is what decides
 * what may be written — the browser-supplied MIME type is not trusted.
 */

const ALLOWED: Record<string, 'image' | 'video' | 'gif'> = {
  '.jpg': 'image',
  '.jpeg': 'image',
  '.png': 'image',
  '.webp': 'image',
  '.avif': 'image',
  '.svg': 'image',
  '.gif': 'gif',
  '.mp4': 'video',
  '.webm': 'video',
  // Font files, for the type tester on a font page.
  '.woff': 'image',
  '.woff2': 'image',
  '.otf': 'image',
  '.ttf': 'image',
};

const MAX_BYTES = 60 * 1024 * 1024;

export async function POST(request: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'no file' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'file too large' }, { status: 413 });
  }

  const ext = path.extname(file.name).toLowerCase();
  const kind = ALLOWED[ext];
  if (!kind) {
    return NextResponse.json({ error: `unsupported file type: ${ext || 'none'}` }, { status: 415 });
  }

  // Rebuild the name from scratch: never trust the client's path separators.
  const base = slugify(path.basename(file.name, ext)) || 'file';
  const filename = `${base}-${randomBytes(4).toString('hex')}${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    src: `/uploads/${filename}`,
    kind: ext === '.gif' ? 'gif' : kind,
    size: file.size,
  });
}
