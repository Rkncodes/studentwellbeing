import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { SupportRequest } from '../../models/request';
import { StatusBadge } from '../common/StatusBadge';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { ActionTypeBadge } from '../common/ActionTypeBadge';
import { formatDateTime } from '../../lib/utils';

export function RequestCard({ request }: { request: SupportRequest }) {
  const resolution = request.triage?.resolution;
  const title = resolution?.caseTitle ?? request.description;
  const serviceName = request.triage?.suggestedService.name ?? request.assignmentGroup;

  return (
    <Link
      to={`/requests/${request.id}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/30"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{title}</p>
        {serviceName && <p className="mt-0.5 text-xs text-slate-500">{serviceName}</p>}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {resolution && <ActionTypeBadge actionType={resolution.actionType} />}
          <StatusBadge status={request.status} />
          {request.triage && <UrgencyBadge urgency={request.triage.urgency} />}
        </div>

        <p className="mt-2 text-xs text-slate-400">Submitted {formatDateTime(request.createdAt)}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
    </Link>
  );
}
