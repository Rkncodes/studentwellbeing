import type { RequestStatus } from '../../models/request';

const STYLES: Record<RequestStatus, string> = {
  submitted: 'bg-slate-100 text-slate-700',
  triaged: 'bg-sky-100 text-sky-800',
  routed: 'bg-indigo-100 text-indigo-800',
  in_progress: 'bg-amber-100 text-amber-800',
  resolved: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-200 text-slate-600',
};

const LABELS: Record<RequestStatus, string> = {
  submitted: 'Submitted',
  triaged: 'Triaged',
  routed: 'Routed',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
