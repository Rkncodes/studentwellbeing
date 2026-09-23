import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  MessageSquareText,
  Sparkles,
  UserCog,
  ListChecks,
  Clock3,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { ActionTypeBadge } from '../components/common/ActionTypeBadge';

const HOW_IT_WORKS = [
  {
    icon: MessageSquareText,
    title: 'Describe',
    description: 'Tell us what’s going on, in your own words.',
  },
  {
    icon: Sparkles,
    title: 'AI Triage',
    description: 'We classify the category, urgency, and the right campus service.',
  },
  {
    icon: UserCog,
    title: 'Resolution',
    description: 'Get a clear next step — self-service, or routed to staff.',
  },
  {
    icon: ListChecks,
    title: 'Track',
    description: 'Follow your request from submitted to resolved.',
  },
];

const PREVIEW_STATS = [
  { icon: ListChecks, label: 'Open requests', value: 19 },
  { icon: Clock3, label: 'In progress', value: 0 },
  { icon: CheckCircle2, label: 'Resolved', value: 0 },
];

const PREVIEW_REQUESTS = [
  {
    title: 'Forgot student portal password',
    service: 'IT Help Desk',
    actionType: 'SELF_SERVICE' as const,
    status: 'resolved' as const,
    urgency: 'low' as const,
  },
  {
    title: 'Hostel fan not working',
    service: 'Housing & Residence Life',
    actionType: 'STAFF_ASSISTANCE' as const,
    status: 'in_progress' as const,
    urgency: 'medium' as const,
  },
  {
    title: 'Question about tuition due date',
    service: 'Financial Aid Office',
    actionType: 'STAFF_ASSISTANCE' as const,
    status: 'routed' as const,
    urgency: 'medium' as const,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header — compact, logo far left, cropped so only the visible mark shows */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:h-[72px] sm:gap-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="h-9 w-[84px] shrink-0 overflow-hidden">
              <img
                src="/srm-logo.jpeg"
                alt="SRM Institute of Science & Technology"
                className="-mt-[24px] h-[84px] w-[84px] max-w-none"
              />
            </div>
            <div className="min-w-0 border-l border-slate-200 pl-2 sm:pl-3">
              <p className="truncate text-sm font-semibold leading-tight text-slate-900">Student Wellbeing</p>
              <p className="hidden truncate text-xs leading-tight text-slate-500 sm:block">&amp; Campus Services</p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:px-3.5 sm:py-2 sm:text-sm"
          >
            Dashboard <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero — left-aligned, horizontal, Haveloc-style */}
        <section className="py-14 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
            <div className="min-w-0">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-5xl xl:text-6xl">
                Get the right campus support, without the guesswork.
              </h1>
              <p className="mt-5 max-w-lg text-base text-slate-600 sm:text-lg">
                Describe what you need in your own words. Student Wellbeing &amp; Campus Services helps route your
                request to the right campus service and keeps you informed through resolution.
              </p>
              <div className="mt-8">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700"
                >
                  Get Started <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="flex h-72 w-72 items-center justify-center rounded-3xl border border-indigo-100 bg-indigo-50/60">
                <Sparkles className="h-16 w-16 text-indigo-300" />
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-slate-100 py-14">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">How it works</h2>
            <p className="mt-1 text-sm text-slate-500">A simple, transparent path from problem to resolution.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-400">{i + 1}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                <p className="mt-1 text-sm text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard preview — the visual centerpiece */}
        <section className="border-t border-slate-100 py-14 pb-20">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">What you&apos;ll see</h2>
            <p className="mt-1 text-sm text-slate-500">Preview — illustrative example, not live data.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="ml-2 text-sm font-medium text-slate-700">Student Wellbeing &amp; Campus Services</span>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-lg font-semibold text-slate-900">Welcome back, Aarav</p>
              <p className="mt-0.5 text-sm text-slate-500">Here&apos;s what&apos;s happening with your requests.</p>

              <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
                {PREVIEW_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
                  >
                    <div className="shrink-0 rounded-md bg-indigo-50 p-2 text-indigo-600">
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold leading-tight text-slate-900">{stat.value}</p>
                      <p className="text-xs leading-tight text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mb-3 mt-7 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Recent Requests
              </p>
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {PREVIEW_REQUESTS.map((r) => (
                  <div key={r.title} className="px-4 py-4 sm:px-5">
                    <p className="text-sm font-medium text-slate-900">{r.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{r.service}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <ActionTypeBadge actionType={r.actionType} />
                      <StatusBadge status={r.status} />
                      <UrgencyBadge urgency={r.urgency} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
          Student Wellbeing &amp; Campus Services
        </footer>
      </main>
    </div>
  );
}
