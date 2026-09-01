'use client';

import { useCallback, useEffect, useState } from 'react';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  topPages: { path: string; views: number }[];
  topProjects: { title: string; views: number }[];
}

const PERIODS = [
  { label: 'Today', value: '1d' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '90 Days', value: '90d' },
  { label: 'This Year', value: '1y' },
] as const;

export function AnalyticsView() {
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async (p: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${p}`);
      if (res.ok) {
        setData(await res.json());
      } else {
        setData({ totalViews: 0, uniqueVisitors: 0, topPages: [], topProjects: [] });
      }
    } catch {
      setData({ totalViews: 0, uniqueVisitors: 0, topPages: [], topProjects: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAnalytics(period);
  }, [period, fetchAnalytics]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-h1 font-light">Analytics</h1>
        <p className="mt-2 max-w-prose text-small text-muted">
          Site traffic and content performance.
        </p>
      </div>

      {/* Period filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 text-small transition-colors ${
              period === p.value ? 'bg-ink text-paper' : 'bg-surface text-muted hover:text-ink'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-small text-muted">Loading...</p>}

      {!loading && data && (
        <>
          {/* Stat cards */}
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
            <div className="bg-paper p-6">
              <p className="text-meta text-muted">Total Views</p>
              <p className="numeric mt-3 text-h2 font-light">{data.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-paper p-6">
              <p className="text-meta text-muted">Unique Visitors</p>
              <p className="numeric mt-3 text-h2 font-light">
                {data.uniqueVisitors.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Top pages and projects */}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-h3 font-medium">Top Pages</h2>
              {data.topPages.length === 0 ? (
                <p className="mt-4 text-small text-muted">No data available for this period.</p>
              ) : (
                <div className="mt-4 space-y-px border border-line bg-line">
                  {data.topPages.map((page) => (
                    <div key={page.path} className="flex justify-between bg-paper px-4 py-3">
                      <span className="text-small">{page.path}</span>
                      <span className="numeric text-small text-muted">{page.views}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-h3 font-medium">Top Projects</h2>
              {data.topProjects.length === 0 ? (
                <p className="mt-4 text-small text-muted">No data available for this period.</p>
              ) : (
                <div className="mt-4 space-y-px border border-line bg-line">
                  {data.topProjects.map((project) => (
                    <div key={project.title} className="flex justify-between bg-paper px-4 py-3">
                      <span className="text-small">{project.title}</span>
                      <span className="numeric text-small text-muted">{project.views}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
