import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Plus } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { RequestCard } from '../components/requests/RequestCard';
import { CURRENT_STUDENT } from '../config/currentStudent';
import type { SupportRequest } from '../models/request';
import { requestService } from '../services';

export function MyRequestsPage() {
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

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="My Requests"
        description="Track the status of every support request you've submitted."
        actions={
          <Link
            to="/new-request"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> New Request
          </Link>
        }
      />

      {requests === null && <LoadingState label="Loading your requests…" />}

      {requests !== null && requests.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="No requests yet"
          description="Once you submit a support request, you'll be able to track its status here."
          action={
            <Link
              to="/new-request"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Submit your first request
            </Link>
          }
        />
      )}

      {requests !== null && requests.length > 0 && (
        <div className="flex flex-col gap-3">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
