import type { Urgency } from '../../models/triage';

const STYLES: Record<Urgency, string> = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-700',
};

const LABELS: Record<Urgency, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[urgency]}`}>
      {LABELS[urgency]} urgency
    </span>
  );
}
