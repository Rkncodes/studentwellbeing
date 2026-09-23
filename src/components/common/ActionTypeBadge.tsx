import type { ActionType } from '../../models/resolution';

const STYLES: Record<ActionType, string> = {
  SELF_SERVICE: 'bg-emerald-100 text-emerald-800',
  STAFF_ASSISTANCE: 'bg-indigo-100 text-indigo-800',
  ESCALATION: 'bg-red-100 text-red-700',
};

const LABELS: Record<ActionType, string> = {
  SELF_SERVICE: 'Self-Service',
  STAFF_ASSISTANCE: 'Staff Assistance',
  ESCALATION: 'Urgent',
};

export function ActionTypeBadge({ actionType }: { actionType: ActionType }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[actionType]}`}>
      {LABELS[actionType]}
    </span>
  );
}
