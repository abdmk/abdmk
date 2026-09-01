'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface MediaFile {
  name: string;
  src: string;
  size: number;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);
const VIDEO_EXTS = new Set(['.mp4', '.webm']);

function ext(name: string) {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i).toLowerCase() : '';
}

function isImage(name: string) {
  return IMAGE_EXTS.has(ext(name));
}

function isVideo(name: string) {
  return VIDEO_EXTS.has(ext(name));
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function MediaLibrary({ initialFiles }: { initialFiles: MediaFile[] }) {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [query, setQuery] = useState('');
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  /* ---- Filter ---------------------------------------------------------- */

  const filtered = useMemo(() => {
    if (!query) return files;
    const q = query.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, query]);

  /* ---- Upload ---------------------------------------------------------- */

  const uploadFile = useCallback(async (file: File) => {
    const id = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setUploading((prev) => [...prev, { id, name: file.name, progress: 0 }]);

    try {
      const xhr = new XMLHttpRequest();
      const form = new FormData();
      form.append('file', file);

      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploading((prev) => prev.map((u) => (u.id === id ? { ...u, progress } : u)));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText) as { src: string; kind: string; size: number };
              setFiles((prev) => [{ name: res.src.split('/').pop()!, src: res.src, size: res.size }, ...prev]);
            } catch { /* response parse error */ }
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.open('POST', '/api/admin/upload');
        xhr.send(form);
      });
    } catch {
      /* swallow -- item is removed from uploading list below */
    } finally {
      setUploading((prev) => prev.filter((u) => u.id !== id));
    }
  }, []);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      Array.from(fileList).forEach((f) => void uploadFile(f));
    },
    [uploadFile],
  );

  /* ---- Drag-and-drop --------------------------------------------------- */

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    setDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragging(false);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  /* ---- Copy path ------------------------------------------------------- */

  const copyPath = useCallback(async (src: string) => {
    try {
      await navigator.clipboard.writeText(src);
      setCopied(src);
      setTimeout(() => setCopied(null), 1500);
    } catch { /* clipboard not available */ }
  }, []);

  /* ---- Delete ---------------------------------------------------------- */

  const confirmDelete = useCallback(async (name: string) => {
    try {
      const res = await fetch(`/api/admin/media?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.name !== name));
      }
    } catch { /* network error */ }
    setDeleting(null);
  }, []);

  /* ---- Render ---------------------------------------------------------- */

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-light">Media</h1>
          <p className="mt-2 max-w-prose text-small text-muted">
            Upload and manage files. Click a thumbnail to copy its path.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-small font-medium text-paper"
        >
          <Icon name="plus" size={14} />
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* Search */}
      <div className="mb-6 flex max-w-sm items-center gap-2 border-b border-line pb-1">
        <Icon name="search" size={15} className="text-muted" />
        <input
          type="text"
          placeholder="Filter by filename..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-0 bg-transparent py-1.5 text-small outline-none placeholder:text-faint"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-muted hover:text-ink"
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      {/* Drop overlay */}
      {dragging && (
        <div className="mb-6 flex items-center justify-center rounded border-2 border-dashed border-ink/30 bg-sunken p-12">
          <p className="text-small text-muted">Drop files to upload</p>
        </div>
      )}

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div className="mb-6 space-y-2">
          {uploading.map((u) => (
            <div key={u.id} className="flex items-center gap-3 bg-sunken px-4 py-3">
              <Icon name="image" size={16} className="shrink-0 text-muted" />
              <span className="min-w-0 flex-1 truncate text-small">{u.name}</span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-ink transition-all duration-200"
                  style={{ width: `${u.progress}%` }}
                />
              </div>
              <span className="text-small tabular-nums text-muted">{u.progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* File grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Icon name="image" size={32} className="text-faint" />
          <p className="mt-4 text-small text-muted">
            {query ? 'No files match your search.' : 'No files uploaded yet.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((file) => (
            <div key={file.name} className="group relative bg-paper">
              {/* Thumbnail / preview */}
              <button
                type="button"
                onClick={() => void copyPath(file.src)}
                className="block w-full"
                title={`Copy path: ${file.src}`}
              >
                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-sunken">
                  {isImage(file.name) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.src}
                      alt={file.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : isVideo(file.name) ? (
                    <Icon name="play" size={32} className="text-muted" />
                  ) : (
                    <Icon name="download" size={32} className="text-muted" />
                  )}

                  {/* Copied feedback */}
                  {copied === file.src && (
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/80">
                      <span className="flex items-center gap-1.5 text-small font-medium text-paper">
                        <Icon name="check" size={14} />
                        Copied
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {/* Info row */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-small" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-small text-muted">{humanSize(file.size)}</p>
                </div>

                {/* Delete */}
                {deleting === file.name ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => void confirmDelete(file.name)}
                      className="p-1 text-small font-medium text-red-600 hover:text-red-700"
                      title="Confirm delete"
                    >
                      <Icon name="check" size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(null)}
                      className="p-1 text-muted hover:text-ink"
                      title="Cancel"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleting(file.name)}
                    className={cn(
                      'p-1 text-muted opacity-0 transition-opacity hover:text-ink',
                      'group-hover:opacity-100 focus:opacity-100',
                    )}
                    title="Delete file"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total count */}
      {files.length > 0 && (
        <p className="mt-4 text-small text-muted">
          {filtered.length === files.length
            ? `${files.length} file${files.length === 1 ? '' : 's'}`
            : `${filtered.length} of ${files.length} file${files.length === 1 ? '' : 's'}`}
        </p>
      )}
    </div>
  );
}
