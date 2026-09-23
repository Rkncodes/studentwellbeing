import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { SupportRequest } from '../../models/request';
import { StatusBadge } from '../common/StatusBadge';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { formatDateTime } from '../../lib/utils';

export function RequestCard({ request }: { request: SupportRequest }) {
  return (
    <Link
      to={`/requests/${request.id}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/30"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={request.status} />
          {request.triage && <UrgencyBadge urgency={request.triage.urgency} />}
          {request.triage && (
            <span className="text-xs font-medium text-slate-500">{request.triage.category}</span>
          )}
        </div>
        <p className="mt-2 truncate text-sm text-slate-800">{request.description}</p>
        <p className="mt-1 text-xs text-slate-400">
          Submitted {formatDateTime(request.createdAt)}
          {request.assignmentGroup ? ` · ${request.assignmentGroup}` : ''}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
    </Link>
  );
}
