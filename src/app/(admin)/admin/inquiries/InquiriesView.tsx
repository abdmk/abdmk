'use client';

import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/icons';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  service?: string;
  package?: string;
  message?: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'archived';
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
] as const;

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-ink text-paper',
  contacted: 'bg-surface text-ink',
  in_progress: 'bg-surface text-ink',
  completed: 'bg-surface text-muted',
  archived: 'bg-sunken text-muted',
};

export function InquiriesView() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/inquiries');
      if (!res.ok) {
        setError('Failed to load inquiries');
        return;
      }
      const data = await res.json();
      setInquiries(data);
    } catch {
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInquiries();
  }, [fetchInquiries]);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: status as Inquiry['status'] } : inq)),
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-h1 font-light">Inquiries</h1>
        <p className="mt-2 max-w-prose text-small text-muted">
          Contact form submissions and service inquiries.
        </p>
      </div>

      {loading && <p className="text-small text-muted">Loading...</p>}
      {error && <p className="text-small text-muted">{error}</p>}

      {!loading && !error && inquiries.length === 0 && (
        <p className="text-small text-muted">No inquiries yet.</p>
      )}

      {!loading && inquiries.length > 0 && (
        <div className="max-w-4xl space-y-px border border-line bg-line">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-paper">
              <button
                type="button"
                onClick={() => toggleExpand(inq.id)}
                className="flex w-full items-center gap-4 p-5 text-left"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-body font-medium">{inq.name}</span>
                    <span className="text-small text-muted">{inq.email}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-small text-muted">
                    {inq.service && <span>{inq.service}</span>}
                    {inq.package && (
                      <>
                        <span aria-hidden="true">/</span>
                        <span>{inq.package}</span>
                      </>
                    )}
                    <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <span
                  className={`inline-block px-3 py-1 text-meta ${STATUS_STYLES[inq.status] || 'bg-surface text-muted'}`}
                >
                  {STATUS_OPTIONS.find((s) => s.value === inq.status)?.label || inq.status}
                </span>
                <Icon
                  name="arrowRight"
                  size={14}
                  className={`text-faint transition-transform ${expandedId === inq.id ? 'rotate-90' : ''}`}
                />
              </button>

              {expandedId === inq.id && (
                <div className="border-t border-line px-5 pb-5 pt-4">
                  {inq.message && (
                    <div className="mb-4">
                      <p className="text-meta text-muted">Message</p>
                      <p className="mt-1 whitespace-pre-wrap text-small">{inq.message}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <label className="text-meta text-muted">Status</label>
                    <select
                      value={inq.status}
                      onChange={(e) => void updateStatus(inq.id, e.target.value)}
                      className="border border-line bg-paper px-3 py-1.5 text-small outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
