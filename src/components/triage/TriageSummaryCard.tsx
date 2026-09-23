import { Sparkles } from 'lucide-react';
import type { TriageResult } from '../../models/triage';
import { UrgencyBadge } from '../common/UrgencyBadge';

export function TriageSummaryCard({ triage }: { triage: TriageResult }) {
  const confidencePct = Math.round(triage.confidence * 100);

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5">
      <div className="mb-3 flex items-center gap-2 text-indigo-700">
        <Sparkles className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-wide">AI Triage Result</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-slate-500">Category</p>
          <p className="text-sm font-medium text-slate-900">{triage.category}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Urgency</p>
          <div className="mt-0.5">
            <UrgencyBadge urgency={triage.urgency} />
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500">Recommended Service</p>
          <p className="text-sm font-medium text-slate-900">{triage.suggestedService.name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Confidence</p>
          <p className="text-sm font-medium text-slate-900">{confidencePct}%</p>
        </div>
      </div>

      <div className="mt-4 border-t border-indigo-100 pt-3">
        <p className="text-xs text-slate-500">Reason</p>
        <p className="mt-0.5 text-sm text-slate-700">{triage.rationale}</p>
      </div>
    </div>
  );
}
