'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import type { Lang } from '@/lib/content/types';
import { localePath, t } from '@/lib/i18n/config';
import { ui } from '@/lib/i18n/dictionary';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Enrollment {
  id: string;
  course_slug: string;
  enrolled_at: string;
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
}

interface CourseWithProgress {
  enrollment: Enrollment;
  totalLessons: number;
  completedCount: number;
  courseTitle: string;
}

export function AccountView({
  lang,
  initialUser,
}: {
  lang: Lang;
  initialUser: User | null;
}) {
  const tr = ui(lang);
  const [user, setUser] = useState<User | null>(initialUser);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseWithProgress[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const fetchEnrolledCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      // Fetch enrollments and progress together from our API
      const res = await fetch('/api/courses/enrollments');
      if (res.ok) {
        const data = await res.json();
        setEnrolledCourses(data.courses || []);
      }
    } catch {
      // best effort
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchEnrolledCourses();
  }, [user, fetchEnrolledCourses]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        setUser(data.user);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          password: form.get('password'),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        // Auto-login after registration
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.get('email'),
            password: form.get('password'),
          }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          setUser(loginData.user);
        } else {
          setTab('login');
        }
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/login', { method: 'DELETE' });
    setUser(null);
    setEnrolledCourses([]);
  }

  // ---- Logged-out view: auth forms ----
  if (!user) {
    return (
      <>
        <PageHeader
          title={tr.account.title}
          hues={['peach', 'lilac', 'sky']}
          className="mb-9 md:mb-12"
        />

        <div className="mx-auto max-w-md">
          {/* Tab switcher */}
          <div className="card flex overflow-hidden">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); }}
              className={cn(
                'flex-1 py-3.5 text-center text-small font-medium transition-colors duration-200',
                tab === 'login'
                  ? 'bg-sunken text-ink'
                  : 'text-muted hover:text-ink',
              )}
            >
              {tr.account.login}
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(''); }}
              className={cn(
                'flex-1 py-3.5 text-center text-small font-medium transition-colors duration-200',
                tab === 'register'
                  ? 'bg-sunken text-ink'
                  : 'text-muted hover:text-ink',
              )}
            >
              {tr.account.register}
            </button>
          </div>

          {/* Forms */}
          <div className="card mt-4 p-6 sm:p-8">
            {error && (
              <div className="mb-5 rounded-xl2 bg-red-50 px-4 py-3 text-small text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="label mb-2 block">
                    {tr.account.email}
                  </label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl2 border border-line bg-sunken px-4 py-3.5 text-body outline-none transition-colors focus:border-ink"
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="label mb-2 block">
                    {tr.account.password}
                  </label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl2 border border-line bg-sunken px-4 py-3.5 text-body outline-none transition-colors focus:border-ink"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? tr.common.loading : tr.account.loginBtn}
                </button>
                <p className="text-center text-meta text-muted">
                  {tr.account.noAccount}{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('register'); setError(''); }}
                    className="font-medium text-ink underline"
                  >
                    {tr.account.register}
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="reg-name" className="label mb-2 block">
                    {tr.account.name}
                  </label>
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full rounded-xl2 border border-line bg-sunken px-4 py-3.5 text-body outline-none transition-colors focus:border-ink"
                  />
                </div>
                <div>
                  <label htmlFor="reg-email" className="label mb-2 block">
                    {tr.account.email}
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl2 border border-line bg-sunken px-4 py-3.5 text-body outline-none transition-colors focus:border-ink"
                  />
                </div>
                <div>
                  <label htmlFor="reg-password" className="label mb-2 block">
                    {tr.account.password}
                  </label>
                  <input
                    id="reg-password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full rounded-xl2 border border-line bg-sunken px-4 py-3.5 text-body outline-none transition-colors focus:border-ink"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? tr.common.loading : tr.account.registerBtn}
                </button>
                <p className="text-center text-meta text-muted">
                  {tr.account.hasAccount}{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('login'); setError(''); }}
                    className="font-medium text-ink underline"
                  >
                    {tr.account.login}
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </>
    );
  }

  // ---- Logged-in view: dashboard ----
  return (
    <>
      <PageHeader
        title={`${tr.account.welcomeBack}, ${user.name}`}
        hues={['peach', 'lilac', 'sky']}
        meta={
          <button
            type="button"
            onClick={handleLogout}
            className="chip transition-colors duration-300 hover:bg-ink hover:text-surface"
          >
            <Icon name="arrowLeft" size={13} flipRtl />
            {tr.account.logout}
          </button>
        }
        className="mb-9 md:mb-12"
      />

      {/* User info */}
      <div className="card mb-5 p-6 sm:p-8 lg:mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sunken">
            <Icon name="user" size={20} className="text-muted" />
          </div>
          <div>
            <p className="font-medium text-ink">{user.name}</p>
            <p className="text-small text-muted">{user.email}</p>
          </div>
        </div>
      </div>

      {/* My courses */}
      <section>
        <h2 className="text-h2 mb-5 lg:mb-6">{tr.courses.myCourses}</h2>

        {loadingCourses ? (
          <div className="card p-10 text-center">
            <p className="text-lead text-muted">{tr.common.loading}</p>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-lead text-muted">{tr.courses.empty}</p>
            <Link
              href={localePath(lang, '/courses')}
              className="btn btn-primary mt-5 inline-flex"
            >
              {tr.courses.viewAllCourses}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enrolledCourses.map((item) => {
              const pct =
                item.totalLessons > 0
                  ? Math.round((item.completedCount / item.totalLessons) * 100)
                  : 0;
              return (
                <Link
                  key={item.enrollment.id}
                  href={localePath(lang, `/course/${item.enrollment.course_slug}`)}
                  className="card card-hover flex items-center gap-5 p-5 sm:p-6"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="text-h3 truncate">{item.courseTitle}</h3>
                    <p className="mt-1 text-small text-muted">
                      {item.completedCount}/{item.totalLessons} {tr.courses.completedLessons}
                    </p>
                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sunken">
                      <div
                        className="h-full rounded-full bg-ink transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="chip numeric">{pct}%</span>
                  </div>
                  <Icon name="arrowRight" size={16} flipRtl className="shrink-0 text-muted" />
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
