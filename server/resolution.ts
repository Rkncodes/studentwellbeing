import type { ActionType, Resolution, Urgency } from './providers/aiProvider.js';
import type { CampusService } from './campusServices.js';
import { getResolutionTemplate } from './resolutionTemplates.js';

export interface ResolutionInput {
  actionType: ActionType;
  actionRationale: string;
  caseTitle: string;
  clarifyingQuestions: string[];
}

const MAX_CLARIFYING_QUESTIONS = 3;

// Services where under-rated urgency carries outsized risk (wellbeing/safety).
// For these specifically, "high" is treated as escalation-worthy too, not just
// "critical" — see buildResolution below.
const HIGH_RISK_SERVICE_IDS = new Set(['svc-mental-health', 'svc-campus-safety']);

// Single merge point both providers (mock and Groq) funnel through. The
// provider only ever supplies judgment (actionType/rationale/etc) — the
// safety override and the actual instructions shown to the student are
// decided here, deterministically, so this logic can't diverge between
// providers.
export function buildResolution(service: CampusService, urgency: Urgency, input: ResolutionInput): Resolution {
  // Deterministic safety override: critical urgency always escalates,
  // regardless of what the provider decided. For high-risk services
  // (mental health, campus safety) "high" urgency escalates too, since an
  // under-rated-but-still-serious case there carries more risk than
  // elsewhere — see HIGH_RISK_SERVICE_IDS above.
  const shouldForceEscalation = urgency === 'critical' || (urgency === 'high' && HIGH_RISK_SERVICE_IDS.has(service.id));
  const actionType: ActionType = shouldForceEscalation ? 'ESCALATION' : input.actionType;

  const { instructions } = getResolutionTemplate(service.id, actionType, service.name);

  return {
    actionType,
    actionRationale: input.actionRationale,
    instructions,
    requiresStaff: actionType !== 'SELF_SERVICE',
    caseTitle: input.caseTitle,
    clarifyingQuestions: input.clarifyingQuestions.slice(0, MAX_CLARIFYING_QUESTIONS),
  };
}
