import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus2, ListChecks, GraduationCap } from 'lucide-react';
import { CURRENT_STUDENT } from '../../config/currentStudent';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/new-request', label: 'New Request', icon: FilePlus2, end: false },
  { to: '/my-requests', label: 'My Requests', icon: ListChecks, end: false },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6">
          <div className="mb-8 flex items-center gap-2 px-2">
            <GraduationCap className="h-7 w-7 text-indigo-600" />
            <div>
              <p className="text-sm font-semibold leading-tight">Student Wellbeing</p>
              <p className="text-xs leading-tight text-slate-500">&amp; Campus Services</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-lg bg-slate-50 px-3 py-3">
            <p className="text-sm font-medium text-slate-800">{CURRENT_STUDENT.name}</p>
            <p className="truncate text-xs text-slate-500">{CURRENT_STUDENT.email}</p>
          </div>
        </aside>

        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
