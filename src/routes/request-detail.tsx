import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileX2 } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { StatusBadge } from '../components/common/StatusBadge';
import { Timeline } from '../components/requests/Timeline';
import { TriageSummaryCard } from '../components/triage/TriageSummaryCard';
import { ResolutionCard } from '../components/triage/ResolutionCard';
import type { RequestStatus, SupportRequest } from '../models/request';
import { requestService } from '../services';

const NEXT_STATUS: Partial<Record<RequestStatus, { next: RequestStatus; label: string }>> = {
  routed: { next: 'in_progress', label: 'Mark In Progress (staff)' },
  in_progress: { next: 'resolved', label: 'Mark Resolved (staff)' },
  resolved: { next: 'closed', label: 'Close Request (staff)' },
};

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<SupportRequest | null | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    requestService.getRequest(id).then((data) => setRequest(data ?? null));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (request === undefined) {
    return <LoadingState label="Loading request…" />;
  }

  if (request === null) {
    return (
      <div className="mx-auto max-w-2xl">
        <EmptyState
          icon={FileX2}
          title="Request not found"
          description="This request may have been removed, or the link is incorrect."
          action={
            <Link to="/my-requests" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Back to My Requests
            </Link>
          }
        />
      </div>
    );
  }

  const nextStep = NEXT_STATUS[request.status];

  async function handleAdvance() {
    if (!nextStep || !id) return;
    setIsUpdating(true);
    try {
      await requestService.updateStatus(id, nextStep.next);
      load();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/my-requests" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Back to My Requests
      </Link>

      <PageHeader
        title="Request Details"
        description={`Submitted ${new Date(request.createdAt).toLocaleString()}`}
        actions={<StatusBadge status={request.status} />}
      />

      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Description</p>
          <p className="text-sm text-slate-700">{request.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">Assignment Group</p>
              <p className="font-medium text-slate-900">{request.assignmentGroup ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">ServiceNow Case</p>
              <p className="font-medium text-slate-900">{request.serviceNowCaseId ?? 'Not yet integrated'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Request ID</p>
              <p className="font-mono text-xs font-medium text-slate-900">{request.id}</p>
            </div>
          </div>
        </div>

        {request.triage && <TriageSummaryCard triage={request.triage} />}
        {request.triage && <ResolutionCard resolution={request.triage.resolution} />}

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-slate-400">Status Timeline</p>
          <Timeline events={request.timeline} />

          {nextStep && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleAdvance}
                disabled={isUpdating}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                {isUpdating ? 'Updating…' : `Simulate: ${nextStep.label}`}
              </button>
              <p className="mt-1 text-[11px] text-slate-400">
                Demo-only control — tomorrow this comes from real ServiceNow workflow updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
