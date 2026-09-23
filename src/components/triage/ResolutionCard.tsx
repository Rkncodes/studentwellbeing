import { CheckCircle2, UserCog, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ActionType, Resolution } from '../../models/resolution';
import type { RequestStatus } from '../../models/request';
import { ActionTypeBadge } from '../common/ActionTypeBadge';
import { StatusBadge } from '../common/StatusBadge';

const BANNER_META: Record<ActionType, { heading: string; icon: LucideIcon; classes: string }> = {
  SELF_SERVICE: {
    heading: 'You can resolve this yourself',
    icon: CheckCircle2,
    classes: 'border-emerald-200 bg-emerald-50',
  },
  STAFF_ASSISTANCE: {
    heading: 'Staff assistance required',
    icon: UserCog,
    classes: 'border-indigo-200 bg-indigo-50',
  },
  ESCALATION: {
    heading: 'Urgent staff assistance required',
    icon: AlertTriangle,
    classes: 'border-red-200 bg-red-50',
  },
};

export function ResolutionCard({
  resolution,
  serviceName,
  status,
}: {
  resolution: Resolution;
  serviceName: string;
  status?: RequestStatus;
}) {
  const banner = BANNER_META[resolution.actionType];
  const Icon = banner.icon;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Resolution</p>

      {/* Deterministic banner — actionType + copy are never AI-authored. */}
      <div className={`rounded-lg border p-4 ${banner.classes}`}>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 shrink-0 text-slate-700" />
          <p className="text-sm font-semibold text-slate-900">{banner.heading}</p>
          <span className="ml-auto">
            <ActionTypeBadge actionType={resolution.actionType} />
          </span>
        </div>

        {resolution.actionType !== 'SELF_SERVICE' && (
          <p className="mt-2 flex items-center gap-1 text-sm text-slate-700">
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            Routed to: <span className="font-medium text-slate-900">{serviceName}</span>
          </p>
        )}
      </div>

      {/* AI-generated summary — visually secondary, clearly separate from the banner above. */}
      <div className="mt-3">
        <p className="text-xs text-slate-400">{resolution.caseTitle}</p>
        <p className="mt-0.5 text-sm text-slate-500">{resolution.actionRationale}</p>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="mb-1 text-xs text-slate-500">What you can do now</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {resolution.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>

      {status && (
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500">Request status</p>
          <StatusBadge status={status} />
        </div>
      )}

      {resolution.clarifyingQuestions.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="mb-1 flex items-center gap-1 text-xs text-slate-500">
            <HelpCircle className="h-3.5 w-3.5" /> You might also mention
          </div>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {resolution.clarifyingQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
