import { z } from 'zod';
import { CAMPUS_SERVICES } from './campusServices.js';

const SERVICE_IDS = CAMPUS_SERVICES.map((s) => s.id) as [string, ...string[]];

// What we accept back from any provider (Groq or mock) before we trust it.
// The provider only ever supplies a serviceId — the full CampusService object
// is re-hydrated server-side from our own catalog, never taken from the model.
export const ProviderTriageSchema = z.object({
  serviceId: z.enum(SERVICE_IDS),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  confidence: z.number().min(0).max(1),
  rationale: z.string().min(1).max(500),
  actionType: z.enum(['SELF_SERVICE', 'STAFF_ASSISTANCE', 'ESCALATION']),
  actionRationale: z.string().min(1).max(500),
  caseTitle: z.string().min(1).max(120),
  clarifyingQuestions: z.array(z.string().min(1).max(200)),
});

export type ProviderTriageOutput = z.infer<typeof ProviderTriageSchema>;

// The Groq Structured Outputs JSON Schema — kept in sync with ProviderTriageSchema.
// `strict: true` requires: every property in `required`, no extra keywords beyond
// what Groq's structured-output subset supports, and additionalProperties: false.
export function buildTriageJsonSchema() {
  return {
    type: 'object',
    properties: {
      serviceId: {
        type: 'string',
        enum: SERVICE_IDS,
        description: 'The id of the single best-matching campus service from the allowed list.',
      },
      urgency: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'How urgently the student needs a response.',
      },
      confidence: {
        type: 'number',
        description:
          "The model's own subjective confidence estimate between 0 and 1 for this classification. This is a self-reported estimate, not a measured probability.",
      },
      rationale: {
        type: 'string',
        description: 'A one or two sentence explanation for the chosen service and urgency.',
      },
      actionType: {
        type: 'string',
        enum: ['SELF_SERVICE', 'STAFF_ASSISTANCE', 'ESCALATION'],
        description:
          'SELF_SERVICE if the student can reasonably resolve this themselves right now. STAFF_ASSISTANCE if a staff member needs to act (e.g. create a case). ESCALATION if this is high/critical urgency and needs urgent attention.',
      },
      actionRationale: {
        type: 'string',
        description:
          'A short, student-readable explanation for the chosen action type, based only on what the student wrote. Do not state specific institutional procedures, phone numbers, emails, URLs, or policies — those are added separately from verified data.',
      },
      caseTitle: {
        type: 'string',
        description: 'A short (under 10 words) neutral summary of the request, suitable as a support case title.',
      },
      clarifyingQuestions: {
        type: 'array',
        items: { type: 'string' },
        description:
          'If your confidence is below 0.6, 1-3 short questions that would help clarify the request. Otherwise an empty array.',
      },
    },
    required: [
      'serviceId',
      'urgency',
      'confidence',
      'rationale',
      'actionType',
      'actionRationale',
      'caseTitle',
      'clarifyingQuestions',
    ],
    additionalProperties: false,
  } as const;
}
