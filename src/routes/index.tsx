import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ListChecks, Clock3, CheckCircle2, Inbox } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { RequestCard } from '../components/requests/RequestCard';
import { CAMPUS_SERVICES } from '../config/campusServices';
import { CURRENT_STUDENT } from '../config/currentStudent';
import type { SupportRequest } from '../models/request';
import { requestService } from '../services';

function StatCard({ icon: Icon, label, value }: { icon: typeof ListChecks; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-lg font-semibold leading-tight text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [requests, setRequests] = useState<SupportRequest[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    requestService.listRequests(CURRENT_STUDENT.id).then((data) => {
      if (!cancelled) setRequests(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const openCount = requests?.filter((r) => r.status !== 'resolved' && r.status !== 'closed').length ?? 0;
  const inProgressCount = requests?.filter((r) => r.status === 'in_progress').length ?? 0;
  const resolvedCount = requests?.filter((r) => r.status === 'resolved' || r.status === 'closed').length ?? 0;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={`Welcome back, ${CURRENT_STUDENT.name.split(' ')[0]}`}
        description="Tell us what's going on and we'll route you to the right campus service."
        actions={
          <Link
            to="/new-request"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> New Request
          </Link>
        }
      />

      <div className="mb-8 grid grid-cols-3 gap-3">
        <StatCard icon={ListChecks} label="Open requests" value={openCount} />
        <StatCard icon={Clock3} label="In progress" value={inProgressCount} />
        <StatCard icon={CheckCircle2} label="Resolved" value={resolvedCount} />
      </div>

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Recent Requests</h2>
          {requests && requests.length > 0 && (
            <Link to="/my-requests" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
              View all
            </Link>
          )}
        </div>

        {requests === null && <LoadingState label="Loading your requests…" />}

        {requests !== null && requests.length === 0 && (
          <EmptyState
            icon={Inbox}
            title="No requests yet"
            description="Submit your first request and we'll take it from there."
          />
        )}

        {requests !== null && requests.length > 0 && (
          <div className="flex flex-col gap-3">
            {requests.slice(0, 3).map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Campus Service Categories</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CAMPUS_SERVICES.map((service) => (
            <div key={service.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-900">{service.name}</p>
              <p className="mt-1 text-xs text-slate-500">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
