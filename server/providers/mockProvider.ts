import type { CampusService } from '../campusServices.js';
import type { AIProvider, TriageResult, Urgency } from './aiProvider.js';

interface Rule {
  serviceId: string;
  urgency: Urgency;
  keywords: string[];
  rationale: string;
}

// Same rules as src/services/mocks/mockTriageService.ts — duplicated for the
// same reason as campusServices.ts (backend can't import from src/).
const RULES: Rule[] = [
  {
    serviceId: 'svc-mental-health',
    urgency: 'critical',
    keywords: ['suicide', 'self-harm', 'self harm', 'hopeless', 'panic attack', 'crisis'],
    rationale: 'Language suggests an urgent mental health crisis requiring immediate support.',
  },
  {
    serviceId: 'svc-mental-health',
    urgency: 'high',
    keywords: ['anxious', 'anxiety', 'depressed', 'depression', 'overwhelmed', 'stressed', 'stress'],
    rationale: 'Message describes emotional distress consistent with a mental health concern.',
  },
  {
    serviceId: 'svc-campus-safety',
    urgency: 'critical',
    keywords: ['unsafe', 'harassment', 'assault', 'threat', 'stalking', 'emergency'],
    rationale: 'Message describes a safety concern that may need immediate attention.',
  },
  {
    serviceId: 'svc-financial-aid',
    urgency: 'medium',
    keywords: ['tuition', 'financial aid', 'scholarship', 'loan', 'bill', 'payment', 'afford'],
    rationale: 'Message references tuition or financial aid, matching the Financial Aid Office.',
  },
  {
    serviceId: 'svc-housing',
    urgency: 'medium',
    keywords: ['roommate', 'dorm', 'housing', 'residence hall', 'apartment', 'lease'],
    rationale: 'Message references housing or residence life topics.',
  },
  {
    serviceId: 'svc-academic-advising',
    urgency: 'low',
    keywords: ['class', 'course', 'schedule', 'advisor', 'major', 'credits', 'registration'],
    rationale: 'Message concerns academic planning or scheduling.',
  },
  {
    serviceId: 'svc-it-support',
    urgency: 'low',
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

export const mockProvider: AIProvider = {
  async getTriage(description: string, services: CampusService[]): Promise<TriageResult> {
    const fallbackService = services.find((s) => s.id === 'svc-general') ?? services[0];
    const match = matchRule(description, services);

    if (!match) {
      return {
        category: fallbackService.category,
        urgency: 'low',
        suggestedService: fallbackService,
        confidence: 0.45,
        rationale: 'No strong keyword match was found; routed to General Student Services for manual review.',
      };
    }

    return {
      category: match.service.category,
      urgency: match.rule.urgency,
      suggestedService: match.service,
      confidence: 0.7 + Math.random() * 0.25,
      rationale: match.rule.rationale,
    };
  },
};
