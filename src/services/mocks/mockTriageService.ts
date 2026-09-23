import { CAMPUS_SERVICES, getServiceById } from '../../config/campusServices';
import type { CampusService } from '../../models/service';
import type { ActionType, Resolution } from '../../models/resolution';
import type { TriageResult, Urgency } from '../../models/triage';
import type { TriageService } from '../api/triageService';

interface Rule {
  serviceId: string;
  urgency: Urgency;
  actionType: ActionType;
  keywords: string[];
  rationale: string;
}

const LOW_CONFIDENCE_THRESHOLD = 0.6;

const RULES: Rule[] = [
  {
    serviceId: 'svc-mental-health',
    urgency: 'critical',
    actionType: 'ESCALATION',
    keywords: ['suicide', 'self-harm', 'self harm', 'hopeless', 'panic attack', 'crisis'],
    rationale: 'Language suggests an urgent mental health crisis requiring immediate support.',
  },
  {
    serviceId: 'svc-mental-health',
    urgency: 'high',
    actionType: 'STAFF_ASSISTANCE',
    keywords: ['anxious', 'anxiety', 'depressed', 'depression', 'overwhelmed', 'stressed', 'stress'],
    rationale: 'Message describes emotional distress consistent with a mental health concern.',
  },
  {
    serviceId: 'svc-campus-safety',
    urgency: 'critical',
    actionType: 'ESCALATION',
    keywords: ['unsafe', 'harassment', 'assault', 'threat', 'stalking', 'emergency'],
    rationale: 'Message describes a safety concern that may need immediate attention.',
  },
  {
    serviceId: 'svc-financial-aid',
    urgency: 'medium',
    actionType: 'STAFF_ASSISTANCE',
    keywords: ['tuition', 'financial aid', 'scholarship', 'loan', 'bill', 'payment', 'afford'],
    rationale: 'Message references tuition or financial aid, matching the Financial Aid Office.',
  },
  {
    serviceId: 'svc-housing',
    urgency: 'medium',
    actionType: 'STAFF_ASSISTANCE',
    keywords: ['roommate', 'dorm', 'housing', 'residence hall', 'apartment', 'lease'],
    rationale: 'Message references housing or residence life topics.',
  },
  {
    serviceId: 'svc-academic-advising',
    urgency: 'low',
    actionType: 'SELF_SERVICE',
    keywords: ['class', 'course', 'schedule', 'advisor', 'major', 'credits', 'registration'],
    rationale: 'Message concerns academic planning or scheduling.',
  },
  {
    serviceId: 'svc-it-support',
    urgency: 'low',
    actionType: 'SELF_SERVICE',
    keywords: ['wifi', 'wi-fi', 'password', 'login', 'account locked', 'portal', 'email access'],
    rationale: 'Message describes a technology or account access issue.',
  },
];

function matchRule(description: string): { rule: Rule; service: CampusService } | undefined {
  const lower = description.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      const service = getServiceById(rule.serviceId);
      if (service) return { rule, service };
    }
  }
  return undefined;
}

const FALLBACK_SERVICE = CAMPUS_SERVICES.find((s) => s.id === 'svc-general')!;

// This mock only runs as the outer, last-resort fallback when the backend
// itself is unreachable (see services/index.ts) — it never talks to the real
// resolution templates (backend-owned, see server/resolutionTemplates.ts).
// Deliberately minimal/generic: no invented procedures, contacts, or policies.
function genericResolution(actionType: ActionType, serviceName: string, confidence: number): Resolution {
  const instructions =
    actionType === 'SELF_SERVICE'
      ? [
          'Based on what you described, you may be able to resolve this yourself using existing campus resources.',
          `If that does not resolve it, a staff member from ${serviceName} will review this request.`,
        ]
      : actionType === 'ESCALATION'
        ? [
            'This request has been flagged as urgent and routed for immediate attention.',
            `A staff member from ${serviceName} will follow up as soon as possible.`,
          ]
        : [`A staff member from ${serviceName} will review this request and follow up with you directly.`];

  return {
    actionType,
    actionRationale:
      actionType === 'ESCALATION'
        ? 'This was flagged as urgent based on what you wrote.'
        : 'Based on what you described, this is the suggested next step.',
    instructions,
    requiresStaff: actionType !== 'SELF_SERVICE',
    caseTitle: `${serviceName} Support Request`,
    clarifyingQuestions:
      confidence < LOW_CONFIDENCE_THRESHOLD ? ['Could you share a bit more detail about what is happening?'] : [],
  };
}

export const mockTriageService: TriageService = {
  async triage(description: string): Promise<TriageResult> {
    // Simulate network/AI processing latency for a realistic demo feel.
    await new Promise((resolve) => setTimeout(resolve, 900));

    const match = matchRule(description);

    if (!match) {
      const confidence = 0.45;
      return {
        category: FALLBACK_SERVICE.category,
        urgency: 'low',
        suggestedService: FALLBACK_SERVICE,
        confidence,
        rationale: 'No strong keyword match was found; routed to General Student Services for manual review.',
        resolution: genericResolution('STAFF_ASSISTANCE', FALLBACK_SERVICE.name, confidence),
      };
    }

    const confidence = 0.7 + Math.random() * 0.25;
    const actionType: ActionType = match.rule.urgency === 'critical' ? 'ESCALATION' : match.rule.actionType;

    return {
      category: match.service.category,
      urgency: match.rule.urgency,
      suggestedService: match.service,
      confidence,
      rationale: match.rule.rationale,
      resolution: genericResolution(actionType, match.service.name, confidence),
    };
  },
};
