import { CheckCircle2, UserCog, AlertTriangle, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ActionType, Resolution } from '../../models/resolution';

const ACTION_META: Record<ActionType, { label: string; icon: LucideIcon; classes: string }> = {
  SELF_SERVICE: {
    label: 'Self-Service',
    icon: CheckCircle2,
    classes: 'border-emerald-100 bg-emerald-50/60',
  },
  STAFF_ASSISTANCE: {
    label: 'Staff Assistance',
    icon: UserCog,
    classes: 'border-indigo-100 bg-indigo-50/60',
  },
  ESCALATION: {
    label: 'Escalated',
    icon: AlertTriangle,
    classes: 'border-red-100 bg-red-50/60',
  },
};

export function ResolutionCard({ resolution }: { resolution: Resolution }) {
  const meta = ACTION_META[resolution.actionType];
  const Icon = meta.icon;

  return (
    <div className={`rounded-xl border p-5 ${meta.classes}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-700" />
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">{meta.label}</p>
      </div>

      <p className="text-sm font-medium text-slate-900">{resolution.caseTitle}</p>
      <p className="mt-1 text-sm text-slate-700">{resolution.actionRationale}</p>

      <div className="mt-4 border-t border-black/5 pt-3">
        <p className="mb-1 text-xs text-slate-500">Next steps</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {resolution.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>

      {resolution.clarifyingQuestions.length > 0 && (
        <div className="mt-4 border-t border-black/5 pt-3">
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
