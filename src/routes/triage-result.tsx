import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, Pencil, FileWarning } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { UrgencyBadge } from '../components/common/UrgencyBadge';
import { EmptyState } from '../components/common/EmptyState';
import { ResolutionCard } from '../components/triage/ResolutionCard';
import { CAMPUS_SERVICES } from '../config/campusServices';
import type { TriageResult, Urgency } from '../models/triage';
import { requestService } from '../services';

interface LocationState {
  description: string;
  triage: TriageResult;
}

const URGENCY_OPTIONS: Urgency[] = ['low', 'medium', 'high', 'critical'];

export function TriageResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [triage, setTriage] = useState<TriageResult | null>(state?.triage ?? null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  if (!state || !triage) {
    return (
      <div className="mx-auto max-w-2xl">
        <EmptyState
          icon={FileWarning}
          title="No triage result to show"
          description="Start a new support request to see the AI triage result here."
          action={
            <Link
              to="/new-request"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              New Support Request
            </Link>
          }
        />
      </div>
    );
  }

  function updateServiceId(serviceId: string) {
    const service = CAMPUS_SERVICES.find((s) => s.id === serviceId);
    if (!service || !triage) return;
    setTriage({ ...triage, suggestedService: service, category: service.category });
  }

  function updateUrgency(urgency: Urgency) {
    if (!triage) return;
    setTriage({ ...triage, urgency });
  }

  async function handleConfirm() {
    if (!triage || !state) return;
    setIsCreating(true);
    try {
      const created = await requestService.createRequest(state.description, triage);
      navigate(`/requests/${created.id}`, { replace: true });
    } finally {
      setIsCreating(false);
    }
  }

  const confidencePct = Math.round(triage.confidence * 100);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Review AI Triage Result"
        description="Confirm the suggested category and service, or edit before creating your support case."
      />

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Your request</p>
        <p className="mb-6 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{state.description}</p>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">AI Suggestion</p>
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            <Pencil className="h-3.5 w-3.5" />
            {isEditing ? 'Done editing' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs text-slate-500">Recommended Service</p>
            {isEditing ? (
              <select
                value={triage.suggestedService.id}
                onChange={(e) => updateServiceId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {CAMPUS_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-medium text-slate-900">{triage.suggestedService.name}</p>
            )}
          </div>

          <div>
            <p className="mb-1 text-xs text-slate-500">Category</p>
            <p className="text-sm font-medium text-slate-900">{triage.category}</p>
          </div>

          <div>
            <p className="mb-1 text-xs text-slate-500">Urgency</p>
            {isEditing ? (
              <select
                value={triage.urgency}
                onChange={(e) => updateUrgency(e.target.value as Urgency)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {URGENCY_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            ) : (
              <UrgencyBadge urgency={triage.urgency} />
            )}
          </div>

          <div>
            <p className="mb-1 text-xs text-slate-500">Confidence</p>
            <p className="text-sm font-medium text-slate-900">{confidencePct}%</p>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="mb-1 text-xs text-slate-500">Reason</p>
          <p className="text-sm text-slate-700">{triage.rationale}</p>
        </div>
      </div>

      <div className="mt-4">
        <ResolutionCard resolution={triage.resolution} serviceName={triage.suggestedService.name} />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Link
          to="/new-request"
          className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back
        </Link>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isCreating}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating case…
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" /> Confirm &amp; Create Support Case
            </>
          )}
        </button>
      </div>
    </div>
  );
}
