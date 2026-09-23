import type { ActionType } from './providers/aiProvider.js';

interface ResolutionTemplate {
  instructions: string[];
}

// Per-service overrides, for once verified institutional content (real
// procedures, contacts, policies) exists. Intentionally empty for now — this
// application has no verified phone numbers, emails, URLs, or procedures for
// any service yet, so every service currently falls through to the generic
// template below. When real content is available, add it here keyed by
// CampusService.id; do not add anything here that hasn't been verified.
const SERVICE_TEMPLATES: Record<string, Partial<Record<ActionType, ResolutionTemplate>>> = {};

function genericTemplate(actionType: ActionType, serviceName: string): ResolutionTemplate {
  switch (actionType) {
    case 'SELF_SERVICE':
      return {
        instructions: [
          'Based on what you described, you may be able to resolve this yourself using existing campus resources.',
          `If that does not resolve it, a staff member from ${serviceName} will review this request.`,
        ],
      };
    case 'STAFF_ASSISTANCE':
      return {
        instructions: [`A staff member from ${serviceName} will review this request and follow up with you directly.`],
      };
    case 'ESCALATION':
      return {
        instructions: [
          'This request has been flagged as urgent and routed for immediate attention.',
          `A staff member from ${serviceName} will follow up as soon as possible.`,
        ],
      };
  }
}

export function getResolutionTemplate(serviceId: string, actionType: ActionType, serviceName: string): ResolutionTemplate {
  return SERVICE_TEMPLATES[serviceId]?.[actionType] ?? genericTemplate(actionType, serviceName);
}
