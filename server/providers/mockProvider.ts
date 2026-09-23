import type { CampusService } from '../campusServices.js';
import type { ActionType, AIProvider, TriageResult, Urgency } from './aiProvider.js';
import { buildResolution } from '../resolution.js';

interface Rule {
  serviceId: string;
  urgency: Urgency;
  actionType: ActionType;
  keywords: string[];
  rationale: string;
}

const LOW_CONFIDENCE_THRESHOLD = 0.6;

// Same rules as src/services/mocks/mockTriageService.ts — duplicated for the
// same reason as campusServices.ts (backend can't import from src/).
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

function matchRule(description: string, services: CampusService[]): { rule: Rule; service: CampusService } | undefined {
  const lower = description.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      const service = services.find((s) => s.id === rule.serviceId);
      if (service) return { rule, service };
    }
  }
  return undefined;
}

function titleCase(category: string): string {
  return `${category} Support Request`;
}

export const mockProvider: AIProvider = {
  async getTriage(description: string, services: CampusService[]): Promise<TriageResult> {
    const fallbackService = services.find((s) => s.id === 'svc-general') ?? services[0];
    const match = matchRule(description, services);

    if (!match) {
      const urgency: Urgency = 'low';
      const confidence = 0.45;
      return {
        category: fallbackService.category,
        urgency,
        suggestedService: fallbackService,
        confidence,
        rationale: 'No strong keyword match was found; routed to General Student Services for manual review.',
        resolution: buildResolution(fallbackService, urgency, {
          actionType: 'STAFF_ASSISTANCE',
          actionRationale: 'This request did not clearly match a specific service, so a staff member will take a closer look.',
          caseTitle: titleCase(fallbackService.category),
          clarifyingQuestions:
            confidence < LOW_CONFIDENCE_THRESHOLD
              ? [
                  'Could you share a bit more detail about what is happening?',
                  'Which campus service do you think this is most related to?',
                ]
              : [],
        }),
      };
    }

    const confidence = 0.7 + Math.random() * 0.25;
    return {
      category: match.service.category,
      urgency: match.rule.urgency,
      suggestedService: match.service,
      confidence,
      rationale: match.rule.rationale,
      resolution: buildResolution(match.service, match.rule.urgency, {
        actionType: match.rule.actionType,
        actionRationale: match.rule.rationale,
        caseTitle: titleCase(match.service.category),
        clarifyingQuestions: confidence < LOW_CONFIDENCE_THRESHOLD ? ['Could you share a bit more detail about what is happening?'] : [],
      }),
    };
  },
};
